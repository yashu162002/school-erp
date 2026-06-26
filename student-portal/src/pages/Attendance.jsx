import { useEffect, useState } from "react";
import { getAttendance } from "../api/studentApi";
import AttendanceTable from "../components/AttendanceTable";

function Attendance() {

  const [records, setRecords] = useState([]);

  useEffect(() => {
    getAttendance(1)
      .then(res => setRecords(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <AttendanceTable data={records} />
  );
}

export default Attendance;