import { useState } from "react";

function TaskForm({ addTask }) {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [eta, setEta] = useState("");
  const [updateUrl, setUpdateUrl] = useState("");

  const validateURL = (url) => {
    if (!url) return true;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (taskName.trim() === "") {
      alert("Please enter a task name or title");
      return;
    }
    const titleRegex= /[a-zA-Z]/;
    if(!titleRegex.test(taskName)){
      alert("task tiltle must contain letters");
      return;
    }

    if (updateUrl && !validateURL(updateUrl)) {
      alert("Please enter a valid URL (starting with http:// or https://) for the Task Update URL.");
      return;
    }

    addTask(taskName, priority, eta || null, updateUrl || null);
    setTaskName("");
    setPriority("Medium");
    setEta("");
    setUpdateUrl("");
  };

  return (
    <div className="task-form">
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Task Title</label>
        <input
          type="text"
          placeholder="Task Name or Title"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
      </div>
      
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">🔥 High Priority</option>
          <option value="Medium">⚡ Medium Priority</option>
          <option value="Low">🌱 Low Priority</option>
        </select>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>ETA (Target completion date/time)</label>
        <input
          type="datetime-local"
          value={eta}
          onChange={(e) => setEta(e.target.value)}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Task Update URL</label>
        <input
          type="url"
          placeholder="https://example.com/submit"
          value={updateUrl}
          onChange={(e) => setUpdateUrl(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Assign Task
      </button>
    </div>
  );
}

export default TaskForm;