import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import Timer from "../../components/Timer";
import StudentLayout from "../../components/student/StudentLayout";
import { MathJax } from "better-react-mathjax";
import Modal from "../../components/student/Modal";

export default function Exam() {
  
  const { examId } = useParams();
  const navigate = useNavigate();

  const [modal, setModal] = useState({
  show: false,
  title: "",
  message: "",
});
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [exam, setExam] = useState(null);
  const [warningMessage, setWarningMessage] = useState("");

const [remaining, setRemaining] = useState(null);
const warningCount = useRef(0);
const containsMath = (text = "") => {
  return /\\\(|\\\[|\$|\\frac|\\sqrt|\\sum|\\int|\\alpha|\\beta|\\theta|\\pi|\\sin|\\cos|\\tan/.test(text);
};
const saveTimeout = useRef(null);
const MAX_WARNINGS = 3;


const showModal = (title, message) => {
  setModal({
    show: true,
    title,
    message,
  });
};
  // =========================
  // CHEAT HANDLER
  // =========================
  const handleCheat = (reason) => {
  if (submitted) return;

  warningCount.current += 1;

  setWarningMessage(
    `Warning ${warningCount.current}/${MAX_WARNINGS}: ${reason}`
  );

  setTimeout(() => setWarningMessage(""), 5000);

  // ONLY submit after 3 warnings
  if (warningCount.current >= MAX_WARNINGS) {
    setWarningMessage("Exam terminated due to suspicious activity");

    setTimeout(() => {
      submitExam();
    }, 1500);
  }
};

  // =========================
  // TAB SWITCH DETECTION
  // =========================
  const handleVisibilityChange = () => {
    if (document.hidden) {
      handleCheat("Tab switch detected");
    }
  };

  // =========================
  // BLOCK RIGHT CLICK
  // =========================
  const disableRightClick = (e) => {
    e.preventDefault();
  };

  // =========================
  // BLOCK KEYS
  // =========================
  const blockKeys = (e) => {
    if (
      e.ctrlKey &&
      ["c", "v", "t", "w", "r"].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
      handleCheat("Keyboard shortcut blocked");
    }

    if (e.key === "F12") {
      e.preventDefault();
      handleCheat("DevTools attempt");
    }
  };

  // =========================
  // FETCH QUESTIONS
  // =========================
  const fetchQuestions = async () => {
  try {
    const res = await API.get(`/exams/${examId}/questions`);
    const allQuestions = res.data.questions || [];

    let savedOrder = localStorage.getItem(
      `exam_${examId}_question_order`
    );

    let finalQuestions = [];

    if (savedOrder) {
      const ids = JSON.parse(savedOrder);

      finalQuestions = ids
        .map((id) => allQuestions.find((q) => q.id === id))
        .filter(Boolean);
    } else {
      finalQuestions = [...allQuestions];

      for (let i = finalQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [finalQuestions[i], finalQuestions[j]] = [
          finalQuestions[j],
          finalQuestions[i],
        ];
      }

      localStorage.setItem(
        `exam_${examId}_question_order`,
        JSON.stringify(finalQuestions.map((q) => q.id))
      );
    }

    setQuestions(finalQuestions);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

const checkIfAlreadyTaken = async (examData) => {
  try {
    await API.get(`/exams/result/${examId}`);

    // Student may retake this exam
    if (examData.allow_retake) {
      return false;
    }

    showModal(
      "Exam Completed",
      "You have already taken this exam."
    );

    setTimeout(() => {
      navigate("/student/dashboard");
    }, 2000);

    return true;

  } catch (err) {
    if (err.response?.status === 404) {
      return false;
    }

    showModal(
      "Error",
      "Unable to verify exam status"
    );

    return true;
  }
};

const saveToServer = async (data) => {
  try {
    await API.post("/exams/progress", {
      examId,
      answers: data,
    });
  } catch (err) {
    console.log("Auto-save failed:", err);
  }
};

const loadProgress = async () => {
  try {
    const res = await API.get(`/exams/progress/${examId}`);

    if (res.data?.answers) {
      setAnswers(res.data.answers);
    }
  } catch (err) {
    console.log("No saved progress");
  }
};

const fetchExam = async () => {
  const res = await API.get(`/exams/${examId}`);

  setExam(res.data);

  return res.data;
};
const loadRemainingTime = async () => {
  try {
    const res = await API.get(`/exams/${examId}/remaining-time`);

    // Unlimited exam
    if (res.data.unlimited) {
      setRemaining(null);
      return;
    }

    if (typeof res.data.remaining === "number") {
      setRemaining(res.data.remaining);
    } else {
      setRemaining(0);
    }

  } catch (err) {
    console.log("Failed to load timer:", err);
    setRemaining(0);
  }
};
useEffect(() => {
  if (!examId) return;

  const init = async () => {
  const examData = await fetchExam();

  const taken = await checkIfAlreadyTaken(examData);

  if (taken) return;

  await fetchQuestions();
  await loadProgress();
  await loadRemainingTime();
};
  init();

  document.addEventListener("visibilitychange", handleVisibilityChange);
  document.addEventListener("contextmenu", disableRightClick);
  document.addEventListener("keydown", blockKeys);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    document.removeEventListener("contextmenu", disableRightClick);
    document.removeEventListener("keydown", blockKeys);
  };
}, [examId]);

useEffect(() => {
  if (!examId) return;

  const interval = setInterval(() => {
    if (!submitted && Object.keys(answers).length > 0) {
      saveToServer(answers);
    }
  }, 10000);

  return () => clearInterval(interval);
}, [examId, answers, submitted]);
  // =========================
  // ANSWERS
  // =========================
   // =========================
  // AUTO SAVE ANSWERS (IMPORTANT)
  // =========================
  const saveAnswers = (newAnswers) => {
    clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(() => {
      localStorage.setItem(
        `exam_${examId}_answers`,
        JSON.stringify(newAnswers)
      );
    }, 800);
  };
  const selectAnswer = (questionId, option) => {
  if (submitted) return;

  const updated = {
    ...answers,
    [questionId]: option,
  };

  setAnswers(updated);

  // local backup
  saveAnswers(updated);

  // backend auto-save
  saveToServer(updated);
};

  // =========================
  // NAVIGATION
  // =========================
  const nextQuestion = () => {
    if (submitted) return;
    setCurrent((prev) =>
      prev < questions.length - 1 ? prev + 1 : prev
    );
  };

  const prevQuestion = () => {
    if (submitted) return;
    setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // =========================
  // SUBMIT EXAM
  // =========================
  const submitExam = async () => {
    if (submitted) return;

    try {
      setSubmitted(true);

      await API.post("/exams/submit", {
        examId,
        answers,
      });

      

      showModal("Success", "Exam submitted successfully");

setTimeout(() => {
  navigate("/student/dashboard");
}, 1500);
    }catch (err) {
  console.error("Submit error:", err);
  setSubmitted(false);
}
  };

  // =========================
  // UI STATES
  // =========================
  if (loading && !modal.show) {
  return <h2>Loading Exam...</h2>;
}
  if (!questions.length && !modal.show) {
  return <h2>No questions found</h2>;
}

if (modal.show) {
  return (
    <Modal
      title={modal.title}
      message={modal.message}
      onClose={() => navigate("/student/dashboard")}
    />
  );
}
  const question = questions[current];

  return (
    <StudentLayout>
        
  <div
    style={{
      padding: "20px",
      maxWidth: "900px",
      margin: "auto",
    }}
  >

    {/* WARNING BANNER */}
    {warningMessage && (
      <div
        style={{
          background: "#FEF3C7",
          color: "#92400E",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "15px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        ⚠️ {warningMessage}
      </div>
    )}

    {/* TIMER */}
   {!exam?.unlimited_time &&
  typeof remaining === "number" &&
  remaining > 0 && (
    <Timer
      seconds={remaining}
      onExpire={submitExam}
    />
)}
    

      <h2>CBT Exam (Secure Mode)</h2>

      <h3>
        Question {current + 1} of {questions.length}
      </h3>

      <p
  style={{
    color: "#6b7280",
    marginBottom: "20px",
  }}
>
  Answered: {Object.keys(answers).length} / {questions.length}
</p>
{containsMath(question.question) ? (
  <MathJax dynamic key={question.id}>
    {question.question}
  </MathJax>
) : (
  <p style={{ fontWeight: "bold", whiteSpace: "pre-wrap" }}>
    {question.question}
  </p>
)}
      {/* OPTIONS */}
   
<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
  
  {["A", "B", "C", "D"].map((opt) => {
    const value = question[`option_${opt.toLowerCase()}`];

    return (
      <button
        key={opt}
        onClick={() => selectAnswer(question.id, opt)}
        disabled={submitted}
        style={{
  padding: "15px",
  borderRadius: "10px",
  border:
    answers[question.id] === opt
      ? "2px solid #22c55e"
      : "1px solid #e5e7eb",
  background:
    answers[question.id] === opt
      ? "#dcfce7"
      : "#ffffff",
  cursor: submitted ? "not-allowed" : "pointer",
  textAlign: "left",
  color: "#111827",
  fontSize: "15px",
  fontWeight: "500",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
}}      >
        {containsMath(value) ? (
  <MathJax dynamic>
    {opt}. {value}
  </MathJax>
) : (
  <span>
    <strong>{opt}.</strong> {value}
  </span>
)}      </button>
    );
  })}

</div>

      {/* NAVIGATION */}
     <div
  style={{
    marginTop: "30px",
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  }}
>
  <button
    onClick={prevQuestion}
    disabled={current === 0 || submitted}
    style={{
      padding: "12px 24px",
      borderRadius: "10px",
      border: "none",
      background: current === 0 || submitted ? "#d1d5db" : "#2563eb",
      color: "#fff",
      fontWeight: "600",
      fontSize: "15px",
      cursor:
        current === 0 || submitted ? "not-allowed" : "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(37,99,235,0.2)",
    }}
  >
    Previous
  </button>

  <button
    onClick={nextQuestion}
    disabled={
      current === questions.length - 1 || submitted
    }
    style={{
      padding: "12px 24px",
      borderRadius: "10px",
      border: "none",
      background:
        current === questions.length - 1 || submitted
          ? "#d1d5db"
          : "#10b981",
      color: "#fff",
      fontWeight: "600",
      fontSize: "15px",
      cursor:
        current === questions.length - 1 || submitted
          ? "not-allowed"
          : "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(16,185,129,0.2)",
    }}
  >
    Next 
  </button>

  <button
    onClick={() => {
  if (
    window.confirm(
      "Are you sure you want to submit your exam?"
    )
  ) {
    submitExam();
  }
}}
    disabled={submitted}
    style={{
      padding: "12px 28px",
      borderRadius: "10px",
      border: "none",
      background: submitted ? "#9ca3af" : "#ef4444",
      color: "#fff",
      fontWeight: "700",
      fontSize: "15px",
      cursor: submitted ? "not-allowed" : "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(239,68,68,0.25)",
    }}
  >
    Submit Exam
  </button>
</div>    </div>
    {modal.show && (
    <Modal
      title={modal.title}
      message={modal.message}
      onClose={() =>
        setModal({ show: false, title: "", message: "" })
      }
    />
  )}
    </StudentLayout>
    
  );
  
}
