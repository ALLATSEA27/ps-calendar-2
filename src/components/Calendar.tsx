import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CalendarGrid from "./CalendarGrid";
import { format, addMonths } from "date-fns";
import { fetchDataEvents } from "../services/FetchDataEvents";
import "../styles/Calendar.css";
import { dataEvents } from "../services/Types/DataEvents";

const Calendar: React.FC = () => {
  const params = useParams<{ year?: string; month?: string }>();
  const navigate = useNavigate();
  const [dataEvents, setDataEvents] = useState<dataEvents[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const parseYear = (yearParam?: string) => {
    const parsedYear = parseInt(yearParam || `${new Date().getFullYear()}`, 10);
    const currentYear = new Date().getFullYear();
    return isNaN(parsedYear) || parsedYear < 2000 || parsedYear > currentYear
      ? currentYear
      : parsedYear;
  };

  const parseMonth = (monthParam?: string) => {
    const parsedMonth =
      parseInt(monthParam || `${new Date().getMonth() + 1}`, 10) - 1;
    return isNaN(parsedMonth) || parsedMonth < 0 || parsedMonth > 11
      ? new Date().getMonth()
      : parsedMonth;
  };

  const year = parseYear(params.year);
  const month = parseMonth(params.month);
  const currentDate = new Date(year, month);

  const validateDate = (year: number, month: number) => {
    const currentYear = new Date().getFullYear();
    const isValidYear = year >= 2000 && year <= currentYear;
    const isValidMonth = month >= 1 && month <= 12;
    return isValidYear && isValidMonth;
  };

  useEffect(() => {
    let year = params.year
      ? parseInt(params.year, 10)
      : new Date().getFullYear();
    let month = params.month
      ? parseInt(params.month, 10) - 1
      : new Date().getMonth();

    if (!validateDate(year, month + 1)) {
      // Adjust month for zero-based index
      const currentDate = new Date();
      year = currentDate.getFullYear();
      month = currentDate.getMonth();
      navigate(`/${year}/${month + 1}`);
    } else {
      const fetchNewData = async () => {
        const newData = await fetchDataEvents();
        setDataEvents(newData);
        setIsLoading(false);
      };
      fetchNewData();
    }
  }, [params.year, params.month, navigate]);

  const handlePrevMonth = () => {
    const newDate = addMonths(currentDate, -1);
    navigate(`/${newDate.getFullYear()}/${newDate.getMonth() + 1}`);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    navigate(`/${newDate.getFullYear()}/${newDate.getMonth() + 1}`);
  };

  if (isLoading) {
    return (
      <div className="loadingScreen">
        <img className="loadingImage" src="/images/playstation.png" alt="" />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="monthHeader">
        <div className="navButtonContainer">
          <button onClick={handlePrevMonth} className="navButton">
            {"<"}
          </button>
        </div>
        <div className="titleContainer">
          <h1 className="title">{format(currentDate, "MMMM yyyy")}</h1>
        </div>
        <div className="navButtonContainer">
          <button onClick={handleNextMonth} className="navButton">
            {">"}
          </button>
        </div>
      </div>
      <div className="calendar">
        <div className="calendarHeader">
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <div key={day} className="dayOfWeek">
              {day}
            </div>
          ))}
        </div>
        <CalendarGrid
          year={currentDate.getFullYear()}
          month={currentDate.getMonth()}
          dataEvents={dataEvents}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Calendar;
