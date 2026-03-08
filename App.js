import { useState, useEffect } from "react";

// ── Storage ───────────────────────────────────────────────────────────────────
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

// ── Defaults ──────────────────────────────────────────────────────────────────
const defaultProfile = {
  name: "我的人生规划中心",
  subtitle: "点击编辑 · 你现在的身份 → 你的五年目标",
  bio: "在这里写下你是谁。\n例如：你的职业/兴趣身份，以及你最核心的价值观是什么。",
  tags: ["点击编辑", "添加关键词", "你的领域"],
};

const defaultOdyssey = [
  {
    id: 1,
    code: "人生一",
    title: "点击编辑标题",
    tagline: "用一句话概括这条人生线的核心",
    color: "#c8a96e",
    description:
      "【当前轨道】这是你正在走的路，或一直以来心里酝酿的方向。描述这条线的核心逻辑：你会怎么走，走向哪里，沿途经历什么。",
    timeline: [
      { id: 1, time: "第一年", event: "点击编辑 · 这一阶段你的核心行动是什么？" },
      { id: 2, time: "第二年", event: "点击编辑 · 你预期会到达什么节点？" },
      { id: 3, time: "第三年", event: "关键转折或里程碑" },
      { id: 4, time: "第四年", event: "深化或扩展阶段" },
      { id: 5, time: "第五年", event: "点击编辑 · 五年后你在哪里，做什么？" },
    ],
    questions: [
      "点击编辑 · 走这条路会回答你哪个最重要的问题？",
      "点击编辑 · 你对这条路最大的顾虑是什么？",
    ],
    dashboard: { resources: 50, likeability: 50, confidence: 50, coherence: 50 },
    pros: ["点击编辑 · 这条路的优势", "它能给你带来什么？"],
    cons: ["点击编辑 · 这条路的风险", "你需要放弃什么？"],
    inspirations: [],
  },
  {
    id: 2,
    code: "人生二",
    title: "点击编辑标题",
    tagline: "如果人生一的路突然消失，你会走这条",
    color: "#7eb8a4",
    description:
      "【备选轨道】如果你目前走的路突然走不通了，你会选择做什么？这条线不是退路，而是另一种可能的你。",
    timeline: [
      { id: 1, time: "第一年", event: "点击编辑 · 这条路的起点在哪里？" },
      { id: 2, time: "第二年", event: "点击编辑 · 你需要建立什么？" },
      { id: 3, time: "第三年", event: "关键转折点" },
      { id: 4, time: "第四年", event: "深化阶段" },
      { id: 5, time: "第五年", event: "点击编辑 · 五年后的状态" },
    ],
    questions: [
      "点击编辑 · 这条路满足你哪些在人生一里得不到的东西？",
      "点击编辑 · 你一直没放下这个方向的原因是什么？",
    ],
    dashboard: { resources: 50, likeability: 50, confidence: 50, coherence: 50 },
    pros: ["点击编辑 · 优势", "点击添加"],
    cons: ["点击编辑 · 风险", "点击添加"],
    inspirations: [],
  },
  {
    id: 3,
    code: "人生三",
    title: "点击编辑标题",
    tagline: "如果钱不是问题，我会这样活着",
    color: "#b07ec4",
    description:
      "【野生计划 ✦】打破所有现实顾虑，如果没有任何限制，你最想要的生活是什么样的？这条线用来释放被压制的真实渴望。",
    timeline: [
      { id: 1, time: "现在开始", event: "点击编辑 · 如果今天就开始，第一步是什么？" },
      { id: 2, time: "一年后", event: "点击编辑 · 你的生活会有什么不同？" },
      { id: 3, time: "两到三年", event: "点击编辑 · 你在哪里，做什么，和谁在一起？" },
      { id: 4, time: "五年后", event: "点击编辑 · 这条路最理想的终点是什么？" },
    ],
    questions: [
      "点击编辑 · 不考虑别人的看法，你最想做的事是什么？",
      "点击编辑 · 这个梦想里，哪些部分其实是可以实现的？",
    ],
    dashboard: { resources: 30, likeability: 90, confidence: 40, coherence: 80 },
    pros: ["点击编辑 · 最吸引你的是什么？", "点击添加"],
    cons: ["点击编辑 · 最大的现实障碍", "点击添加"],
    inspirations: [],
  },
];

const defaultTasks = [
  { id: 1, text: "点击编辑 · 添加你的第一个任务", done: false, priority: "high" },
  { id: 2, text: "点击编辑 · 本周最重要的一件事", done: false, priority: "high" },
  { id: 3, text: "点击编辑 · 下一步行动", done: false, priority: "mid" },
];

const defaultNotes = `# 灵感 & 想法

在这里随时记录冒出来的想法、观察、灵感……

---

提示：可以用这个空间记录：
· 让你心跳加速的事
· 某句久久无法忘记的话
· 对三条人生线的新想法
· 任何你不想忘记的瞬间`;

// ── Helpers ───────────────────────────────────────────────────────────────────
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
      style={{ cursor: "text", borderBottom: "1px dashed rgba(255,255,255,0.15)", paddingBottom: "1px", ...style }}
    >
      {v || <span style={{ opacity: 0.3 }}>{placeholder || "点击编辑"}</span>}
    </span>
  );
}

const PRIO = { high: { label: "紧急", color: "#ff6b6b" }, mid: { label: "重要", color: "#ffd166" }, low: { label: "普通", color: "#6bcb77" } };

function GaugeMini({ value, color }) {
  const r = 18,
    circ = 2 * Math.PI * r,
    fill = (value / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
      <svg width="44" height="44" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ marginTop: "-36px", fontSize: "11px", fontWeight: "600", color, textAlign: "center" }}>{value}</div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [profile, setProfile] = useState(defaultProfile);
  const [odyssey, setOdyssey] = useState(defaultOdyssey);
  const [tasks, setTasks] = useState(defaultTasks);
  const [notes, setNotes] = useState(defaultNotes);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("home");
  const [activeOdyssey, setActiveOdyssey] = useState(0);
  const [newInspo, setNewInspo] = useState("");

  // Load from localStorage
  useEffect(() => {
    const p = load("upc-profile");
    if (p) setProfile(p);
    const o = load("upc-odyssey");
    if (o) setOdyssey(o);
    const t = load("upc-tasks");
    if (t) setTasks(t);
    const n = load("upc-notes");
    if (n !== null) setNotes(n);

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) save("upc-profile", profile);
  }, [profile, loaded]);
  useEffect(() => {
    if (loaded) save("upc-odyssey", odyssey);
  }, [odyssey, loaded]);
  useEffect(() => {
    if (loaded) save("upc-tasks", tasks);
  }, [tasks, loaded]);
  useEffect(() => {
    if (loaded) save("upc-notes", notes);
  }, [notes, loaded]);

  const plan = odyssey[activeOdyssey];

  // Odyssey helpers
  const updatePlan = (id, field, val) =>
    setOdyssey((o) => o.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  const updateTimeline = (planId, tlId, field, val) =>
    setOdyssey((o) =>
      o.map((p) =>
        p.id === planId
          ? { ...p, timeline: p.timeline.map((t) => (t.id === tlId ? { ...t, [field]: val } : t)) }
          : p
      )
    );
  const addTimeline = (planId) =>
    setOdyssey((o) =>
      o.map((p) =>
        p.id === planId
          ? { ...p, timeline: [...p.timeline, { id: Date.now(), time: "新时间点", event: "新里程碑" }] }
          : p
      )
    );
  const delTimeline = (planId, tlId) =>
    setOdyssey((o) =>
      o.map((p) => (p.id === planId ? { ...p, timeline: p.timeline.filter((t) => t.id !== tlId) } : p))
    );
  const addInspo = (planId) => {
    if (!newInspo.trim()) return;
    setOdyssey((o) =>
      o.map((p) =>
        p.id === planId
          ? {
              ...p,
              inspirations: [...(p.inspirations || []), { id: Date.now(), text: newInspo.trim(), date: new Date().toLocaleDateString("zh-CN") }],
            }
          : p
      )
    );
    setNewInspo("");
  };
  const delInspo = (planId, insId) =>
    setOdyssey((o) =>
      o.map((p) =>
        p.id === planId ? { ...p, inspirations: (p.inspirations || []).filter((i) => i.id !== insId) } : p
      )
    );

  // Task helpers
  const addTask = () => setTasks((t) => [...t, { id: Date.now(), text: "新任务", done: false, priority: "mid" }]);
  const toggleTask = (id) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const delTask = (id) => setTasks((t) => t.filter((x) => x.id !== id));
  const updateTask = (id, f, v) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, [f]: v } : x)));

  // ── Style tokens ─────────────────────────────────────────────────────────────
  const C = { bg: "#090b10", surface: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)", accent: "#c8a96e", text: "#ddd6c6", muted: "rgba(221,214,198,0.38)" };
  const card = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "22px 24px" };

  const TABS = [
    { id: "home", icon: "⌂", label: "主页" },
    { id: "odyssey", icon: "◎", label: "奥德赛" },
    { id: "tasks", icon: "◻", label: "任务" },
    { id: "notes", icon: "✎", label: "灵感" },
  ];

  const doneTasks = tasks.filter((t) => t.done).length;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Cormorant Garamond','Noto Serif SC',Georgia,serif", display: "flex" }}>
      {/* Sidebar */}
      {/* ...省略 sidebar 和 home、odyssey、tasks 部分，与原代码一致 */}
      
      {/* ── NOTES ── */}
      {tab === "notes" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ margin: "0 0 4px", fontWeight: "400", fontSize: "20px" }}>灵感 & 笔记</h2>
              <div style={{ fontSize: "11px", color: C.muted }}>随时记录想法，自动保存</div>
            </div>
            <div style={{ fontSize: "11px", color: C.muted, letterSpacing: "1px" }}>{notes?.length || 0} 字</div>
          </div>
          <div style={card}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: "100%",
                minHeight: "300px",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${C.border}`,
                borderRadius: "6px",
                color: C.text,
                padding: "14px",
                fontSize: "14px",
                fontFamily: "inherit",
                lineHeight: "1.7",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}