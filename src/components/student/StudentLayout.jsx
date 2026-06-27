import { useNavigate } from "react-router-dom";

export default function StudentLayout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
  <div className="layout-wrapper">

    {/* SIDEBAR */}
    <div className="sidebar">
      <h2 className="logo">🎓 WileyEdit CBT</h2>

      <button onClick={() => navigate("/student/dashboard")}>
        📚 Dashboard
      </button>

      <button onClick={() => navigate("/student/results")}>
        📊 Results
      </button>

      <button onClick={logout}>
        🚪 Logout
      </button>
    </div>

    {/* MAIN CONTENT */}
    <div className="main-content">
      {children}
    </div>

  </div>
);
}
