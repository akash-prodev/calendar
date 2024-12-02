import React, { useContext } from 'react';
import { CalendarContext } from './App';
import '../Styles/MonthView.css'

const MonthView = () => {
  const { selectedDate } = useContext(CalendarContext);
  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  const monthDates = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fill the month dates
  for (let i = 0; i < monthEnd.getDate(); i++) {
    const day = new Date(monthStart);
    day.setDate(i + 1);
    monthDates.push(day);
  }

  return (
    <div className="month-view">
      <h2>{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>

      {/* Row for days of the week */}
      <div className="days-of-week">
        {daysOfWeek.map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
      </div>

      {/* Grid for dates */}
      <div className="month-grid">
        {monthDates.map((date) => (
          <div
            key={date}
            className={`month-day ${date.getDate() === selectedDate.getDate() ? 'highlight' : ''}`}
          >
            <span>{date.getDate()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
