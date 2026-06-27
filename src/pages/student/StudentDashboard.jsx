import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import StudentLayout from "../../components/student/StudentLayout";


export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
     fetchUser();
    fetchExams();
  }, []);
const fetchUser = async () => {
  try {
    const res = await API.get("/auth/me");
    setUser(res.data);
  } catch (err) {
    console.log(err);
  }
};
  const fetchExams = async () => {
    try {
      const res = await API.get("/exams");
      setExams(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const startExam = (examId) => {
    navigate(`/student/exam/${examId}/instructions`);
  };

  return (
     <StudentLayout>
    <div className="student-container">
      <h2 style={{ marginBottom: "5px" }}>
      Welcome, {user?.name} 👋
    </h2>

    <p style={{ marginBottom: "20px", color: "gray" }}>
      Choose an exam to begin
    </p>
      <h1 style={{ marginBottom: "20px" }}>
        Available Exams
      </h1>

      {loading ? (
        <p>Loading exams...</p>
      ) : (
        <div className="exam-grid">
          {exams.map((exam) => (
            <div key={exam.id} className="exam-card">
              <h2>{exam.title}</h2>

              <p>
                ⏱ Duration: {exam.duration} minutes
              </p>

              <button
                className="student-btn"
                onClick={() => startExam(exam.id)}
              >
                Start Exam
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </StudentLayout>
  );
}