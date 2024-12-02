import React, { useContext } from 'react';
import { CalendarContext } from './App';
import '../Styles/CalendarHeader.css'

const CalendarHeader = () => {
  const { selectedDate, setSelectedDate } = useContext(CalendarContext);

  return (
    <div className="calendar-header">
      <div className="header-left">Your Todo's</div>
      <div className="header-right">
        <select
          value={selectedDate.getMonth()}
          onChange={(e) => setSelectedDate(new Date(selectedDate.getFullYear(), e.target.value, selectedDate.getDate()))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <select
          value={selectedDate.getFullYear()}
          onChange={(e) => setSelectedDate(new Date(e.target.value, selectedDate.getMonth(), selectedDate.getDate()))}
        >
          {Array.from({ length: 11 }, (_, i) => (
            <option key={i} value={2020 + i}>
              {2020 + i}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CalendarHeader;
