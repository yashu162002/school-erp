import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/">Dashboard</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/attendance">Attendance</Link>
      <Link to="/results">Results</Link>
      <Link to="/fees">Fees</Link>
      <Link to="/announcements">Announcements</Link>
      <Link to="/timetable">Timetable</Link>
    </div>
  );
}

export default Sidebar;