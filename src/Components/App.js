import React, { useState } from 'react';
import '../index.css';
import Event from './Event'

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('week'); // Default view is week

  // Date handling functions for previous and next navigation
  const handlePrev = () => {
    if (view === 'day') {
      const prevDay = new Date(selectedDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setSelectedDate(prevDay);
    } else if (view === 'week') {
      const prevWeek = new Date(selectedDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setSelectedDate(prevWeek);
    } else if (view === 'month') {
      const prevMonth = new Date(selectedDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      setSelectedDate(prevMonth);
    } else if (view === 'year') {
      const prevYear = new Date(selectedDate);
      prevYear.setFullYear(prevYear.getFullYear() - 1);
      setSelectedDate(prevYear);
    }
  };

  const handleNext = () => {
    if (view === 'day') {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setSelectedDate(nextDay);
    } else if (view === 'week') {
      const nextWeek = new Date(selectedDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setSelectedDate(nextWeek);
    } else if (view === 'month') {
      const nextMonth = new Date(selectedDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setSelectedDate(nextMonth);
    } else if (view === 'year') {
      const nextYear = new Date(selectedDate);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setSelectedDate(nextYear);
    }
  };

  const handleChangeView = (newView) => {
    setView(newView);
  };

  const renderDayView = () => {
    const timeSlots = [];
    const dayDate = selectedDate;
    for (let i = 10; i <= 19; i++) {
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
        <h2>{dayDate.toDateString()}</h2>
        <div className="day-time-slots">
          {timeSlots}
        </div>
      </div>
    );
  };


  const renderWeekView = () => {
    const weekStart = new Date(selectedDate);
    weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      weekDates.push(day);
    }

    return (
      <div className="week-view">
        <div className="week-day-slots">

          <div className="week-time-column">
            {Array.from({ length: 10 }, (_, i) => {
              const hour = 10 + i;
              const displayHour = hour > 12 ? hour - 12 : hour;
              const amPm = hour < 12 || hour === 24 ? 'AM' : 'PM';
              const formattedHour = displayHour < 10 ? `0${displayHour}` : displayHour;
              return (
                <div key={i} className="week-time-slot">
                  <span>
                    {formattedHour} {amPm}
                  </span>
                </div>
              );
            })}
          </div>


          {weekDates.map((date) => {
            const formattedDate = `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' })}`;

            return (
              <div key={date} className="week-day">

                <span className="week-day-label">
                  {formattedDate}
                </span>
                {formattedDate === "29 Aug" && <Event />}

                <span className="week-day-label">
                  {date.toLocaleString('default', { weekday: 'long' })}
                </span>

                <div className="week-day-time-slots">

                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="week-event-slot">

                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };


  const renderMonthView = () => {
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


  const renderYearView = () => {
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

  const renderCalendarView = () => {
    switch (view) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      case 'year':
        return renderYearView();
      default:
        return renderMonthView();
    }
  };

  return (
    <div className="calendar-app">

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
      <div className="calendar-nav">
        <div className='navigators'>
          <button onClick={handlePrev}><p className='left-arrow'></p></button>
          <button onClick={handleNext}><p className='right-arrow'></p></button>
        </div>
        <div className="nav-buttons">
          <button onClick={() => handleChangeView('day')}>Today</button>
          <button onClick={() => handleChangeView('week')}>Week</button>
          <button onClick={() => handleChangeView('month')}>Month</button>
          <button onClick={() => handleChangeView('year')}>Year</button>
        </div>

      </div>
      <div className="calendar-view">{renderCalendarView()}</div>
    </div>
  );

};

export default App;

