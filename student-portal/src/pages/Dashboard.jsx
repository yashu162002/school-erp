import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProfileCard from "../components/ProfileCard";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="main-layout">
        <Sidebar />

        <div className="content">
          <h1>Student Dashboard</h1>

          <ProfileCard />

          <div className="stats-grid">
            <div className="card">
              <h3>Attendance</h3>
              <p>95%</p>
            </div>

            <div className="card">
              <h3>Results</h3>
              <p>8 Subjects</p>
            </div>

            <div className="card">
              <h3>Fees</h3>
              <p>Paid</p>
            </div>

            <div className="card">
              <h3>Announcements</h3>
              <p>5 New</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;