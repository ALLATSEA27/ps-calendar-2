import React, { useState, CSSProperties } from "react";
import Popup from "./Popup";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getISODay,
  parseISO,
  isValid,
} from "date-fns";
import { dataEvents } from "../services/Types/DataEvents";
import "../styles/Calendar.css";
import _ from "lodash";

interface CalendarGridProps {
  year: number;
  month: number;
  dataEvents: dataEvents[];
  isLoading: boolean;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  year,
  month,
  dataEvents,
}) => {
  const [popupDataEvent, setPopupDataEvent] = useState<dataEvents | null>(null);

  const startDate = startOfMonth(new Date(year, month));
  const endDate = endOfMonth(startDate);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const offset = getISODay(startDate) - 1;
  const emptyDays: (Date | null)[] = _.times(offset, () => null);

  const calendarDays: (Date | null)[] = [...emptyDays, ...days];

  const dataEventsByDate = _.groupBy(dataEvents, (dataEvent) => {
    const launchDate = parseISO(dataEvent.launchDate);
    return isValid(launchDate) ? format(launchDate, "yyyy-MM-dd") : undefined;
  });

  const validDataEventsByDate = _.omitBy(dataEventsByDate, _.isUndefined);

  const showPopup = (dataEvent: dataEvents) => {
    setPopupDataEvent(dataEvent);
  };

  const closePopup = () => {
    setPopupDataEvent(null);
  };

  return (
    <div className="calendarGrid">
      {calendarDays.map((day, index) => {
        const formattedDay = day ? format(day, "yyyy-MM-dd") : null;
        const dayDataEvents = formattedDay
          ? validDataEventsByDate[formattedDay] || []
          : [];
        const hasDataEvents = dayDataEvents.length > 0;

        return (
          <div key={index} className="day">
            {day && (
              <span
                className={
                  hasDataEvents ? "highlightedDateNumber" : "dateNumber"
                }
              >
                {format(day, "d")}
              </span>
            )}
            {dayDataEvents.map((dataEvent) => {
              const { id, imageFilenameThumb } = dataEvent;
              const imagePath = `/images/${imageFilenameThumb}.webp`;
              const backgroundImageStyle: CSSProperties = {
                backgroundImage: `url('${imagePath}')`,
                minWidth: "188px",
                minHeight: "100px",
              };

              return (
                <div
                  key={id}
                  className="event"
                  style={backgroundImageStyle}
                  onClick={() => showPopup(dataEvent)}
                />
              );
            })}
          </div>
        );
      })}
      {popupDataEvent && (
        <Popup
          summary={popupDataEvent.summary}
          title={popupDataEvent.title}
          imageFilenameFull={popupDataEvent.imageFilenameFull}
          learnMoreLink={popupDataEvent.learnMoreLink}
          purchaseLink={popupDataEvent.purchaseLink}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default CalendarGrid;
