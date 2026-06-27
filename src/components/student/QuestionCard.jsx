export default function QuestionCard({
  question,
  selected,
  onSelect,
}) {
  if (!question) return null;

  const options = [
    { key: "A", value: question.option_a },
    { key: "B", value: question.option_b },
    { key: "C", value: question.option_c },
    { key: "D", value: question.option_d },
  ];

  return (
    <div className="question-card">
      {/* QUESTION */}
      <h3 style={{ marginBottom: "15px" }}>
        {question.question}
      </h3>

      {/* OPTIONS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onSelect(question.id, opt.key)}
            className="option-btn"
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              textAlign: "left",
              cursor: "pointer",
              background:
                selected === opt.key
                  ? "#2563EB"
                  : "white",
              color:
                selected === opt.key
                  ? "white"
                  : "black",
              transition: "0.2s",
            }}
          >
            <strong>{opt.key}.</strong> {opt.value}
          </button>
        ))}
      </div>
    </div>
  );
}