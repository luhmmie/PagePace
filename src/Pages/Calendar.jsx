import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { getCurrentUser } from '../utils/auth.js';
import 'react-day-picker/style.css';
import "./calendar.css"

const toLocalDateStr = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseLocalDateStr = (str) => {
  const [year, month, day] = str.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const Calendar = () => {
  const [reminders, setReminders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const currentUser = getCurrentUser();
    const saved = JSON.parse(localStorage.getItem("PagePace_reminders")) || [];
    const userReminders = saved.filter((r) => r.userId === currentUser?.id || r.userId === undefined);
    setReminders(userReminders);
  }, []);

  const reminderDates = reminders.map((r) => parseLocalDateStr(r.date));

  const selectedDateStr = toLocalDateStr(selectedDate);
  const remindersForSelectedDate = reminders.filter((r) => r.date === selectedDateStr);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Calendar</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-2 sm:p-4 w-full max-w-full overflow-x-auto md:w-fit mx-auto md:mx-0">
          <div className="w-fit mx-auto">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ hasReminder: reminderDates }}
              modifiersClassNames={{ hasReminder: "has-reminder" }}
            />
          </div>
        </div>

        <div className="flex-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 min-w-0">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase break-words">
            {selectedDate.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>

          {remindersForSelectedDate.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No reminders for this day.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {remindersForSelectedDate.map((r) => (
                <div
                  key={r.id}
                  className={`p-2 rounded-md break-words ${r.done ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-100'} bg-gray-50 dark:bg-gray-700`}
                >
                  {r.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Calendar;