import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

export default function ManageExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

const [showAssignModal, setShowAssignModal] = useState(false);
const [selectedExam, setSelectedExam] = useState(null);
const [students, setStudents] = useState([]);
const [selectedStudents, setSelectedStudents] = useState([]);
const [search, setSearch] = useState("");
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
const openAssignModal = async (exam) => {
  try {
    setSelectedExam(exam);

    const studentsRes = await API.get("/admin/students");
    const assignedRes = await API.get(
      `/exams/${exam.id}/assigned`
    );

    setStudents(studentsRes.data);
    setSelectedStudents(
      assignedRes.data.map((s) => s.id)
    );

    setShowAssignModal(true);

  } catch (err) {
    console.error(err);
    alert("Failed to load students");
  }
};
const saveAssignments = async () => {
  try {
    await API.post(
      `/exams/${selectedExam.id}/assign`,
      {
        students: selectedStudents,
      }
    );

    alert("Students assigned successfully");

    setShowAssignModal(false);

  } catch (err) {
    console.error(err);
    alert("Failed to assign students");
  }
};
const toggleStudent = (id) => {
  setSelectedStudents((prev) =>
    prev.includes(id)
      ? prev.filter((x) => x !== id)
      : [...prev, id]
  );
};
const filteredStudents = students.filter((student) => {
  const q = search.toLowerCase();

  return (
    student.name.toLowerCase().includes(q) ||
    student.email.toLowerCase().includes(q)
  );
});
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
    <th>Duration</th>
    <th>Retake</th>
    <th>Show Answers</th>
    <th>Show Explanations</th>
    <th>Action</th>
  </tr>
</thead>
          <tbody>
  {exams.map((exam) => (
    <tr key={exam.id}>
      <td>{exam.id}</td>

      <td>{exam.title}</td>

      <td>
        {exam.unlimited_time
          ? "Unlimited"
          : `${exam.duration} mins`}
      </td>

      <td>
        {exam.allow_retake ? " Yes" : " No"}
      </td>

      <td>
        {exam.show_answers ? " Yes" : " No"}
      </td>

      <td>
        {exam.show_explanations ? " Yes" : " No"}
      </td>

     <td>
  <button
    onClick={() => openAssignModal(exam)}
  >
    Assign Students
  </button>

  {" "}

  <button
    onClick={() => deleteExam(exam.id)}
  >
    Delete
  </button>
</td>
   </tr>
  ))}
</tbody>
        </table>
      )}
{
  showAssignModal && (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        <h2>
          Assign Students
        </h2>

        <h3>
          {selectedExam?.title}
        </h3>

<input
  type="text"
  placeholder="Search student..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  }}
/>
<p>
  Selected: {selectedStudents.length} student(s)
</p>
<div style={{marginBottom:"15px"}}>

  <button
    onClick={() =>
      setSelectedStudents(
        filteredStudents.map((student) => student.id)
      )
    }
  >
    Select All
  </button>

  {" "}

  <button
    onClick={() =>
      setSelectedStudents([])
    }
  >
    Clear All
  </button>

</div>   
     <div style={styles.studentList}>
         { filteredStudents.map((student) => (
            <label
              key={student.id}
              style={styles.studentItem}
            >
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.id)}
                onChange={() => toggleStudent(student.id)}
              />

              {" "}
              {student.name} ({student.email})

            </label>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <button onClick={saveAssignments}>
            Save
          </button>

          {" "}

          <button
            onClick={() => setShowAssignModal(false)}
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}
   </AdminLayout>

  );
}
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#fff",
    width: "500px",
    maxHeight: "80vh",
    overflowY: "auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },

  studentList: {
    marginTop: "20px",
  },

  studentItem: {
    display: "block",
    marginBottom: "10px",
    cursor: "pointer",
  },
};
