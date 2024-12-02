import React, { useState, createContext, useEffect } from 'react';
import '../index.css';
import CalendarHeader from './CalendarHeader';
import CalendarNav from './CalendarNav';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';

export const CalendarContext = createContext();

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('week');
  const [groupedEvents, setGroupedEvents] = useState([]);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch JSON data directly from the specified path
      const response = await fetch('/calendar/calendarfromtoenddate.json');
      const data = await response.json();
      
      const events = data.map((item) => {
        const jobRequestTitle = item.job_id.jobRequest_Title
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
  
        const firstName = item.user_det.handled_by?.firstName || 'Unknown';
  
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
            
            if (minutes === 0) {
              return `${formattedHours.toString().padStart(2, '0')} ${period}`;
            }
            return `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
          } catch (error) {
            console.error('Error parsing time:', error, 'Input:', timeString);
            return 'Invalid Time';
          }
        };
        
        const formatTimeRange = (startTimeString, endTimeString) => {
          const startTime = formatTime(startTimeString);
          const endTime = formatTime(endTimeString);
        
          return startTime && endTime ? `${startTime} - ${endTime}` : 'Time Not Available';
        };
        
        const timeRange = formatTimeRange(item.start, item.end);
        

        const date = item.start.split('T')[0];
  
        return {
          jobRequestTitle,
          date,
          firstName,
          time: timeRange,
          start: item.start,
          userRole: item.user_det.handled_by?.userRole || '',
          interviewWith
        };
      });
  
      // Group events
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
        (group) => group.time === event.time && group.date === event.date
      );

      if (existingGroup) {
        existingGroup.events.push(event);
      } else {
        groups.push({
          time: event.time,
          date: event.date,
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

  const toggleGroupVisibility = (groupIndex) => {
    setGroupedEvents((prevGroupedEvents) =>
      prevGroupedEvents.map((group, index) =>
        index === groupIndex ? { ...group, isVisible: !group.isVisible } : group
      )
    );
  };

  const handleBoxClick = (event) => {
    const interviewWith = event.interviewWith;
    const position = event.jobRequestTitle;
    const createdBy = event.userRole
      .split('_')
      .map((word, index) =>
        index === 0
          ? word.charAt(0).toUpperCase() + word.charAt(1).toUpperCase() + word.slice(2).toLowerCase() 
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() 
      )
      .join(' ');

    const interviewDate = event.date;
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

  return (
    
    <CalendarContext.Provider value={{ selectedDate, setSelectedDate, view, setView, groupedEvents, setGroupedEvents, toggleGroupVisibility, selectedEventDetails, setSelectedEventDetails, handleBoxClick }}>
      <div className="calendar-app">
        <CalendarHeader />
        <CalendarNav handlePrev={handlePrev} handleNext={handleNext} handleChangeView={handleChangeView} />
        <div className="calendar-view">
          {view === 'day' && <DayView />}
          {view === 'week' && <WeekView />}
          {view === 'month' && <MonthView />}
          {view === 'year' && <YearView />}
        </div>
      </div>
    </CalendarContext.Provider>
    
  );
};

export default App;
