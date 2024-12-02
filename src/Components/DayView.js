import React, { useContext } from 'react';
import { CalendarContext } from './App';
import '../Styles/DayView.css';

const DayView = () => {
  const { selectedDate } = useContext(CalendarContext);
  const timeSlots = [];
  

  for (let i = 10; i <= 21; i++) {
    const displayHour = i > 12 ? i - 12 : i;
    const formattedHour = displayHour < 10 ? `0${displayHour}` : displayHour;
    const amPm = i < 12 ? 'AM' : 'PM';

    timeSlots.push(
      <div className="day-time-slot" key={i}>
        <span>{formattedHour} {amPm}</span>
        <div className="day-slot-content"></div>
      </div>
    );
  }

  return (
    <div className="day-view">
      <h2>{selectedDate.toDateString()}</h2>
      <div className="day-time-slots">{timeSlots}</div>
    </div>
  );
};

export default DayView;
