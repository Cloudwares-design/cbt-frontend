import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";
import { MathJax } from "better-react-mathjax";

export default function AddQuestion() {
  const [exams, setExams] = useState([]);
  const [examId, setExamId] = useState("");

  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 5;

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    question: "",
    a: "",
    b: "",
    c: "",
    d: "",
    correct: "",
  });

  // =====================
  // LOAD EXAMS
  // =====================
  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    const res = await API.get("/exams");
    setExams(res.data);
  };

  // =====================
  // LOAD QUESTIONS
  // =====================
  const loadQuestions = async (id) => {
    if (!id) return;

    const res = await API.get(`/exams/${id}/all-questions`);
    setQuestions(res.data);
  };

  useEffect(() => {
    loadQuestions(examId);
  }, [examId]);

  // =====================
  // ADD / UPDATE
  // =====================
  const saveQuestion = async () => {
    try {
      if (editId) {
        await API.put(`/exams/question/${editId}`, {
          ...form,
          exam_id: examId,
        });
      } else {
        await API.post("/exams/question", {
          exam_id: examId,
          question: form.question,
          option_a: form.a,
          option_b: form.b,
          option_c: form.c,
          option_d: form.d,
          correct_option: form.correct,
        });
      }

      resetForm();
      loadQuestions(examId);
    } catch (err) {
      alert("Error saving question");
    }
  };

  // =====================
  // DELETE
  // =====================
  const deleteQuestion = async (id) => {
    await API.delete(`/exams/question/${id}`);
    loadQuestions(examId);
  };

  // =====================
  // EDIT
  // =====================
  const startEdit = (q) => {
    setEditId(q.id);
    setForm({
      question: q.question,
      a: q.option_a,
      b: q.option_b,
      c: q.option_c,
      d: q.option_d,
      correct: q.correct_option,
    });
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      question: "",
      a: "",
      b: "",
      c: "",
      d: "",
      correct: "",
    });
  };

  // =====================
  // FILTER + PAGINATION
  // =====================
  const filtered = questions.filter((q) =>
    q.question.toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return (
    <AdminLayout>
      <div className="question-container">

        <h2>Question Manager</h2>

        {/* EXAM SELECT */}
        <select onChange={(e) => setExamId(e.target.value)}>
          <option>Select Exam</option>
          {exams.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.title}
            </option>
          ))}
        </select>

        {/* SEARCH */}
        <input
          placeholder="Search question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FORM */}
        <div className="question-form">

          <textarea
            placeholder="Question (LaTeX supported)"
            value={form.question}
            onChange={(e) =>
              setForm({ ...form, question: e.target.value })
            }
          />

          <input placeholder="Option A"
            value={form.a}
            onChange={(e) => setForm({ ...form, a: e.target.value })}
          />

          <input placeholder="Option B"
            value={form.b}
            onChange={(e) => setForm({ ...form, b: e.target.value })}
          />

          <input placeholder="Option C"
            value={form.c}
            onChange={(e) => setForm({ ...form, c: e.target.value })}
          />

          <input placeholder="Option D"
            value={form.d}
            onChange={(e) => setForm({ ...form, d: e.target.value })}
          />

          <input placeholder="Correct (A/B/C/D)"
            value={form.correct}
            onChange={(e) => setForm({ ...form, correct: e.target.value })}
          />

          <button onClick={saveQuestion}>
            {editId ? "Update Question" : "Add Question"}
          </button>

          {editId && (
            <button onClick={resetForm} style={{ background: "gray" }}>
              Cancel Edit
            </button>
          )}
        </div>
<h3>
  Total Questions: {questions.length}
</h3>
        {/* QUESTION LIST */}
        <div className="question-list">

          {paginated.map((q) => (
            <div key={q.id} className="question-card">

              {/* QUESTION */}
              <MathJax>
                <h4>{q.question}</h4>
              </MathJax>

              {/* OPTIONS */}
              <div>
                <MathJax>A. {q.option_a}</MathJax>
                <MathJax>B. {q.option_b}</MathJax>
                <MathJax>C. {q.option_c}</MathJax>
                <MathJax>D. {q.option_d}</MathJax>
              </div>

              <p><b>Correct:</b> {q.correct_option}</p>

              <div className="actions">
                <button onClick={() => startEdit(q)}>Edit</button>
                <button onClick={() => deleteQuestion(q.id)}>Delete</button>
              </div>

            </div>
          ))}

        </div>

        {/* PAGINATION */}
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>

          <span>Page {page}</span>

          <button
            disabled={start + limit >= filtered.length}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>

      </div>
    </AdminLayout>
  );
}
