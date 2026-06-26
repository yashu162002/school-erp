function ResultTable({ data }) {

  return (
    <table>
      <thead>
        <tr>
          <th>Subject</th>
          <th>Marks</th>
          <th>Max Marks</th>
          <th>Grade</th>
        </tr>
      </thead>

      <tbody>
        {data.map(result => (
          <tr key={result.id}>
            <td>{result.subject?.subjectName}</td>
            <td>{result.marksObtained}</td>
            <td>{result.maxMarks}</td>
            <td>{result.grade}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ResultTable;