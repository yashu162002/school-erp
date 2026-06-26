
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import Announcements from "./pages/Announcements";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/results" element={<Results />} />
        <Route path="/announcements" element={<Announcements />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
