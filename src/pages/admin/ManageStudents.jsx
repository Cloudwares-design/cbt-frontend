import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // FETCH STUDENTS
  const fetchStudents = async () => {
    try {
      const res = await API.get("/admin/students");
      setStudents(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // CREATE STUDENT
  const createStudent = async (e) => {
    e.preventDefault();

    try {
      await API.post("/admin/students", form);

      setForm({ name: "", email: "", password: "" });

      fetchStudents(); // refresh list
      alert("Student created successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Error creating student");
    }
  };

  // DELETE STUDENT
  const deleteStudent = async (id) => {
    try {
      await API.delete(`/admin/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert("Error deleting student");
    }
  };

  return (
  <AdminLayout>
      <h1>Manage Students</h1>

      {/* CREATE FORM */}
      <form className="admin-form" onSubmit={createStudent} style={{ marginBottom: "20px" }}>
        <input className="admin-input"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input className="admin-input"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input className="admin-input"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button type="submit" type="submit"
  className="admin-btn admin-btn-success">Create Student</button>
      </form>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.role}</td>
                <td>
                  <button className="admin-btn admin-btn-danger"
                    onClick={() => deleteStudent(s.id)}
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