import React, { useContext } from 'react';
import { CalendarContext } from './App';
import '../Styles/YearView.css'

const YearView = () => {
  const { selectedDate } = useContext(CalendarContext);
  const yearStart = new Date(selectedDate.getFullYear(), 0, 1);
  const months = [];

  for (let i = 0; i < 12; i++) {
    const month = new Date(yearStart);
    month.setMonth(i);
    months.push(month);
  }

  return (
    <div className="year-view">
      <h2>{selectedDate.getFullYear()}</h2>
      <div className="year-months">
        {months.map((month) => (
          <div key={month} className="year-month">
            <span>{month.toLocaleString('default', { month: 'short' })}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearView;
