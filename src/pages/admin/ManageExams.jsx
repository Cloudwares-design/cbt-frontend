import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

export default function ManageExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExams = async () => {
    try {
      const res = await API.get("/admin/exams");
      setExams(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const deleteExam = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this exam and all its questions?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/exams/${id}`);

      setExams((prev) =>
        prev.filter((exam) => exam.id !== id)
      );

      alert("Exam deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete exam");
    }
  };

 return (
   <AdminLayout>
      <h1>Manage Exams</h1>

      {loading ? (
        <p>Loading exams...</p>
      ) : exams.length === 0 ? (
        <p>No exams found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Duration (mins)</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.id}</td>
                <td>{exam.title}</td>
                <td>{exam.duration}</td>
                <td>
                  <button
                    onClick={() =>
                      deleteExam(exam.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
   </AdminLayout>
  );
}