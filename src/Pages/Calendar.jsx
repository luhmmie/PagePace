import React, { useState, useEffect } from 'react';

const Calendar = () => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("PagePace_reminders")) || [];
    const sorted = [...saved].sort((a, b) => new Date(a.date) - new Date(b.date));
    setReminders(sorted);
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
  <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Calendar</h1>

  {reminders.length === 0 ? (
    <p className="text-gray-500">Nothing scheduled yet. Add a reminder to see it here.</p>
  ) : (
    <div className="flex flex-col gap-2">
      {reminders.map((r) => (
        <div
          key={r.id}
          className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 bg-white p-3 rounded-md border"
        >
          <span className="text-sm font-medium text-blue-600 sm:w-24 sm:shrink-0">
            {formatDate(r.date)}
          </span>
          <span className={r.done ? "line-through text-gray-400 break-words" : "text-gray-800 break-words"}>
            {r.title}
          </span>
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default Calendar;