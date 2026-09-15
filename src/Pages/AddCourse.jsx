import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { addCourse } from '../utils/db.js';
import { getCurrentUser } from '../utils/auth.js';

const AddCourse = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      alert("Please add a title and select a PDF.");
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("You must be logged in to add a course.");
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      const newCourse = {
        id: Date.now(),
        userId: currentUser.id,
        title,
        fileData: base64Data,
        currentPage: 1,
        totalPages: null,
        readPages: [],
      };
      await addCourse(newCourse);
      navigate("/dashboard");
    };
    reader.readAsDataURL(file);
  };

  return (
   <div className="w-full max-w-md mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
  <h2 className="text-lg sm:text-xl font-bold mb-4">Add a Course</h2>
  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <div>
      <label className="block text-sm font-medium mb-1">Course Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Data Structures"
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-base"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Upload PDF</label>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
      />
    </div>
    <button type="submit" className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
      Save Course
    </button>
  </form>
</div>
  );
};

export default AddCourse;