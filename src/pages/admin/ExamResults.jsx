import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

export default function ExamResults() {
  const { examId } = useParams();

  const [results, setResults] = useState([]);

  useEffect(() => {
    loadResults();
  }, [examId]);

  const loadResults = async () => {
    const res = await API.get(
      `/exams/${examId}/results`
    );

    setResults(res.data);
  };
return (
  <AdminLayout>
    <div
      style={{
        padding: "20px",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          color: "#1e293b",
        }}
      >
        📊 Exam Ranking
      </h2>

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          overflowX: "auto",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#2563eb",
                color: "white",
              }}
            >
              <th style={styles.th}>Rank</th>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Percentage</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Submitted</th>
            </tr>
          </thead>

          <tbody>
            {results.map((r, index) => {
              const percent = Math.round(
                (r.score / r.total) * 100
              );

              const passed = percent >= 50;

              return (
                <tr
                  key={r.id}
                  style={{
                    borderBottom:
                      "1px solid #e5e7eb",
                  }}
                >
                  <td style={styles.td}>
                    #{index + 1}
                  </td>

                  <td style={styles.td}>
                    {r.name}
                  </td>

                  <td style={styles.td}>
                    {r.email}
                  </td>

                  <td style={styles.td}>
                    {r.score}/{r.total}
                  </td>

                  <td style={styles.td}>
                    {percent}%
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        background: passed
                          ? "#dcfce7"
                          : "#fee2e2",
                        color: passed
                          ? "#166534"
                          : "#991b1b",
                        padding:
                          "5px 10px",
                        borderRadius:
                          "20px",
                        fontWeight:
                          "bold",
                      }}
                    >
                      {passed
                        ? "PASS"
                        : "FAIL"}
                    </span>
                  </td>

                  <td style={styles.td}>
                    {new Date(
                      r.submitted_at
                    ).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div style={styles.statCard}>
          👥 Candidates: {results.length}
        </div>

        <div style={styles.statCard}>
          ✅ Passed:{" "}
          {
            results.filter(
              (r) =>
                Math.round(
                  (r.score /
                    r.total) *
                    100
                ) >= 50
            ).length
          }
        </div>

        <div style={styles.statCard}>
          ❌ Failed:{" "}
          {
            results.filter(
              (r) =>
                Math.round(
                  (r.score /
                    r.total) *
                    100
                ) < 50
            ).length
          }
        </div>
      </div>
    </div>
  </AdminLayout>
);
 
}
const styles = {
  th: {
    padding: "14px",
    textAlign: "left",
  },

  td: {
    padding: "14px",
  },

  statCard: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)",
    fontWeight: "bold",
  },
};