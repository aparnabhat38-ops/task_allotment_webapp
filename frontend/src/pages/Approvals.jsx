import { useEffect, useState, useMemo } from "react";
import "../Dashboard.css";
import Navbar from "../components/Navbar";
import API from "../services/api";

const STATUS_COLORS = {
  Pending:  { bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.4)",  text: "#fbbf24", dot: "#fbbf24"  },
  Approved: { bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.4)",   text: "#22c55e", dot: "#22c55e"  },
  Rejected: { bg: "rgba(244,63,94,0.12)",   border: "rgba(244,63,94,0.4)",   text: "#f43f5e", dot: "#f43f5e"  },
};

const TABS = ["All", "Pending", "Approved", "Rejected"];

function RequestCard({ request, taskTitle, traineeNames, onApprove, onReject }) {
  const status = request.approval_status;
  const colors = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  const isPending = status === "Pending";

  return (
    <div style={{
      background: "var(--bg-surface)",
      border: `1px solid var(--border)`,
      borderRadius: "var(--radius-md)",
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      transition: "all 0.25s ease",
      boxShadow: "var(--shadow-sm)",
      borderLeft: `4px solid ${colors.dot}`,
    }}>
      {/* Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
            {taskTitle}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            👤 {traineeNames} &nbsp;·&nbsp; Request #{request.id}
          </div>
        </div>
        {/* Status Badge */}
        <span style={{
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          color: colors.text,
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}>
          {status === "Pending" ? "⏳" : status === "Approved" ? "✅" : "❌"} {status}
        </span>
      </div>

      {/* Details */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "8px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "12px 16px",
      }}>
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>Task ID</div>
          <div style={{ fontWeight: 600, fontSize: "14px" }}>#{request.task_id}</div>
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>Requested Status</div>
          <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--accent)" }}>{request.requested_status}</div>
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>Approval Status</div>
          <div style={{ fontWeight: 700, fontSize: "14px", color: colors.text }}>{status}</div>
        </div>
      </div>

      {/* Action Buttons (only for pending) */}
      {isPending && (
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <button
            className="approve-btn"
            onClick={() => onApprove(request.id)}
            style={{ flex: 1, padding: "10px 0", borderRadius: "var(--radius-sm)", fontWeight: 700, fontSize: "14px" }}
          >
            ✅ Approve
          </button>
          <button
            className="reject-btn"
            onClick={() => onReject(request.id)}
            style={{ flex: 1, padding: "10px 0", borderRadius: "var(--radius-sm)", fontWeight: 700, fontSize: "14px" }}
          >
            ❌ Reject
          </button>
        </div>
      )}
    </div>
  );
}

function Approvals() {
  const [allRequests, setAllRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [reqsRes, usersRes, tasksRes] = await Promise.all([
        API.get("/all-requests"),
        API.get("/users"),
        API.get("/tasks"),
      ]);
      setAllRequests(reqsRes.data);
      setUsers(usersRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error("Error fetching approval page data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approveRequest = async (id) => {
    if (!window.confirm("Approve this request? The task status will be updated.")) return;
    try {
      await API.post(`/approve/${id}`);
      await fetchData();
    } catch (error) {
      console.error(error);
      alert("Failed to approve request");
    }
  };

  const rejectRequest = async (id) => {
    if (!window.confirm("Reject this request?")) return;
    try {
      await API.post(`/reject/${id}`);
      await fetchData();
    } catch (error) {
      console.error(error);
      alert("Failed to reject request");
    }
  };

  const getUserNameById = (id) => {
    const found = users.find((u) => Number(u.id) === Number(id));
    return found ? found.name : `User #${id}`;
  };

  const getTaskTitleById = (id) => {
    const found = tasks.find((t) => Number(t.id) === Number(id));
    return found ? found.title : `Task #${id}`;
  };

  // Counts
  const counts = useMemo(() => ({
    All: allRequests.length,
    Pending: allRequests.filter((r) => r.approval_status === "Pending").length,
    Approved: allRequests.filter((r) => r.approval_status === "Approved").length,
    Rejected: allRequests.filter((r) => r.approval_status === "Rejected").length,
  }), [allRequests]);

  // Filtered list
  const filteredRequests = useMemo(() => {
    let list = activeTab === "All" ? allRequests : allRequests.filter((r) => r.approval_status === activeTab);
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((r) => {
        const title = getTaskTitleById(r.task_id).toLowerCase();
        const name = getUserNameById(r.requested_by).toLowerCase();
        const status = r.requested_status.toLowerCase();
        return title.includes(term) || name.includes(term) || status.includes(term);
      });
    }
    return list;
  }, [allRequests, activeTab, searchTerm, users, tasks]);

  const tabStyle = (tab) => ({
    padding: "8px 18px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s",
    background: activeTab === tab ? "var(--accent)" : "transparent",
    borderColor: activeTab === tab ? "var(--accent)" : "var(--border)",
    color: activeTab === tab ? "#fff" : "var(--text-muted)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  });

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div className="dashboard">
        <h1>Approval Requests</h1>
        <p style={{ color: "var(--text-muted)", marginTop: "-20px", marginBottom: "32px" }}>
          Review all trainee status change requests — approve or reject pending ones.
        </p>

        {/* Summary Stats */}
        <div className="metrics-grid" style={{ marginBottom: "32px" }}>
          {[
            { label: "Total Requests", value: counts.All,      icon: "📋", cls: "total"    },
            { label: "Pending",        value: counts.Pending,  icon: "⏳", cls: "pending"  },
            { label: "Approved",       value: counts.Approved, icon: "✅", cls: "done"     },
            { label: "Rejected",       value: counts.Rejected, icon: "❌", cls: "high"     },
          ].map((m) => (
            <div
              key={m.label}
              className={`metric-card ${m.cls}`}
              onClick={() => setActiveTab(m.label === "Total Requests" ? "All" : m.label)}
              style={{ cursor: "pointer" }}
            >
              <div className="metric-card-header">
                <span className="metric-label">{m.label}</span>
                <span className="metric-icon">{m.icon}</span>
              </div>
              <p className="metric-value">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs + Search Row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginBottom: "24px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {TABS.map((tab) => (
              <button key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>
                {tab}
                <span style={{
                  background: activeTab === tab ? "rgba(255,255,255,0.2)" : "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "1px 7px",
                  fontSize: "11px",
                  fontWeight: 800,
                }}>{counts[tab] || 0}</span>
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="🔍 Search by task, trainee, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "8px 14px",
              color: "var(--text-main)",
              fontSize: "13px",
              minWidth: "260px",
              outline: "none",
            }}
          />
        </div>

        {/* Bulk approve all pending (only shows on Pending tab) */}
        {activeTab === "Pending" && counts.Pending > 1 && (
          <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            <button
              className="approve-btn"
              style={{ padding: "8px 20px", fontSize: "13px", fontWeight: 700, borderRadius: "var(--radius-sm)" }}
              onClick={async () => {
                if (!window.confirm(`Approve all ${counts.Pending} pending requests?`)) return;
                const pending = allRequests.filter(r => r.approval_status === "Pending");
                for (const r of pending) {
                  await API.post(`/approve/${r.id}`).catch(() => {});
                }
                await fetchData();
              }}
            >
              ✅ Approve All Pending ({counts.Pending})
            </button>
          </div>
        )}

        {/* Request List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)", fontSize: "16px" }}>
            Loading requests…
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="no-data" style={{ textAlign: "center", padding: "60px 0" }}>
            <span style={{ fontSize: "32px", display: "block", marginBottom: "12px" }}>
              {activeTab === "Pending" ? "🎉" : "📭"}
            </span>
            {activeTab === "Pending"
              ? "No pending requests — all clear!"
              : `No ${activeTab.toLowerCase()} requests found.`}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                taskTitle={getTaskTitleById(request.task_id)}
                traineeNames={getUserNameById(request.requested_by)}
                onApprove={approveRequest}
                onReject={rejectRequest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Approvals;
