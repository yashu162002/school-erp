import { useEffect, useState } from "react";
import { getResults } from "../api/studentApi";
import ResultTable from "../components/ResultTable";

function Results() {

  const [results, setResults] = useState([]);

  useEffect(() => {
    getResults(1)
      .then(res => setResults(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <ResultTable data={results} />
  );
}

export default Results;