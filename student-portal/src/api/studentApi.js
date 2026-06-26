import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api"
});

// Attendance API
export const getAttendance = (studentId) => {
  return API.get("/admin/students/" + studentId + "/attendance");
};

// Results API
export const getResults = (studentId) => {
  return API.get("/results/student/" + studentId);
};

// Student Profile API
export const getStudentProfile = (studentId) => {
  return API.get("/admin/students/" + studentId + "/profile");
};

// Announcements API
export const getAnnouncements = () => {
  return API.get("/announcements");
};

// Notifications API
export const getNotifications = () => {
  return API.get("/notifications");
};

// Fees API
export const getFees = (studentId) => {
  return API.get("/admin/students/" + studentId + "/fees");
};

// Timetable API
export const getTimetable = (studentId) => {
  return API.get("/admin/students/" + studentId + "/timetable");
};

export default API;
