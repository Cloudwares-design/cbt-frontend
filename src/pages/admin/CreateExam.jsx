import { useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

export default function CreateExam() {
  const [title, setTitle] = useState("");

  const [unlimitedTime, setUnlimitedTime] = useState(false);
  const [duration, setDuration] = useState("");

  const [allowRetake, setAllowRetake] = useState(false);

  const [showAnswers, setShowAnswers] = useState(false);

  const [showExplanations, setShowExplanations] = useState(false);

  const createExam = async () => {
    try {
      await API.post("/exams/create", {
        title,
        duration,
        unlimitedTime,
        allowRetake,
        showAnswers,
        showExplanations,
      });

      alert("Exam created successfully");

      setTitle("");
      setDuration("");
      setUnlimitedTime(false);
      setAllowRetake(false);
      setShowAnswers(false);
      setShowExplanations(false);

    } catch (err) {
      alert("Error creating exam");
    }
  };

  return (
    <AdminLayout>

      <h2>Create Exam</h2>

      <div style={{ maxWidth: 500 }}>

        <label>Exam Title</label>

        <input
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />

        <h3>Time Limit</h3>

        <label>
          <input
            type="radio"
            checked={unlimitedTime === false}
            onChange={() => setUnlimitedTime(false)}
          />
          Specific Time
        </label>

        <br />

        <label>
          <input
            type="radio"
            checked={unlimitedTime === true}
            onChange={() => setUnlimitedTime(true)}
          />
          Unlimited Time
        </label>

        <br /><br />

        {!unlimitedTime && (
          <>
            <label>Duration (Minutes)</label>

            <input
              type="number"
              style={styles.input}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </>
        )}

        <hr />

        <h3>Retake</h3>

        <label>
          <input
            type="radio"
            checked={allowRetake === true}
            onChange={() => setAllowRetake(true)}
          />
          Allow Retake
        </label>

        <br />

        <label>
          <input
            type="radio"
            checked={allowRetake === false}
            onChange={() => setAllowRetake(false)}
          />
          Do Not Allow Retake
        </label>

        <hr />

        <h3>Result Settings</h3>

        <label>
          <input
            type="checkbox"
            checked={showAnswers}
            onChange={(e) =>
              setShowAnswers(e.target.checked)
            }
          />
          Show Correct Answers
        </label>

        <br />

        <label>
          <input
            type="checkbox"
            checked={showExplanations}
            onChange={(e) =>
              setShowExplanations(e.target.checked)
            }
          />
          Show Explanations
        </label>

        <br /><br />

        <button
          style={styles.button}
          onClick={createExam}
        >
          Create Exam
        </button>

      </div>

    </AdminLayout>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  button: {
    padding: "12px 25px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};