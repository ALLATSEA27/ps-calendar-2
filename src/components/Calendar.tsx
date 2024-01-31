import React from "react";
import { useParams } from "react-router-dom";

const Calendar: React.FC = () => {
  const params = useParams();
  const year = params.year ? parseInt(params.year, 10) : NaN;
  const month = params.month ? parseInt(params.month, 10) : NaN;

  if (!isValidDate(year, month)) {
    return <div>Invalid date. Please enter a valid year and month.</div>;
  }

  return (
    <div>
      Calendar for {year}-{month}
    </div>
  );
};

const isValidDate = (year: number, month: number): boolean => {
  if (isNaN(year) || isNaN(month)) return false;
  if (month < 1 || month > 12) return false;
  return true;
};

export default Calendar;
