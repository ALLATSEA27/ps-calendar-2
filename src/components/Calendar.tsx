import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isValid,
} from "date-fns";
import { fetchDataEvents } from "../services/FetchDataEvents";
import { dataEvents } from "../services/Types/DataEvents";

const Calendar = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState<dataEvents[]>([]);
  const [days, setDays] = useState<Date[]>([]);

  const year = params.year
    ? parseInt(params.year, 10)
    : new Date().getFullYear();
  const month = params.month
    ? parseInt(params.month, 10) - 1
    : new Date().getMonth(); // month is 0-indexed in JavaScript Date

  useEffect(() => {
    if (!isValidDate(year, month + 1)) {
      navigate(`/${format(new Date(), "yyyy/MM")}`);
    } else {
      const startDate = startOfMonth(new Date(year, month));
      const endDate = endOfMonth(new Date(year, month));
      const interval = eachDayOfInterval({ start: startDate, end: endDate });
      setDays(interval);

      // Fetch the events for the current month
      fetchDataEvents().then((eventsData) => {
        const eventsInMonth = eventsData.filter((event) => {
          const eventDate = new Date(event.launchDate);
          return eventDate >= startDate && eventDate <= endDate;
        });
        setEvents(eventsInMonth);
      });
    }
  }, [year, month, navigate]);

  const isValidDate = (year: number, month: number) => {
    const date = new Date(year, month - 1);
    return isValid(date) && month >= 1 && month <= 12;
  };

  const renderDay = (day: Date) => {
    const formattedDay = format(day, "yyyy-MM-dd");
    const dayEvents = events.filter(
      (event) =>
        format(new Date(event.launchDate), "yyyy-MM-dd") === formattedDay
    );
    return (
      <div key={formattedDay} className="day-cell">
        <span>{format(day, "d")}</span>
        {dayEvents.map((event) => (
          <div key={event.id} className="event">
            <img src={event.imageFilenameThumb} alt={event.title} />
            <div>{event.title}</div>
            {/* Add more event details here */}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1>Calendar for {format(new Date(year, month), "yyyy-MM")}</h1>
      <div className="grid-container">{days.map((day) => renderDay(day))}</div>
    </div>
  );
};

export default Calendar;
