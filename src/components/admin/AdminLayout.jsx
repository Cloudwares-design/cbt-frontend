import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const getLinkStyle = (path) => ({
    color: "white",
    textDecoration: "none",
    padding: "12px",
    borderRadius: "6px",
    transition: "0.3s",
    background:
      location.pathname === path
        ? "#2563EB"
        : "rgba(255,255,255,0.1)",
    fontWeight:
      location.pathname === path
        ? "bold"
        : "normal",
  });

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* MOBILE MENU */}
      {isMobile && (
        <button
          onClick={() => setOpen(!open)}
          style={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1000,
            padding: "10px 14px",
            border: "none",
            borderRadius: "6px",
            background: "#1E40AF",
            color: "white",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      )}

      {/* SIDEBAR */}
      <div
        style={{
          width: isMobile
            ? open
              ? "250px"
              : "0"
            : "250px",
          background: "#1E40AF",
          color: "#fff",
          overflow: "hidden",
          transition: "0.3s",
          paddingTop: "60px",
        }}
      >
        <h2
          style={{
            padding: "20px",
            margin: 0,
          }}
        >
          CBT Admin
        </h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "20px",
          }}
        >
          <Link
            to="/admin/dashboard"
            style={getLinkStyle(
              "/admin/dashboard"
            )}
          >
            Dashboard
          </Link>

          <Link
            to="/admin/manage-students"
            style={getLinkStyle(
              "/admin/manage-students"
            )}
          >
            Students
          </Link>

          <Link
            to="/admin/manage-exams"
            style={getLinkStyle(
              "/admin/manage-exams"
            )}
          >
            Exams
          </Link>

          <Link
            to="/admin/results"
            style={getLinkStyle(
              "/admin/results"
            )}
          >
            Results
          </Link>

          <button
            onClick={logout}
            style={{
              border: "none",
              padding: "12px",
              borderRadius: "6px",
              background: "#DC2626",
              color: "white",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#F8FAFC",
        }}
      >
        {children}
      </div>
    </div>
  );
}