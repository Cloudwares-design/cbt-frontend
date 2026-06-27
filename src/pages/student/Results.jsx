import { useEffect, useState } from "react";
import API from "../../services/api";
import StudentLayout from "../../components/student/StudentLayout";
import { useNavigate } from "react-router-dom";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await API.get("/exams/results");
      setResults(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div style={{ padding: "20px" }}>
        <h1>📊 My Results</h1>

        {loading ? (
          <p>Loading...</p>
        ) : results.length === 0 ? (
          <p>No exams taken yet.</p>
        ) : (
          <div>
            {results.map((item) => {
              const percent = Math.round(
                (item.score / item.total) * 100
              );

              return (
                <div
                  key={item.id}
                  style={{
                    background: "white",
                    padding: "15px",
                    marginTop: "15px",
                    borderRadius: "10px",
                    boxShadow:
                      "0 2px 10px rgba(0,0,0,0.08)",
                  }}
                >
                  <h3>{item.title}</h3>

                  <p>
                    Score: {item.score}/{item.total}
                  </p>

                  <p>
                    Percentage: {percent}%
                  </p>

                  <p>
                    Submitted:
                    {" "}
                    {new Date(
                      item.submitted_at
                    ).toLocaleString()}
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        `/student/result/${item.exam_id}`
                      )
                    }
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}