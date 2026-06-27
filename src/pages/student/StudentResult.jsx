import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import StudentLayout from "../../components/student/StudentLayout";

export default function StudentResult() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResult = async () => {
    try {
      const res = await API.get(`/exams/result/${examId}`);
      setResult(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [examId]);

  if (loading) return <h2 style={styles.loading}>Loading result...</h2>;

  if (!result) return <h2>No result found</h2>;

  const percent = Math.round((result.score / result.total) * 100);
  const passed = percent >= 50;

  return (
    <StudentLayout>
    <div style={styles.page}>

      <div style={styles.card}>

        <h2>📊 Exam Result</h2>

        <div style={styles.scoreBox}>
          <h1>{result.score} / {result.total}</h1>
          <p>{percent}%</p>
        </div>

        <div
          style={{
            ...styles.status,
            background: passed ? "#16a34a" : "#dc2626",
          }}
        >
          {passed ? "PASSED 🎉" : "FAILED ❌"}
        </div>

        <p style={styles.date}>
          Submitted: {new Date(result.submitted_at).toLocaleString()}
        </p>

        <button
          onClick={() => navigate("/student/dashboard")}
          style={styles.btn}
        >
          Back to Dashboard
        </button>

      </div>

    </div>
    </StudentLayout>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8fafc",
    fontFamily: "Arial",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 2px 15px rgba(0,0,0,0.1)",
  },

  scoreBox: {
    margin: "20px 0",
  },

  status: {
    padding: "10px",
    color: "white",
    fontWeight: "bold",
    borderRadius: "6px",
    marginBottom: "15px",
  },

  date: {
    fontSize: "14px",
    color: "gray",
    marginBottom: "20px",
  },

  btn: {
    padding: "10px 15px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  loading: {
    textAlign: "center",
    marginTop: "50px",
  },
};