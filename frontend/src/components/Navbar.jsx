import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user?.role === "admin") {
      API.get("/pending-requests")
        .then((res) => setPendingCount(res.data.length))
        .catch(() => {});
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    fontWeight: 600,
    fontSize: "14px",
    color: isActive(path) ? "var(--accent)" : "var(--text-muted)",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: "var(--radius-sm)",
    background: isActive(path) ? "rgba(99,102,241,0.12)" : "transparent",
    border: isActive(path) ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    position: "relative",
  });

  return (
    <nav>
      <Link to={user?.role === "admin" ? "/admin" : "/trainee"} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <h2>
          <span style={{ fontSize: "24px" }}>🎯</span> Task Allotment System
        </h2>
      </Link>

      {user && (
        <div className="nav-user">
          {user.role === "admin" && (
            <div style={{ display: "flex", gap: "8px", marginRight: "8px" }}>
              <Link to="/admin" style={navLinkStyle("/admin")}>
                📋 Dashboard
              </Link>
              <Link to="/approvals" style={navLinkStyle("/approvals")}>
                🔔 Approvals
                {pendingCount > 0 && (
                  <span style={{
                    background: "#f43f5e",
                    color: "#fff",
                    borderRadius: "10px",
                    padding: "1px 7px",
                    fontSize: "11px",
                    fontWeight: 800,
                    minWidth: "18px",
                    textAlign: "center",
                    lineHeight: "16px",
                  }}>
                    {pendingCount}
                  </span>
                )}
              </Link>
            </div>
          )}
          <span className="user-tag">
            👤 {user.name} ({user.role})
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
