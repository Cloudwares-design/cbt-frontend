import { useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

export default function CreateExam() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");

  const createExam = async () => {
    try {
      await API.post("/exams/create", {
        title,
        duration,
      });

      alert("Exam created successfully");
      setTitle("");
      setDuration("");
    } catch (err) {
      alert("Error creating exam");
    }
  };

  return (
    <AdminLayout>
      <h2>Create Exam</h2>

      <input
        placeholder="Exam Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <br /><br />

      <button onClick={createExam}>Create</button>
    </AdminLayout>
  );
}