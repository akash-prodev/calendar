import React, { useContext, useRef, useEffect } from 'react';
import { CalendarContext } from './App';
import '../Styles/DayView.css'

const DayView = () => {
  const {
    selectedDate,
    groupedEvents,
    toggleGroupVisibility,
    handleBoxClick,
    selectedEventDetails,
    setSelectedEventDetails,
    setGroupedEvents
  } = useContext(CalendarContext);


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
    const handleOutsideClickForDetailsBox = (event) => {
      const detailBoxes = document.querySelectorAll('.day-event-detail-box');
      let isClickInside = false;

      detailBoxes.forEach((box) => {
        if (box.contains(event.target)) {
          isClickInside = true;
        }
      });

      if (!isClickInside) {
        setGroupedEvents((prevGroupedEvents) =>
          prevGroupedEvents.map((group) => ({ ...group, isVisible: false }))
        );
      }
    };

    document.addEventListener('mousedown', handleOutsideClickForDetailsBox);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClickForDetailsBox);
    };
  }, []);

  const timeSlots = [];

  for (let i = 10; i <= 21; i++) {
    const displayHour = i > 12 ? i - 12 : i;
    const formattedHour = displayHour < 10 ? `0${displayHour}` : displayHour;
    const amPm = i < 12 ? 'AM' : 'PM';

    // Filter grouped events for the current time slot

    const convertTo12HourFormat = (time) => {
      const [hourMinute, period] = time.split(' ');
      const [hour] = hourMinute.split(':').map(Number);
      return { hour, period }; // Return both hour and period (AM/PM)
    };
    
    const eventsForTimeSlot = groupedEvents.filter((group) => {
      const [startTime] = group.time.split(' - ');
      const { hour: eventHour, period: eventPeriod } = convertTo12HourFormat(startTime);
    
      // Adjust slotHour and period based on formattedHour
      let slotHour = parseInt(formattedHour, 10); 
      let slotPeriod = formattedHour >= 12 ? 'PM' : 'AM'; // Determine if it's AM or PM based on formattedHour
    
      // Fix for handling 12AM and 12PM correctly
      if (slotHour === 12 && slotPeriod === 'AM') {
        slotHour = 0; // 12 AM is midnight, so it should be 0
      } else if (slotHour === 12 && slotPeriod === 'PM') {
        slotHour = 12; // 12 PM is noon, so it stays as 12
      } else if (slotHour > 12) {
        slotHour -= 12; // Convert hours greater than 12 (13 -> 1, 14 -> 2, ...)
        slotPeriod = 'PM'; // If the hour exceeds 12, switch to PM
      }
    
      // After 12:00 PM, we should continue with PM
      if (slotHour < 12 && slotPeriod === 'AM') {
        slotPeriod = 'PM'; // Adjust the period if needed
      }
    
      const eventDate = new Date(group.date); // assuming group.date is in a valid date format
      const slotDate = new Date(selectedDate); // selectedDate is the date the user is currently viewing
    
    
      // Filter by both date and time
      if (slotPeriod === eventPeriod && slotHour === eventHour && eventDate.toDateString() === slotDate.toDateString()) {
        return true;
      }
    
      return false;
    });
    
    
    timeSlots.push(
      <div className="day-time-slot" key={i}>
        <span>{formattedHour} {amPm}</span>
        <div className="day-slot-content">
          {eventsForTimeSlot.map((group, groupIndex) => (
            <div key={groupIndex} className="grouped">
              <div
                className="event-box"
                onClick={() =>
                  group.events.length === 1
                    ? handleBoxClick(group.events[0])
                    : toggleGroupVisibility(groupIndex)
                }
              >
                <h4>{group.events[0].jobRequestTitle}</h4>
                <p>
                  <strong>Interviewer:</strong> {group.events[0].firstName}
                </p>
                <p>
                  <strong>Time:</strong> {group.time}
                </p>
                {group.events.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGroupVisibility(groupIndex);
                    }}
                  >
                    {group.events.length}
                  </button>
                )}
              </div>
              <div className='day-group-style'>
              {group.isVisible &&
                group.events.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className="event-box day-event-detail-box"
                    onClick={() => handleBoxClick(event)}
                  >
                    <h4>{event.jobRequestTitle}</h4>
                    <p>
                      <strong>Interviewer:</strong> {event.firstName}
                    </p>
                    <p>
                      <strong>Time:</strong> {event.time}
                    </p>
                  </div>
                ))}
                </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="day-view">
      <h2>{selectedDate.toDateString()}</h2>
      <div className="day-time-slots">{timeSlots}</div>
      {selectedEventDetails && (
        <div className="event-details" ref={detailsRef}>
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
            }}>Join</button>
        </div>
      </div>
      )}
    </div>
  );
};

export default DayView;
