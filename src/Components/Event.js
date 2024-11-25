import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';

const combineJsonFilesWithUniqueId = async () => {
    try {
      const calendarFromToResponse = await axios.get('/calendarfromtoenddate.json');
      const calendarMeetingResponse = await axios.get('/calendar_meeting.json');
  
      const calendarFromToData = calendarFromToResponse.data; // Array with 3 objects
      const calendarMeetingData = calendarMeetingResponse.data; // Single object
  
      if (Array.isArray(calendarFromToData)) {
        const newId = calendarFromToData.length + 1;
        const updatedCalendarMeetingData = { ...calendarMeetingData, id: newId };
        calendarFromToData.push(updatedCalendarMeetingData);
      } else {
        console.error("calendarFromToData is not an array.");
      }
  
      return calendarFromToData;
    } catch (error) {
      console.error("Error fetching or combining JSON files:", error);
      return [];
    }
  };

const Event = () =>{

    const [groupedEvents, setGroupedEvents] = useState([]);
    const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  
    const fetchData = async () => {
      try {
        const data = await combineJsonFilesWithUniqueId();
        const events = data.flatMap((item) => {
          const jobIds = [];
          if (item.job_id) jobIds.push(item.job_id);
          if (item.user_det?.job_id) jobIds.push(item.user_det.job_id);
  
          return jobIds.map((job) => {
            const jobRequestTitle = job.jobRequest_Title
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
  
            const firstName = item.user_det?.handled_by?.firstName || 'Unknown';
            const interviewWith =
              item.user_det.candidate.candidate_firstName.charAt(0).toUpperCase() +
              item.user_det.candidate.candidate_firstName.slice(1).toLowerCase() + ' ' +
              item.user_det.candidate.candidate_lastName.charAt(0).toUpperCase() +
              item.user_det.candidate.candidate_lastName.slice(1).toLowerCase();
            ;
  
            const formatTime = (timeString) => {
              if (!timeString) return 'Invalid Time';
              try {
                const timePart = timeString.split('T')[1].split('+')[0];
                const [hours, minutes] = timePart.split(':').map(Number);
                const period = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
                return `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
              } catch (error) {
                console.error("Error parsing time:", error, "Input:", timeString);
                return 'Invalid Time';
              }
            };
  
            const startTime = formatTime(job.start || item.start);
            const endTime = formatTime(job.end || item.end);
  
            const timeRange = (job.start || item.start) && (job.end || item.end)
              ? `${startTime} - ${endTime}`
              : 'Time Not Available';
  
            return {
              jobRequestTitle,
              firstName,
              time: timeRange,
              start: job.start || item.start,
              userRole: item.user_det?.handled_by?.userRole || '',
              interviewWith,
            };
          });
        });
  
        const groupedEvents = groupEvents(events);
        setGroupedEvents(groupedEvents);
      } catch (error) {
        console.error('Error processing data:', error);
      }
    };
  
    const groupEvents = (events) => {
      const groups = [];
      events.forEach((event) => {
        const existingGroup = groups.find(
          (group) =>
            group.time === event.time && group.jobRequestTitle === event.jobRequestTitle
        );
  
        if (existingGroup) {
          existingGroup.events.push(event);
        } else {
          groups.push({
            time: event.time,
            jobRequestTitle: event.jobRequestTitle,
            events: [event],
            isVisible: false,
          });
        }
      });
  
      return groups;
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    // const toggleGroupVisibility = (groupIndex) => {
    //   setGroupedEvents((prevGroupedEvents) =>
    //     prevGroupedEvents.map((group, index) =>
    //       index === groupIndex ? { ...group, isVisible: !group.isVisible } : group
    //     )
    //   );
    // };
  
    const handleBoxClick = (event) => {
      const interviewWith = event.interviewWith;
      const position = event.jobRequestTitle;
      const createdBy = event.userRole
        .split('_')
        .map((word, index) =>
          index === 0
            ? word.charAt(0).toUpperCase() + word.charAt(1).toUpperCase() + word.slice(2).toLowerCase() // Capitalize first two letters of the first word
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize only the first letter for other words
        )
        .join(' ');
  
      const interviewDate = event.start.split('T')[0];
      const formattedDate = `${interviewDate.split('-')[2]}th ${new Date(interviewDate).toLocaleString('default', {
        month: 'short',
      })} ${interviewDate.split('-')[0]}`;
      const interviewTime = event.time;
  
      setSelectedEventDetails({
        position,
        createdBy,
        interviewDate: formattedDate,
        interviewTime,
        interviewWith
      });
  
      setGroupedEvents((prevGroupedEvents) =>
        prevGroupedEvents.map((group) => ({ ...group, isVisible: false }))
      );
    };
  
    return (
      <div className="event-boxes">
        {selectedEventDetails ? (
          <div className="details-list">
            <h3>Event Details</h3>
            <p>
              <strong>Interview With:</strong> {selectedEventDetails.interviewWith}
            </p>
            <p>
              <strong>Position:</strong> {selectedEventDetails.position}
            </p>
            <p>
              <strong>Created By:</strong> {selectedEventDetails.createdBy}
            </p>
            <p>
              <strong>Interview Date:</strong> {selectedEventDetails.interviewDate}
            </p>
            <p>
              <strong>Interview Time:</strong> {selectedEventDetails.interviewTime}
            </p>
          </div>
        ) : (
          groupedEvents.map((group, groupIndex) => (
            <div key={groupIndex} className="group">
  
              <div className="event-box">
                <h4>{group.events[0].jobRequestTitle}</h4>
                <p>
                  <strong>Interviewer:</strong> {group.events[0].firstName}
                </p>
                <p>
                  <strong>Time:</strong> {group.events[0].time}
                </p>
                {/* onClick={() => toggleGroupVisibility(groupIndex)} */}
                <button >
                  {group.events.length}
                </button>
              </div>
  
              {group.isVisible &&
                group.events.slice(1).map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className="event-box"
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
          ))
        )}
      </div>
    );

}

export default Event

