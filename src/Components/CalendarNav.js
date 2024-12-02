import React from 'react';
import '../Styles/CalendarNav.css'

const CalendarNav = ({ handlePrev, handleNext, handleChangeView }) => {
  return (
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
  );
};

export default CalendarNav;
