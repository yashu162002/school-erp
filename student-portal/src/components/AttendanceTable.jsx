function AttendanceTable({ data }) {

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Status</th>
          <th>Remarks</th>
        </tr>
      </thead>

      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            <td>{item.attendanceDate}</td>
            <td>{item.status}</td>
            <td>{item.remarks}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AttendanceTable;