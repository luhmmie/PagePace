import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { getAllCourses, deleteCourse } from '../utils/db.js';
import { getCurrentUser } from '../utils/auth.js';
const AllCourses = () => {
  const [courses, setCourses] = useState([]);

   useEffect(() => {
    const loadCourses = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;
      const savedCourses = await getAllCourses(currentUser.id);
      setCourses(savedCourses);
    };
    loadCourses();
  }, []);
  

  const getProgress = (course) => {
    if (!course.totalPages) return 0;
    return Math.round((course.readPages.length / course.totalPages) * 100);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteCourse(id);
    setCourses(courses.filter((course) => course.id !== id));
  };

  return (
   <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">All Courses</h1>
    <NavLink
      to="/dashboard/add-course"
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-center w-full sm:w-fit"
    >
      + Add Course
    </NavLink>
  </div>

  {courses.length === 0 ? (
    <p className="text-gray-500">No courses yet. Add your first one to get started.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <NavLink
          key={course.id}
          to={`/dashboard/courses/${course.id}`}
          className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition relative"
        >
          <button
            onClick={(e) => handleDelete(e, course.id)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm z-10"
          >
            ✕
          </button>
          <h3 className="font-semibold text-gray-800 mb-2 pr-6 truncate">{course.title}</h3>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${getProgress(course)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">{getProgress(course)}% complete</p>
        </NavLink>
      ))}
    </div>
  )}
</div>
  );
};

export default AllCourses;