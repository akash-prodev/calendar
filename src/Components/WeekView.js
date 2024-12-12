import React, { useContext, useRef, useEffect } from 'react';
import { CalendarContext } from './App';
import '../Styles/WeekView.css'

const WeekView = () => {
  const { selectedDate, groupedEvents, toggleGroupVisibility, handleBoxClick, selectedEventDetails, setGroupedEvents, setSelectedEventDetails } = useContext(CalendarContext);

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
      const detailBoxes = document.querySelectorAll('.event-detail-box');
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


  const weekStart = new Date(selectedDate);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    weekDates.push(day);
  }

  const convertTo12HourFormat = (time) => {
    const [hourMinute, period] = time.split(' - ')[0].split(' ');
    const [hour] = hourMinute.split(':').map(Number);
    return { hour, period };
  };

  const getEventsForTimeslot = (date, hour) => {
    const formattedHour = hour > 12 ? hour - 12 : hour;
    const amPm = hour < 12 || hour === 24 ? 'AM' : 'PM';

    return groupedEvents.filter((group) => {
      const eventDate = new Date(group.date);
      const { hour: eventHour, period: eventPeriod } = convertTo12HourFormat(group.time);

      if (
        eventDate.toDateString() === date.toDateString() &&
        eventHour === formattedHour &&
        eventPeriod === amPm
      ) {
        return true;
      }
      return false;
    });
  };

  return (
    <div className="week-view">

      <div className="week-day-slots">

        <div className="week-time-column">
          {Array.from({ length: 12 }, (_, i) => {
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
              <span className="week-day-label">{formattedDate}</span>
              <span className="week-day-label">{date.toLocaleString('default', { weekday: 'long' })}</span>

              <div className="week-day-time-slots">
                {Array.from({ length: 12 }, (_, i) => {
                  const hour = 10 + i;
                  const eventsForTimeSlot = getEventsForTimeslot(date, hour);

                  return (
                    <div key={i} className="week-event-slot">
                      {eventsForTimeSlot.map((group, groupIndex) => (
                        <div key={groupIndex} className="event-group">
                          <div
                            className="event-box"
                            onClick={() =>
                              group.events.length === 1
                                ? handleBoxClick(group.events[0])
                                : toggleGroupVisibility(groupIndex)
                            }
                          >
                            <p>{group.events[0].jobRequestTitle}</p>
                            <p>
                              Interviewer:{group.events[0].firstName}
                            </p>
                            <p>
                              Time: {group.time}
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
                          <div className='group-style'>
                          {group.isVisible &&
                            group.events.map((event, eventIndex) => (
                                <div
                                  key={eventIndex}
                                  className="event-box event-detail-box"
                                  onClick={() => handleBoxClick(event)}
                                >
                                  <p>{event.jobRequestTitle}</p>
                                  <p>
                                    Interviewer: {event.firstName}
                                  </p>
                                  <p>
                                    Time:{event.time}
                                  </p>
                                </div>
                            ))}
                            </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
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
               }}
            >Join</button>
          </div>
        </div>
      )}
    </div>
  );
};


export default WeekView;

