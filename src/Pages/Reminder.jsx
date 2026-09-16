import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/auth.js';

const Reminder = () => {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const currentUser = getCurrentUser();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("PagePace_reminders")) || [];
    setReminders(saved.filter((r) => r.userId === currentUser?.id || r.userId === undefined));
  }, []);

  const saveReminders = (updatedForUser) => {
   
    const all = JSON.parse(localStorage.getItem("PagePace_reminders")) || [];
    const otherUsers = all.filter((r) => r.userId !== currentUser?.id && r.userId !== undefined);
    const merged = [...otherUsers, ...updatedForUser];
    localStorage.setItem("PagePace_reminders", JSON.stringify(merged));
    setReminders(updatedForUser);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !date) return;
    const newReminder = {
      id: Date.now(),
      title,
      date, 
      done: false,
      userId: currentUser?.id,
    };
    saveReminders([...reminders, newReminder]);
    setTitle("");
    setDate("");
  };

  const toggleDone = (id) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, done: !r.done } : r
    );
    saveReminders(updated);
  };

  const handleDelete = (id) => {
    saveReminders(reminders.filter((r) => r.id !== id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
  <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Reminders</h1>

  <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-2 mb-6">
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Reminder title"
      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-base"
    />
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-2 text-base"
    />
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full md:w-auto"
    >
      Add
    </button>
  </form>

  {reminders.length === 0 ? (
    <p className="text-gray-500">No reminders yet.</p>
  ) : (
    <div className="flex flex-col gap-2">
      {reminders.map((r) => (
        <div
          key={r.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white p-3 rounded-md border"
        >
          <div className="flex items-center gap-3 min-w-0">
            <input
              type="checkbox"
              checked={r.done}
              onChange={() => toggleDone(r.id)}
              className="shrink-0"
            />
            <span className={`truncate ${r.done ? "line-through text-gray-400" : "text-gray-800"}`}>
              {r.title}
            </span>
            <span className="text-sm text-gray-400 shrink-0">{r.date}</span>
          </div>
          <button
            onClick={() => handleDelete(r.id)}
            className="text-red-500 hover:text-red-700 text-sm self-end sm:self-auto"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default Reminder;