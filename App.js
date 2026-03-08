// src/App.jsx
import { useState, useEffect } from "react";

// ── Storage ──
function load(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

// ── Defaults ──
const defaultProfile = {
  name: "我的人生规划中心",
  subtitle: "点击编辑 · 你现在的身份 → 你的五年目标",
  bio: "在这里写下你是谁。\n例如：你的职业/兴趣身份，以及你最核心的价值观是什么。",
  tags: ["点击编辑", "添加关键词", "你的领域"],
};

const defaultOdyssey = [
  { id: 1, title: "五年目标", content: "写下你的长期目标和愿景。" },
  { id: 2, title: "短期任务", content: "每月、每周、每天的可执行计划。" },
];

const defaultTasks = [
  { id: 1, task: "学习 React", done: false },
  { id: 2, task: "完成人生规划文档", done: false },
];

const defaultNotes = [
  { id: 1, note: "今天心情不错，可以高效工作" },
  { id: 2, note: "提醒自己保持学习习惯" },
];

// ── Helpers ──
function EditText({ value, onChange, multiline, style, placeholder }) {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  const commit = () => {
    setEditing(false);
    if (v !== value) onChange(v);
  };
  const shared = {
    value: v,
    onChange: (e) => setV(e.target.value),
    onBlur: commit,
    autoFocus: true,
    onKeyDown: (e) => {
      if (!multiline && e.key === "Enter") commit();
      if (e.key === "Escape") {
        setV(value);
        setEditing(false);
      }
    },
    style: {
      background: "rgba(255,220,100,0.07)",
      border: "1px solid rgba(255,220,100,0.25)",
      borderRadius: "4px",
      color: "inherit",
      padding: "2px 6px",
      fontFamily: "inherit",
      fontSize: "inherit",
      width: "100%",
      outline: "none",
      resize: multiline ? "vertical" : "none",
      ...style,
    },
  };
  if (editing) return multiline ? <textarea {...shared} rows={3} /> : <input {...shared} />;
  return (
    <span
      onClick={() => setEditing(true)}
      title="点击编辑"
      style={{
        cursor: "text",
        borderBottom: "1px dashed rgba(255,255,255,0.15)",
        paddingBottom: "1px",
        ...style,
      }}
    >
      {v || <span style={{ opacity: 0.3 }}>{placeholder || "点击编辑"}</span>}
    </span>
  );
}

// ── Main ──
export default function App() {
  const [profile, setProfile] = useState(defaultProfile);
  const [odyssey, setOdyssey] = useState(defaultOdyssey);
  const [tasks, setTasks] = useState(defaultTasks);
  const [notes, setNotes] = useState(defaultNotes);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const p = load("upc-profile");
    const o = load("upc-odyssey");
    const t = load("upc-tasks");
    const n = load("upc-notes");
    if (p) setProfile(p);
    if (o) setOdyssey(o);
    if (t) setTasks(t);
    if (n) setNotes(n);
    setLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (loaded) {
      save("upc-profile", profile);
      save("upc-odyssey", odyssey);
      save("upc-tasks", tasks);
      save("upc-notes", notes);
    }
  }, [profile, odyssey, tasks, notes, loaded]);

  // Toggle task
  const toggleTask = (id) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#090b10", color: "#ddd6c6", fontFamily: "sans-serif", padding: "36px" }}>
      <h1>
        <EditText value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
      </h1>
      <h2>
        <EditText value={profile.subtitle} onChange={(v) => setProfile({ ...profile, subtitle: v })} />
      </h2>
      <p>
        <EditText value={profile.bio} onChange={(v) => setProfile({ ...profile, bio: v })} multiline />
      </p>

      <h3>五年目标 / Odyssey</h3>
      {odyssey.map((o) => (
        <div key={o.id} style={{ marginBottom: "12px" }}>
          <EditText
            value={o.title}
            onChange={(v) => setOdyssey(odyssey.map(item => item.id === o.id ? { ...item, title: v } : item))}
          />
          <EditText
            value={o.content}
            onChange={(v) => setOdyssey(odyssey.map(item => item.id === o.id ? { ...item, content: v } : item))}
            multiline
          />
        </div>
      ))}

      <h3>Tasks</h3>
      {tasks.map((t) => (
        <div key={t.id}>
          <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
          <EditText value={t.task} onChange={(v) => setTasks(tasks.map(item => item.id === t.id ? { ...item, task: v } : item))} />
        </div>
      ))}

      <h3>Notes</h3>
      {notes.map((n) => (
        <div key={n.id}>
          <EditText value={n.note} onChange={(v) => setNotes(notes.map(item => item.id === n.id ? { ...item, note: v } : item))} multiline />
        </div>
      ))}
    </div>
  );
}