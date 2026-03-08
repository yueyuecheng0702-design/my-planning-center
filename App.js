import { useState, useEffect, useRef } from "react";

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
    id: 1, code: "人生一", title: "点击编辑标题",
    tagline: "用一句话概括这条人生线的核心",
    color: "#c8a96e",
    description: "【当前轨道】这是你正在走的路，或一直以来心里酝酿的方向。描述这条线的核心逻辑：你会怎么走，走向哪里，沿途经历什么。",
    timeline: [
      { id: 1, time: "第一年", event: "点击编辑 · 这一阶段你的核心行动是什么？" },
      { id: 2, time: "第二年", event: "点击编辑 · 你预期会到达什么节点？" },
      { id: 3, time: "第三年", event: "点击编辑 · 关键转折或里程碑" },
      { id: 4, time: "第四年", event: "点击编辑 · 深化或扩展阶段" },
      { id: 5, time: "第五年", event: "点击编辑 · 五年后你在哪里，做什么？" },
    ],
    questions: ["点击编辑 · 走这条路会回答你哪个最重要的问题？", "点击编辑 · 你对这条路最大的顾虑是什么？"],
    dashboard: { resources: 50, likeability: 50, confidence: 50, coherence: 50 },
    pros: ["点击编辑 · 这条路的优势", "它能给你带来什么？"],
    cons: ["点击编辑 · 这条路的风险", "你需要放弃什么？"],
    inspirations: [],
  },
  {
    id: 2, code: "人生二", title: "点击编辑标题",
    tagline: "如果人生一的路突然消失，你会走这条",
    color: "#7eb8a4",
    description: "【备选轨道】如果你目前走的路突然走不通了，你会选择做什么？这条线不是退路，而是另一种可能的你。",
    timeline: [
      { id: 1, time: "第一年", event: "点击编辑 · 这条路的起点在哪里？" },
      { id: 2, time: "第二年", event: "点击编辑 · 你需要建立什么？" },
      { id: 3, time: "第三年", event: "点击编辑 · 关键转折点" },
      { id: 4, time: "第四年", event: "点击编辑 · 深化阶段" },
      { id: 5, time: "第五年", event: "点击编辑 · 五年后的状态" },
    ],
    questions: ["点击编辑 · 这条路满足你哪些在人生一里得不到的东西？", "点击编辑 · 你一直没放下这个方向的原因是什么？"],
    dashboard: { resources: 50, likeability: 50, confidence: 50, coherence: 50 },
    pros: ["点击编辑 · 优势", "点击添加"],
    cons: ["点击编辑 · 风险", "点击添加"],
    inspirations: [],
  },
  {
    id: 3, code: "人生三", title: "点击编辑标题",
    tagline: "如果钱不是问题，我会这样活着",
    color: "#b07ec4",
    description: "【野生计划 ✦】打破所有现实顾虑，如果没有任何限制，你最想要的生活是什么样的？这条线用来释放被压制的真实渴望。",
    timeline: [
      { id: 1, time: "现在开始", event: "点击编辑 · 如果今天就开始，第一步是什么？" },
      { id: 2, time: "一年后", event: "点击编辑 · 你的生活会有什么不同？" },
      { id: 3, time: "两到三年", event: "点击编辑 · 你在哪里，做什么，和谁在一起？" },
      { id: 4, time: "五年后", event: "点击编辑 · 这条路最理想的终点是什么？" },
    ],
    questions: ["点击编辑 · 不考虑别人的看法，你最想做的事是什么？", "点击编辑 · 这个梦想里，哪些部分其实是可以实现的？"],
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

const AI_SYSTEM = `你是用户的专属人生规划顾问，基于斯坦福人生设计课（Designing Your Life）的框架，帮助用户探索人生方向、规划奥德赛计划。

请根据用户的问题，给出专业、具体、有启发性的中文建议。

核心原则：
· 鼓励探索，而不是给出唯一答案
· 帮助用户发现真正的价值观和渴望
· 把抽象方向转化为具体可行动的下一步
· 善用"原型测试"思维——小实验而非大赌注

请用温暖、直接、有洞察力的语气回应。`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function EditText({ value, onChange, multiline, style, placeholder, className }) {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  const commit = () => { setEditing(false); if (v !== value) onChange(v); };
  const shared = {
    value: v, onChange: e => setV(e.target.value), onBlur: commit, autoFocus: true,
    onKeyDown: e => { if (!multiline && e.key === "Enter") commit(); if (e.key === "Escape") { setV(value); setEditing(false); } },
    style: { background: "rgba(255,220,100,0.07)", border: "1px solid rgba(255,220,100,0.25)", borderRadius: "4px", color: "inherit", padding: "2px 6px", fontFamily: "inherit", fontSize: "inherit", width: "100%", outline: "none", resize: multiline ? "vertical" : "none", ...style },
  };
  if (editing) return multiline ? <textarea {...shared} rows={3} /> : <input {...shared} />;
  return (
    <span onClick={() => setEditing(true)} title="点击编辑" style={{ cursor: "text", borderBottom: "1px dashed rgba(255,255,255,0.15)", paddingBottom: "1px", ...style }}>
      {v || <span style={{ opacity: 0.3 }}>{placeholder || "点击编辑"}</span>}
    </span>
  );
}

const PRIO = { high: { label: "紧急", color: "#ff6b6b" }, mid: { label: "重要", color: "#ffd166" }, low: { label: "普通", color: "#6bcb77" } };

function GaugeMini({ value, color }) {
  const r = 18, circ = 2 * Math.PI * r, fill = (value / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
      <svg width="44" height="44" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
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
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [newInspo, setNewInspo] = useState("");
  const chatRef = useRef();

  // Load
useEffect(() => {
  (async () => {
    const p = await load("upc-profile"); if (p) setProfile(p);
    const o = await load("upc-odyssey"); if (o) setOdyssey(o);
    const t = await load("upc-tasks"); if (t) setTasks(t);
    const n = await load("upc-notes"); if (n !== null) setNotes(n);

    setLoaded(true); // ⭐ 这一行是关键
  })();
}, []);

useEffect(() => { if (loaded) save("upc-profile", profile); }, [profile, loaded]);
useEffect(() => { if (loaded) save("upc-odyssey", odyssey); }, [odyssey, loaded]);
useEffect(() => { if (loaded) save("upc-tasks", tasks); }, [tasks, loaded]);
useEffect(() => { if (loaded) save("upc-notes", notes); }, [notes, loaded]);
  useEffect(() => { chatRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const plan = odyssey[activeOdyssey];

  // Odyssey helpers
  const updatePlan = (id, field, val) => setOdyssey(o => o.map(p => p.id === id ? { ...p, [field]: val } : p));
  const updateTimeline = (planId, tlId, field, val) => setOdyssey(o => o.map(p => p.id === planId ? { ...p, timeline: p.timeline.map(t => t.id === tlId ? { ...t, [field]: val } : t) } : p));
  const addTimeline = (planId) => setOdyssey(o => o.map(p => p.id === planId ? { ...p, timeline: [...p.timeline, { id: Date.now(), time: "新时间点", event: "新里程碑" }] } : p));
  const delTimeline = (planId, tlId) => setOdyssey(o => o.map(p => p.id === planId ? { ...p, timeline: p.timeline.filter(t => t.id !== tlId) } : p));
  const addInspo = (planId) => {
    if (!newInspo.trim()) return;
    setOdyssey(o => o.map(p => p.id === planId ? { ...p, inspirations: [...(p.inspirations || []), { id: Date.now(), text: newInspo.trim(), date: new Date().toLocaleDateString("zh-CN") }] } : p));
    setNewInspo("");
  };
  const delInspo = (planId, insId) => setOdyssey(o => o.map(p => p.id === planId ? { ...p, inspirations: (p.inspirations || []).filter(i => i.id !== insId) } : p));

  // Task helpers
  const addTask = () => setTasks(t => [...t, { id: Date.now(), text: "新任务", done: false, priority: "mid" }]);
  const toggleTask = id => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const delTask = id => setTasks(t => t.filter(x => x.id !== id));
  const updateTask = (id, f, v) => setTasks(t => t.map(x => x.id === id ? { ...x, [f]: v } : x));

  // AI
  const sendAI = async () => {
    if (!chatInput.trim() || aiLoading) return;
    const msg = chatInput.trim(); setChatInput("");
    const newChat = [...chat, { role: "user", content: msg }];
    setChat(newChat); setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: AI_SYSTEM, messages: newChat }),
      });
      const data = await res.json();
      setChat(c => [...c, { role: "assistant", content: data.content?.map(b => b.text || "").join("") || "出现错误，请重试。" }]);
    } catch { setChat(c => [...c, { role: "assistant", content: "网络错误，请重试。" }]); }
    setAiLoading(false);
  };

  // ── Style tokens ─────────────────────────────────────────────────────────────
  const C = { bg: "#090b10", surface: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)", accent: "#c8a96e", text: "#ddd6c6", muted: "rgba(221,214,198,0.38)" };
  const card = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "22px 24px" };

  const TABS = [
    { id: "home", icon: "⌂", label: "主页" },
    { id: "odyssey", icon: "◎", label: "奥德赛" },
    { id: "tasks", icon: "◻", label: "任务" },
    { id: "notes", icon: "✎", label: "灵感" },
    { id: "ai", icon: "✦", label: "AI顾问" },
  ];

  const quickQ = ["现在最该做什么一件事？", "我的SOP核心叙事怎么写？", "推荐适合我的博士项目", "三条人生线现在该押注哪条？"];

  const doneTasks = tasks.filter(t => t.done).length;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Cormorant Garamond','Noto Serif SC',Georgia,serif", display: "flex" }}>

      {/* ── Sidebar ── */}
      <div style={{ width: "180px", flexShrink: 0, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "0" }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: "8px", letterSpacing: "4px", color: C.accent, textTransform: "uppercase", marginBottom: "5px" }}>Planning</div>
          <div style={{ fontSize: "13px", lineHeight: 1.4 }}>
            <EditText value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} style={{ fontSize: "13px" }} />
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 0" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: "10px",
              width: "100%", border: "none",
              borderLeft: tab === t.id ? `2px solid ${C.accent}` : "2px solid transparent",
              background: tab === t.id ? "rgba(200,169,110,0.08)" : "none",
              color: tab === t.id ? C.accent : C.muted,
              padding: "10px 20px", cursor: "pointer", fontSize: "13px",
              fontFamily: "inherit", textAlign: "left", transition: "all 0.15s",
            }}>
              <span style={{ fontSize: "14px" }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>

        {/* Progress */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: "9px", letterSpacing: "2px", color: C.muted, textTransform: "uppercase", marginBottom: "8px" }}>任务进度</div>
          <div style={{ fontSize: "11px", color: C.muted, marginBottom: "4px" }}>{doneTasks} / {tasks.length} 完成</div>
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "3px", height: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", background: C.accent, width: `${tasks.length ? (doneTasks / tasks.length) * 100 : 0}%`, transition: "width 0.4s" }} />
          </div>
        </div>

        {/* Branding */}
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}`, background: "rgba(200,169,110,0.04)" }}>
          <div style={{ fontSize: "8px", letterSpacing: "2px", color: C.accent, textTransform: "uppercase", marginBottom: "6px" }}>Created by</div>
          <div style={{ fontSize: "12px", color: C.text, fontWeight: "600", marginBottom: "5px" }}>纳吉日达</div>
          <div style={{ fontSize: "9px", color: C.muted, marginBottom: "4px" }}>📕 小红书 @纳吉日达</div>
          <a href="mailto:yueyuecheng0702@163.com" style={{ fontSize: "9px", color: C.muted, textDecoration: "none", display: "block", wordBreak: "break-all", lineHeight: "1.5" }}>
            ✉ yueyuecheng0702@163.com
          </a>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>

        {/* ── HOME ── */}
        {tab === "home" && (
          <div>
            {/* Profile */}
            <div style={{ ...card, borderColor: "rgba(200,169,110,0.2)", marginBottom: "24px" }}>
              <div style={{ fontSize: "8px", letterSpacing: "4px", color: C.accent, textTransform: "uppercase", marginBottom: "8px" }}>我是谁</div>
              <h1 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: "400" }}>
                <EditText value={profile.subtitle} onChange={v => setProfile(p => ({ ...p, subtitle: v }))} style={{ fontSize: "24px" }} />
              </h1>
              <div style={{ fontSize: "13px", color: C.muted, marginBottom: "16px", lineHeight: "1.8", whiteSpace: "pre-line" }}>
                <EditText value={profile.bio} onChange={v => setProfile(p => ({ ...p, bio: v }))} multiline style={{ fontSize: "13px" }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {profile.tags.map((tag, i) => (
                  <span key={i} style={{ background: "rgba(200,169,110,0.1)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: "20px", padding: "3px 12px", fontSize: "11px", color: C.accent }}>
                    <EditText value={tag} onChange={v => setProfile(p => ({ ...p, tags: p.tags.map((t, j) => j === i ? v : t) }))} style={{ fontSize: "11px" }} />
                    <span onClick={() => setProfile(p => ({ ...p, tags: p.tags.filter((_, j) => j !== i) }))} style={{ cursor: "pointer", marginLeft: "5px", opacity: 0.4, fontSize: "9px" }}>✕</span>
                  </span>
                ))}
                <button onClick={() => setProfile(p => ({ ...p, tags: [...p.tags, "新标签"] }))} style={{ background: "none", border: "1px dashed rgba(255,255,255,0.12)", borderRadius: "20px", padding: "3px 12px", fontSize: "11px", color: C.muted, cursor: "pointer", fontFamily: "inherit" }}>+</button>
              </div>
            </div>

            {/* Three paths summary */}
            <div style={{ fontSize: "9px", letterSpacing: "3px", color: C.muted, textTransform: "uppercase", marginBottom: "14px" }}>三条奥德赛人生线</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
              {odyssey.map((p, i) => (
                <div key={p.id} onClick={() => { setActiveOdyssey(i); setTab("odyssey"); }} style={{
                  ...card, padding: "18px 20px", cursor: "pointer",
                  borderColor: p.color + "30", borderLeft: `3px solid ${p.color}`,
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = p.color + "10"}
                  onMouseLeave={e => e.currentTarget.style.background = C.surface}
                >
                  <div style={{ fontSize: "9px", letterSpacing: "2px", color: p.color, textTransform: "uppercase", marginBottom: "4px" }}>{p.code}</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px", color: C.text }}>{p.title}</div>
                  <div style={{ fontSize: "11px", color: C.muted, fontStyle: "italic" }}>"{p.tagline}"</div>
                  <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                    {["likeability", "coherence"].map(k => (
                      <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <GaugeMini value={p.dashboard[k]} color={p.color} />
                        <div style={{ fontSize: "8px", color: C.muted, marginTop: "16px", letterSpacing: "1px" }}>{k === "likeability" ? "喜好" : "连贯"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Urgent tasks */}
            <div style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: C.muted, textTransform: "uppercase" }}>近期紧急任务</div>
                <button onClick={() => setTab("tasks")} style={{ background: "none", border: "none", fontSize: "11px", color: C.muted, cursor: "pointer", fontFamily: "inherit" }}>查看全部 →</button>
              </div>
              {tasks.filter(t => !t.done && t.priority === "high").slice(0, 4).map(t => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ff6b6b", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", flex: 1 }}>{t.text}</span>
                  <span style={{ fontSize: "9px", color: "#ff6b6b", letterSpacing: "1px" }}>紧急</span>
                </div>
              ))}
              {tasks.filter(t => !t.done && t.priority === "high").length === 0 && <div style={{ fontSize: "13px", color: C.muted }}>暂无紧急任务 🎉</div>}
            </div>
          </div>
        )}

        {/* ── ODYSSEY ── */}
        {tab === "odyssey" && (
          <div>
            {/* Plan selector */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
              {odyssey.map((p, i) => (
                <button key={p.id} onClick={() => setActiveOdyssey(i)} style={{
                  flex: 1, background: activeOdyssey === i ? p.color + "15" : C.surface,
                  border: `1px solid ${activeOdyssey === i ? p.color + "50" : C.border}`,
                  borderRadius: "8px", padding: "14px", cursor: "pointer",
                  textAlign: "left", fontFamily: "inherit", transition: "all 0.2s",
                }}>
                  <div style={{ fontSize: "8px", letterSpacing: "3px", color: activeOdyssey === i ? p.color : C.muted, textTransform: "uppercase", marginBottom: "4px" }}>{p.code}</div>
                  <div style={{ fontSize: "13px", color: activeOdyssey === i ? p.color : "rgba(255,255,255,0.45)" }}>{p.title}</div>
                </button>
              ))}
            </div>

            {/* Hero */}
            <div style={{ ...card, borderColor: plan.color + "30", borderLeft: `3px solid ${plan.color}`, marginBottom: "20px" }}>
              <div style={{ fontSize: "8px", letterSpacing: "4px", color: plan.color, textTransform: "uppercase", marginBottom: "8px" }}>{plan.code} · 核心描述</div>
              <h2 style={{ margin: "0 0 6px", fontSize: "22px", fontWeight: "400", color: C.text }}>
                <EditText value={plan.title} onChange={v => updatePlan(plan.id, "title", v)} style={{ fontSize: "22px" }} />
              </h2>
              <div style={{ fontSize: "13px", color: plan.color, fontStyle: "italic", marginBottom: "12px" }}>
                "<EditText value={plan.tagline} onChange={v => updatePlan(plan.id, "tagline", v)} />"
              </div>
              <div style={{ fontSize: "13px", color: C.muted, lineHeight: "1.8" }}>
                <EditText value={plan.description} onChange={v => updatePlan(plan.id, "description", v)} multiline />
              </div>
            </div>

            {/* Dashboard */}
            <div style={{ ...card, marginBottom: "20px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", color: C.muted, textTransform: "uppercase", marginBottom: "20px" }}>四维评估</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {[["resources", "资源", "我有足够的资源去实现这条路吗？"], ["likeability", "喜好", "这条路让我感到兴奋吗？"], ["confidence", "信心", "我有多大把握能做到？"], ["coherence", "连贯", "这与我的价值观一致吗？"]].map(([k, label, desc]) => (
                  <div key={k}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div>
                        <span style={{ fontSize: "12px", color: C.text }}>{label}</span>
                        <div style={{ fontSize: "10px", color: C.muted, marginTop: "2px" }}>{desc}</div>
                      </div>
                      <span style={{ fontSize: "18px", fontWeight: "300", color: plan.color, minWidth: "32px", textAlign: "right" }}>{plan.dashboard[k]}</span>
                    </div>
                    <input
                      type="range" min="0" max="100" step="5"
                      value={plan.dashboard[k]}
                      onChange={e => updatePlan(plan.id, "dashboard", { ...plan.dashboard, [k]: Number(e.target.value) })}
                      style={{ width: "100%", accentColor: plan.color, cursor: "pointer" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div style={{ ...card, marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: C.muted, textTransform: "uppercase" }}>五年时间轴</div>
                <button onClick={() => addTimeline(plan.id)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: "5px", color: C.muted, cursor: "pointer", padding: "4px 10px", fontSize: "11px", fontFamily: "inherit" }}>+ 添加</button>
              </div>
              <div style={{ position: "relative", paddingLeft: "20px" }}>
                <div style={{ position: "absolute", left: "5px", top: "8px", bottom: "8px", width: "1px", background: `linear-gradient(to bottom, ${plan.color}, transparent)` }} />
                {plan.timeline.map((tl, i) => (
                  <div key={tl.id} style={{ display: "flex", gap: "16px", marginBottom: "14px", position: "relative" }}>
                    <div style={{ position: "absolute", left: "-17px", top: "5px", width: "10px", height: "10px", borderRadius: "50%", background: i === 0 ? plan.color : C.bg, border: `2px solid ${plan.color}`, opacity: i === 0 ? 1 : 0.5 }} />
                    <div style={{ ...card, flex: 1, padding: "12px 16px" }}>
                      <div style={{ fontSize: "9px", color: plan.color, letterSpacing: "2px", marginBottom: "4px" }}>
                        <EditText value={tl.time} onChange={v => updateTimeline(plan.id, tl.id, "time", v)} style={{ fontSize: "9px" }} />
                      </div>
                      <div style={{ fontSize: "13px" }}>
                        <EditText value={tl.event} onChange={v => updateTimeline(plan.id, tl.id, "event", v)} />
                      </div>
                    </div>
                    <button onClick={() => delTimeline(plan.id, tl.id)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "12px", alignSelf: "center" }}>✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pros & Cons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
              <div style={{ ...card, borderColor: "rgba(107,203,119,0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#6bcb77", textTransform: "uppercase" }}>优势</div>
                  <button onClick={() => updatePlan(plan.id, "pros", [...plan.pros, "新优势"])} style={{ background: "none", border: "1px solid rgba(107,203,119,0.3)", borderRadius: "4px", color: "#6bcb77", cursor: "pointer", padding: "2px 8px", fontSize: "11px", fontFamily: "inherit" }}>+</button>
                </div>
                {plan.pros.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "6px", fontSize: "12px", lineHeight: "1.6", alignItems: "flex-start" }}>
                    <span style={{ color: "#6bcb77", flexShrink: 0, marginTop: "2px" }}>+</span>
                    <EditText value={p} onChange={v => updatePlan(plan.id, "pros", plan.pros.map((x, j) => j === i ? v : x))} style={{ fontSize: "12px", flex: 1 }} />
                    <button onClick={() => updatePlan(plan.id, "pros", plan.pros.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "10px", flexShrink: 0, opacity: 0.5 }}>✕</button>
                  </div>
                ))}
              </div>
              <div style={{ ...card, borderColor: "rgba(255,107,107,0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#ff6b6b", textTransform: "uppercase" }}>风险</div>
                  <button onClick={() => updatePlan(plan.id, "cons", [...plan.cons, "新风险"])} style={{ background: "none", border: "1px solid rgba(255,107,107,0.3)", borderRadius: "4px", color: "#ff6b6b", cursor: "pointer", padding: "2px 8px", fontSize: "11px", fontFamily: "inherit" }}>+</button>
                </div>
                {plan.cons.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "6px", fontSize: "12px", lineHeight: "1.6", alignItems: "flex-start" }}>
                    <span style={{ color: "#ff6b6b", flexShrink: 0, marginTop: "2px" }}>−</span>
                    <EditText value={c} onChange={v => updatePlan(plan.id, "cons", plan.cons.map((x, j) => j === i ? v : x))} style={{ fontSize: "12px", flex: 1 }} />
                    <button onClick={() => updatePlan(plan.id, "cons", plan.cons.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "10px", flexShrink: 0, opacity: 0.5 }}>✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions */}
            <div style={{ ...card, marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: C.muted, textTransform: "uppercase" }}>这条路会回答的问题</div>
                <button onClick={() => updatePlan(plan.id, "questions", [...plan.questions, "新问题"])} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: "4px", color: C.muted, cursor: "pointer", padding: "2px 8px", fontSize: "11px", fontFamily: "inherit" }}>+</button>
              </div>
              {plan.questions.map((q, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: `1px solid ${C.border}`, alignItems: "flex-start" }}>
                  <span style={{ color: plan.color, flexShrink: 0, marginTop: "2px" }}>?</span>
                  <EditText value={q} onChange={v => updatePlan(plan.id, "questions", plan.questions.map((x, j) => j === i ? v : x))} style={{ fontSize: "13px", flex: 1 }} />
                  <button onClick={() => updatePlan(plan.id, "questions", plan.questions.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "11px", flexShrink: 0, opacity: 0.5 }}>✕</button>
                </div>
              ))}
            </div>

            {/* Inspirations */}
            <div style={card}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", color: plan.color, textTransform: "uppercase", marginBottom: "14px" }}>✦ 灵感 & 想法记录</div>
              {(plan.inspirations || []).map(ins => (
                <div key={ins.id} style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: `1px solid ${C.border}`, alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", lineHeight: "1.7", color: C.text }}>{ins.text}</div>
                    <div style={{ fontSize: "9px", color: C.muted, marginTop: "3px" }}>{ins.date}</div>
                  </div>
                  <button onClick={() => delInspo(plan.id, ins.id)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "11px", flexShrink: 0 }}>✕</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                <input
                  value={newInspo} onChange={e => setNewInspo(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addInspo(plan.id)}
                  placeholder="记录一个新想法… (Enter 添加)"
                  style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.text, padding: "10px 14px", fontSize: "13px", fontFamily: "inherit", outline: "none" }}
                  onFocus={e => e.target.style.borderColor = plan.color + "50"}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
                <button onClick={() => addInspo(plan.id)} style={{ background: plan.color + "15", border: `1px solid ${plan.color}40`, borderRadius: "6px", color: plan.color, padding: "0 16px", cursor: "pointer", fontSize: "14px" }}>+</button>
              </div>
            </div>
          </div>
        )}

        {/* ── TASKS ── */}
        {tab === "tasks" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ margin: 0, fontWeight: "400", fontSize: "20px" }}>任务清单</h2>
              <button onClick={addTask} style={{ background: "rgba(200,169,110,0.12)", border: "1px solid rgba(200,169,110,0.3)", color: C.accent, borderRadius: "6px", padding: "8px 18px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>+ 新任务</button>
            </div>
            <div style={card}>
              {tasks.map(t => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: `1px solid ${C.border}`, opacity: t.done ? 0.45 : 1 }}>
                  <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} style={{ accentColor: C.accent, width: "15px", height: "15px", cursor: "pointer", flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: "14px", textDecoration: t.done ? "line-through" : "none" }}>
                    <EditText value={t.text} onChange={v => updateTask(t.id, "text", v)} />
                  </div>
                  <select value={t.priority} onChange={e => updateTask(t.id, "priority", e.target.value)} style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${C.border}`, borderRadius: "4px", color: PRIO[t.priority]?.color, padding: "3px 8px", fontSize: "10px", cursor: "pointer", fontFamily: "inherit" }}>
                    <option value="high">紧急</option>
                    <option value="mid">重要</option>
                    <option value="low">普通</option>
                  </select>
                  <button onClick={() => delTask(t.id)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "13px" }}>✕</button>
                </div>
              ))}
              {tasks.length === 0 && <div style={{ color: C.muted, fontSize: "13px", textAlign: "center", padding: "24px 0" }}>暂无任务</div>}
            </div>
          </div>
        )}

        {/* ── NOTES / INSPIRATIONS ── */}
        {tab === "notes" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontWeight: "400", fontSize: "20px" }}>灵感 & 笔记</h2>
                <div style={{ fontSize: "11px", color: C.muted }}>随时记录想法，自动保存</div>
              </div>
              <div style={{ fontSize: "11px", color: C.muted, letterSpacing: "1px" }}>{notes.length} 字</div>
            </div>
            <div style={{ ...card, padding: 0 }}>
              <textarea
                value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="记录灵感、想法、观察……"
                style={{ width: "100%", minHeight: "520px", background: "transparent", border: "none", outline: "none", color: C.text, padding: "28px 30px", fontSize: "14px", lineHeight: "2", fontFamily: "'Cormorant Garamond','Noto Serif SC',Georgia,serif", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>
          </div>
        )}

        {/* ── AI ── */}
        {tab === "ai" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ margin: "0 0 4px", fontWeight: "400", fontSize: "20px" }}>✦ AI 顾问</h2>
              <div style={{ fontSize: "12px", color: C.muted }}>基于你的完整背景和三条奥德赛人生线，随时咨询</div>
            </div>

            {/* Quick */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
              {quickQ.map((q, i) => (
                <button key={i} onClick={() => setChatInput(q)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "20px", color: C.muted, padding: "6px 14px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,169,110,0.4)"; e.currentTarget.style.color = C.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
                >{q}</button>
              ))}
            </div>

            {/* Chat */}
            <div style={{ ...card, minHeight: "360px", maxHeight: "440px", overflowY: "auto", marginBottom: "14px" }}>
              {chat.length === 0 ? (
                <div style={{ textAlign: "center", color: C.muted, paddingTop: "80px" }}>
                  <div style={{ fontSize: "24px", color: C.accent, marginBottom: "10px" }}>✦</div>
                  <div style={{ fontSize: "13px" }}>我了解你的全部背景和三条人生线，随时开始</div>
                </div>
              ) : (
                chat.map((m, i) => (
                  <div key={i} style={{ marginBottom: "18px", display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: "10px", alignItems: "flex-start" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0, background: m.role === "user" ? "rgba(200,169,110,0.2)" : "rgba(107,203,119,0.15)", border: `1px solid ${m.role === "user" ? "rgba(200,169,110,0.3)" : "rgba(107,203,119,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: m.role === "user" ? C.accent : "#6bcb77" }}>
                      {m.role === "user" ? "我" : "AI"}
                    </div>
                    <div style={{ background: m.role === "user" ? "rgba(200,169,110,0.08)" : C.surface, border: `1px solid ${m.role === "user" ? "rgba(200,169,110,0.15)" : C.border}`, borderRadius: "10px", padding: "12px 16px", fontSize: "13px", lineHeight: "1.85", maxWidth: "82%", whiteSpace: "pre-wrap", color: C.text }}>
                      {m.content}
                    </div>
                  </div>
                ))
              )}
              {aiLoading && (
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(107,203,119,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "#6bcb77" }}>AI</div>
                  <div style={{ fontSize: "12px", color: C.muted }}>思考中…</div>
                </div>
              )}
              <div ref={chatRef} />
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: "8px" }}>
              <textarea
                value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAI(); } }}
                placeholder="输入问题… (Enter 发送，Shift+Enter 换行)"
                rows={2}
                style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px", color: C.text, padding: "12px 16px", fontSize: "13px", fontFamily: "inherit", resize: "none", outline: "none", transition: "border-color 0.15s" }}
                onFocus={e => e.target.style.borderColor = "rgba(200,169,110,0.4)"}
                onBlur={e => e.target.style.borderColor = C.border}
              />
              <button onClick={sendAI} disabled={aiLoading || !chatInput.trim()} style={{ background: "rgba(200,169,110,0.12)", border: "1px solid rgba(200,169,110,0.3)", color: C.accent, borderRadius: "8px", padding: "0 18px", cursor: aiLoading || !chatInput.trim() ? "not-allowed" : "pointer", fontSize: "18px", opacity: aiLoading || !chatInput.trim() ? 0.35 : 1 }}>↑</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
