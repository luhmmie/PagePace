import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { deleteAllCourses } from '../utils/db.js';
import { getCurrentUser, getUsers, saveUsers } from '../utils/auth.js';
import { deleteUserCourses } from '../utils/db.js';
import { useDarkMode } from '../hooks/useDarkMode.js';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "" });
  const { darkMode, toggleDarkMode } = useDarkMode();




  useEffect(() => {
    const savedUser = getCurrentUser();
if (savedUser) setUser({ username: savedUser.username, email: savedUser.email });
    

    
  }, []);

  const handleAccountSave = (e) => {
  e.preventDefault();
  const currentUser = getCurrentUser();
  const users = getUsers();
  const updatedUsers = users.map((u) =>
    u.id === currentUser.id ? { ...u, username: user.username, email: user.email } : u
  );
  saveUsers(updatedUsers);
  alert("Account updated.");
};

const handleDeleteAccount = async () => {
  const confirmed = window.confirm("This will permanently delete your account and all courses. Continue?");
  if (!confirmed) return;

  const currentUser = getCurrentUser();
  const users = getUsers().filter((u) => u.id !== currentUser.id);
  saveUsers(users);

  const allReminders = JSON.parse(localStorage.getItem("PagePace_reminders")) || [];
  localStorage.setItem(
    "PagePace_reminders",
    JSON.stringify(allReminders.filter((r) => r.userId !== currentUser.id))
  );

  await deleteUserCourses(currentUser.id);
  localStorage.removeItem("PagePace_session");
  navigate("/signup");
};



  const handleLogout = () => {
    localStorage.removeItem("PagePace_session");
    navigate("/");
  };

  
  return (
   <div className="w-full max-w-xl mx-auto px-4 sm:px-0">
  <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Settings</h1>

  <div className="bg-white p-4 sm:p-6 rounded-lg border mb-6">
    <h2 className="text-lg font-semibold mb-4">Account</h2>
    <form onSubmit={handleAccountSave} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-base"
        />
      </div>

<div className="flex items-center justify-between">
  <span className="text-gray-700">Dark Mode</span>
  <button
    type="button"
    onClick={toggleDarkMode}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      darkMode ? 'bg-blue-600' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        darkMode ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
</div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-base"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full sm:w-fit"
      >
        Save Changes
      </button>
    </form>
  </div>

  <div className="bg-white p-4 sm:p-6 rounded-lg border mb-6">
    <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900 font-medium">
      Log Out
    </button>
  </div>

  <div className="bg-red-50 p-4 sm:p-6 rounded-lg border border-red-200">
    <h2 className="text-lg font-semibold text-red-700 mb-2">Danger Zone</h2>
    <p className="text-sm text-red-600 mb-4">This permanently deletes your account and all courses.</p>
    <button
      onClick={handleDeleteAccount}
      className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
    >
      Delete Account
    </button>
  </div>
</div>
  );
};

export default Settings;