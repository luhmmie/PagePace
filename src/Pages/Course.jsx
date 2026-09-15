import React, { useState, useEffect, useRef } from 'react';
import { useParams, NavLink } from 'react-router';
import { Document, Page, pdfjs } from 'react-pdf';
import { getCourse, updateCourse } from '../utils/db.js';

import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { LuMinus } from "react-icons/lu";
import { AiOutlinePlus } from "react-icons/ai";
import ChatWidget from "../components/ChatWidget";


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Course = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);
  const [noteText, setNoteText] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      const data = await getCourse(Number(id));
      setCourse(data || null);
      if (data) {
        setPageNumber(data.currentPage || 1);
        setNoteText((data.notes && data.notes[data.currentPage || 1]) || "");
      }
      setLoading(false);
    };
    loadCourse();
  }, [id]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    if (!course.totalPages) {
      const updated = { ...course, totalPages: numPages };
      setCourse(updated);
      updateCourse(updated);
    }
  };

  const handleAskAI = async () => {
    const prompt = aiInput.trim();
    if (!prompt || aiLoading) return;

    setAiLoading(true);
    setAiResponse("");

    try {
      const result = await askGemini(prompt);
      setAiResponse(result);
    } catch (error) {
      setAiResponse(`Something went wrong: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const markPageAsRead = async () => {
    if (!course.readPages.includes(pageNumber)) {
      const updated = {
        ...course,
        readPages: [...course.readPages, pageNumber],
        currentPage: pageNumber,
      };
      setCourse(updated);
      await updateCourse(updated);
    }
  };

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
      setNoteText((course.notes && course.notes[newPage]) || "");
    }
  };

  const saveNote = async () => {
    const updatedNotes = { ...(course.notes || {}), [pageNumber]: noteText };
    const updated = { ...course, notes: updatedNotes };
    setCourse(updated);
    await updateCourse(updated);
  };

  if (loading) return <p>Loading...</p>;

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-gray-500 mb-4">No course found.</p>
        <NavLink to="/dashboard/add-course" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          + Add Course
        </NavLink>
      </div>
    );
  }

  const overallProgress = course.totalPages
    ? Math.round((course.readPages.length / course.totalPages) * 100)
    : 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{course.title}</h1>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-gray-500 mb-1">Overall Progress</p>
          <div className="flex items-center gap-2">
            <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${overallProgress}%` }}></div>
            </div>
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {course.readPages.length}/{course.totalPages || '?'} pages
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* PDF Viewer */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm border w-fit mb-4 mx-auto lg:mx-0">
            <button onClick={() => goToPage(pageNumber - 1)} className="text-gray-500 hover:text-gray-800"><GrFormPrevious /></button>
            <span className="text-sm">{pageNumber} / {numPages || '?'}</span>
            <button onClick={() => goToPage(pageNumber + 1)} className="text-gray-500 hover:text-gray-800"><MdNavigateNext /></button>
            <span className="text-gray-300">|</span>
            <button onClick={() => setScale((s) => Math.max(0.5, s - 0.1))} className="text-gray-500 hover:text-gray-800"><LuMinus/></button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale((s) => Math.min(2, s + 0.1))} className="text-gray-500 hover:text-gray-800"><AiOutlinePlus/></button>
          </div>

          <div ref={containerRef} className="bg-gray-100 rounded-lg p-2 sm:p-4 flex justify-center overflow-x-auto">
            <Document file={course.fileData} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={pageNumber}
                width={containerWidth ? Math.min(containerWidth - 32, 800) * scale : undefined}
              />
            </Document>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-full lg:w-72 lg:flex-shrink-0">
          <button
            onClick={markPageAsRead}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg mb-4 font-medium ${
              course.readPages.includes(pageNumber)
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {course.readPages.includes(pageNumber) ? 'Marked as Done' : 'Mark Page as Done'}
          </button>

          <div className="bg-white rounded-lg border p-4 mb-4">
            <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase">Progress</h3>
            <div className="flex flex-col gap-2 max-h-48 sm:max-h-64 overflow-y-auto">
              {numPages && Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`text-left text-sm px-2 py-1 rounded ${
                    p === pageNumber
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : course.readPages.includes(p)
                      ? 'text-gray-400 line-through'
                      : 'text-gray-600'
                  }`}
                >
                  Page {p}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4 mb-4 bg-blue-300">
            <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Note Pace</h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onBlur={saveNote}
              placeholder="No notes added yet. Click to add a note."
              className="w-full text-base sm:text-sm border rounded-md p-2 min-h-[80px] focus:outline-none focus:border-blue-500"
            />
          </div>

         <div>
          <ChatWidget/>
         </div>
        </div>
      </div>
    </div>
  );
};

export default Course;