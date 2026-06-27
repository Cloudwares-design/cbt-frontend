import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    exams: 0,
    submissions: 0,
    average_score: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    
    <AdminLayout>
      <h1>Admin Dashboard</h1>

      {/* STATS CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
  "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Total Students</h3>
          <h2>{stats.students}</h2>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Total Exams</h3>
          <h2>{stats.exams}</h2>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Submissions</h3>
          <h2>{stats.submissions}</h2>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Average Score</h3>
          <h2>{stats.average_score}</h2>
        </div>
      </div>

      {/* NAVIGATION */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <Link to="/admin/create-exam">
          <button>Create Exam</button>
        </Link>

        <Link to="/admin/add-question">
          <button>Add Question</button>
        </Link>

        <Link to="/admin/manage-students">
          <button>Manage Students</button>
        </Link>

        <Link to="/admin/manage-exams">
          <button>Manage Exams</button>
        </Link>

        <Link to="/admin/results">
          <button>View Results</button>
        </Link>
      </div>
    </AdminLayout>
  );
}