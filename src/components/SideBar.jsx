import React from 'react'
import { NavLink } from 'react-router';
import { MdOutlineDashboard } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import { MdNotificationsActive } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import LogoImage from "../assets/logo.png"
import "./sidebar.css"

const SideBar = ({ collapsed, setCollapsed }) => {
  const linkClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  return (
    <div className={`sidebar-links ${collapsed ? "collapsed" : ""}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <TbLayoutSidebarLeftExpand /> : <TbLayoutSidebarLeftCollapse />}
      </button>

      <div className="sidebar-list">
        <NavLink to="/dashboard" end className={linkClass}>
          <MdOutlineDashboard className="sidebar-icon" />
          <span className="sidebar-link-text">Dashboard</span>
        </NavLink>
      </div>

      <div className="sidebar-list">
        <NavLink to="/dashboard/courses" className={linkClass}>
          <FaGraduationCap className="sidebar-icon" />
          <span className="sidebar-link-text">Courses</span>
        </NavLink>
      </div>

      <div className="sidebar-list">
        <NavLink to="/dashboard/calendar" className={linkClass}>
          <CiCalendar className="sidebar-icon" />
          <span className="sidebar-link-text">Calendar</span>
        </NavLink>
      </div>

      <div className="sidebar-list">
        <NavLink to="/dashboard/reminders" className={linkClass}>
          <MdNotificationsActive className="sidebar-icon" />
          <span className="sidebar-link-text">Reminders</span>
        </NavLink>
      </div>

      <div className="sidebar-list">
        <NavLink to="/dashboard/settings" className={linkClass}>
          <IoSettingsOutline className="sidebar-icon" />
          <span className="sidebar-link-text">Settings</span>
        </NavLink>
      </div>
    </div>
  )
}

export default SideBar