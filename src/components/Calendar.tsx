import { useState, useEffect, CSSProperties } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isValid,
} from "date-fns";
import { fetchDataEvents } from "../services/FetchDataEvents";
import { dataEvents } from "../services/Types/DataEvents";
import "../styles/Calendar.css";

const Calendar = () => {
  const params = useParams<{ year?: string; month?: string }>(); // Specify types for URL parameters
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState<dataEvents[]>([]);
  const [days, setDays] = useState<Date[]>([]);

  const year = params.year
    ? parseInt(params.year, 10)
    : new Date().getFullYear();
  const month = params.month
    ? parseInt(params.month, 10) - 1
    : new Date().getMonth(); // month is 0-indexed

  useEffect(() => {
    // Function to parse query parameters
    const parseQuery = (query: string): Record<string, string> => {
      return query
        .replace("?", "")
        .split("&")
        .reduce(
          (params, param) => {
            const [key, value] = param.split("=");
            params[key] = value;
            return params;
          },
          {} as Record<string, string>
        );
    };

    // Check for a redirect path in the query parameters
    const queryParams = parseQuery(location.search);
    if (queryParams.path) {
      navigate(`/${queryParams.path}`);
    } else if (!isValidDate(year, month + 1)) {
      navigate(`/${format(new Date(), "yyyy/MM")}`);
    } else {
      const startDate = startOfMonth(new Date(year, month));
      const endDate = endOfMonth(new Date(year, month));
      const interval = eachDayOfInterval({ start: startDate, end: endDate });
      setDays(interval);

      fetchDataEvents().then((eventsData) => {
        const eventsInMonth = eventsData.filter((event) => {
          const eventDate = new Date(event.launchDate);
          return eventDate >= startDate && eventDate <= endDate;
        });
        setEvents(eventsInMonth);
      });
    }
  }, [year, month, navigate, location.search]);

  const isValidDate = (year: number, month: number): boolean => {
    const date = new Date(year, month - 1);
    return isValid(date) && month >= 1 && month <= 12;
  };

  const renderDay = (day: Date): JSX.Element => {
    const formattedDay = format(day, "yyyy-MM-dd");
    const dayEvents = events.filter(
      (event) =>
        format(new Date(event.launchDate), "yyyy-MM-dd") === formattedDay
    );

    return (
      <div key={formattedDay} className="day-cell">
        <span>{format(day, "d")}</span>
        {dayEvents.map((dataEvent) => {
          const { id, imageFilenameThumb } = dataEvent;
          const imagePath = `/images/${imageFilenameThumb}.webp`;
          const backgroundImageStyle: CSSProperties = {
            backgroundImage: `url('${imagePath}')`,
          };

          return (
            <div key={id} className="event" style={backgroundImageStyle} />
          );
        })}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <h1 className="calendar-header">
        {format(new Date(year, month), "MMMM yyyy")}
      </h1>
      <div className="grid-container">{days.map((day) => renderDay(day))}</div>
    </div>
  );
};

export default Calendar;
