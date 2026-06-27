import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import StudentLayout from "../../components/student/StudentLayout";

export default function ExamInstructions() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      const res = await API.get(`/exams/${examId}`);
      setExam(res.data);
    };

    fetchExam();
  }, [examId]);

  return (
    <StudentLayout>
      <div style={styles.container}>

        <h2>📘 Exam Instructions</h2>

        {exam && (
          <div style={styles.card}>
            <h3>{exam.title}</h3>
            <p><b>Duration:</b> {exam.duration} minutes</p>
          </div>
        )}

        <div style={styles.rules}>
          <h3>Rules & Instructions</h3>

          <ul>
            <li>Do not switch tabs during the exam, after 3 times, you will be submitted automatically</li>
            <li>No copying or external help allowed</li>
            <li>Exam will auto-submit when time ends</li>
            <li>Ensure stable internet connection</li>
            <li>Once started, you cannot restart the exam</li>
          </ul>
        </div>

        <button
          style={styles.button}
          onClick={() =>
            navigate(`/student/exam/${examId}/start`)
          }
        >
          Start Exam
        </button>

      </div>
    </StudentLayout>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "auto",
    padding: "20px",
  },

  card: {
    background: "#f8fafc",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
  },

  rules: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    marginBottom: "20px",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
};