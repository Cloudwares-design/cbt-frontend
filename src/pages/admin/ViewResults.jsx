import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";

export default function ViewResults() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    const res = await API.get("/exams");
    setExams(res.data);
  };

  return (
    <AdminLayout>
      <h2>Exam Results</h2>

      <div className="exam-grid">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="exam-card"
          >
            <h3>{exam.title}</h3>

            <p>
              Duration: {exam.duration} mins
            </p>

            <button
              onClick={() =>
                navigate(
                  `/admin/results/${exam.id}`
                )
              }
            >
              View Results
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}