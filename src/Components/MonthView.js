import React, { useContext, useState, useRef, useEffect } from 'react';
import { CalendarContext } from './App';
import '../Styles/MonthView.css';

const MonthView = () => {
  const { selectedDate, groupByDay, handleBoxClick, selectedEventDetails, setSelectedEventDetails } = useContext(CalendarContext);
  const [expandedDays, setExpandedDays] = useState({}); // Track expanded states for days
  const detailsRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        setSelectedEventDetails(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);


  useEffect(() => {
    const handleOutsideClick = (event) => {
      const expandedDivs = document.querySelectorAll('.expanded-events');
      let isClickInside = false;
  
      expandedDivs.forEach((div) => {
        if (div.contains(event.target)) {
          isClickInside = true;
        }
      });
  
      if (!isClickInside) {
        // Reset the expandedDays state
        setExpandedDays({});
      }
    };
  
    document.addEventListener('mousedown', handleOutsideClick);
  
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  

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

  const toggleDayExpansion = (date) => {
    setExpandedDays((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const getEventsForDay = (date) => {
    const dateString = date.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
    return groupByDay.find((day) => day.date === dateString)?.events || [];
  };

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
        {monthDates.map((date) => {
          const eventsForDay = getEventsForDay(date);
          const isExpanded = expandedDays[date.toLocaleDateString('en-CA')];

          return (
            <div key={date} className="month-day">
              <span>{date.getDate()}</span>

              {eventsForDay.length > 0 && (
                <div className="event-container">
                  {/* Initial Event Box */}
                  <div
                    className="event-boxes">
                    <p>{eventsForDay[0].jobRequestTitle}</p>
                    <p>Interviewer:{eventsForDay[0].firstName}</p>
                    <p>Time:{eventsForDay[0].time}</p>
                    {eventsForDay.length > 1 && (
                      <button onClick={() => toggleDayExpansion(date.toLocaleDateString('en-CA'))}>
                        {eventsForDay.length}
                      </button>
                    )}
                  </div>

                  {/* Expanded Events */}
                  {isExpanded && (
                    <div className="expanded-events">
                      {eventsForDay.map((event, index) => (
                        <div
                          key={index}
                          className="event-boxes event-detail-boxes"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent bubbling
                            handleBoxClick(event);
                          }}
                        >
                          <p>{event.jobRequestTitle}</p>
                          <p>Interviewer:{event.firstName}</p>
                          <p>Time:{event.time}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
           {selectedEventDetails && (
        <div className="month-event-details" ref={detailsRef}>
          <div className="data">
            <p>Interview With: {selectedEventDetails.interviewWith}</p>
            <p>Position: {selectedEventDetails.position}</p>
            <p>Created By: {selectedEventDetails.createdBy} </p>
            <p>Interview Date:{selectedEventDetails.interviewDate}</p>
            <p>Interview Time:{selectedEventDetails.interviewTime}</p>
            <p>Interview Via: Google Meet</p>
            <div className='resume'>
              <p>Resume.docx</p>
              <img src={`${process.env.PUBLIC_URL}/visibility.png`} alt="visible"/>
              <img src={`${process.env.PUBLIC_URL}/download.png`} alt="download"/>
              </div>
              <div className='aadhar'>
            <p>AadharCard</p>
            <img src={`${process.env.PUBLIC_URL}/visibility.png`} alt="visible"/>
            <img src={`${process.env.PUBLIC_URL}/download.png`} alt="download"/>
            </div>
          </div>
          <div className='pics'>
          <img src={`${process.env.PUBLIC_URL}/meet.jpg`} alt="google meet" />
            <button
            onClick={()=>{
              window.open(selectedEventDetails.meetingLink, "_blank");
            }}
            >Join</button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default MonthView;
