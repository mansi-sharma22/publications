import { useState, useMemo, useEffect } from "react";

const FIELDS = [
  "Machine Learning", "Applied AI", "Privacy & Security",
  "Theory", "NLP", "Computer Vision", "Graphs & Networks", "Medical AI",
];

const INITIAL = [
  { id: 1, title: "Robust Federated Learning Under Byzantine Attacks via Adaptive Gradient Clipping", authors: "Arjun Mehta, Priya Nair, Siddharth Rao, Kavya Krishnan", venue: "NeurIPS", year: "2024", field: "Machine Learning", abstract: "We propose AdaClip, a gradient clipping strategy that dynamically adjusts per-round to the empirical gradient distribution, achieving state-of-the-art robustness against Byzantine workers.", link: "#" },
  { id: 2, title: "Spectral Graph Transformers for Long-Range Dependency Modelling in Molecular Property Prediction", authors: "Kavya Krishnan, Rohit Joshi", venue: "ICML", year: "2024", field: "Graphs & Networks", abstract: "We introduce Spectral Graph Transformers (SGT), leveraging Laplacian eigenvectors as positional encodings within the transformer attention mechanism for molecular graphs.", link: "#" },
  { id: 3, title: "On the Generalization Bounds of Sparse Mixture-of-Experts Models", authors: "Siddharth Rao, Arjun Mehta", venue: "ICLR", year: "2024", field: "Theory", abstract: "We derive tight PAC-Bayes generalization bounds for sparse MoE models, providing theoretical grounding for architectural choices in large-scale language model training.", link: "#" },
  { id: 4, title: "CausalBench: A Benchmark Suite for Evaluating Causal Reasoning in Large Language Models", authors: "Nandini Varma, Priya Nair, Arjun Mehta", venue: "ACL", year: "2023", field: "NLP", abstract: "We introduce CausalBench, comprising 12 diverse tasks spanning counterfactual reasoning, intervention prediction, and causal graph discovery.", link: "#" },
  { id: 5, title: "Privacy-Preserving Graph Neural Networks via Differentially Private Message Passing", authors: "Rohit Joshi, Kavya Krishnan, Deepa Subramaniam", venue: "KDD", year: "2023", field: "Privacy & Security", abstract: "We formalize edge-level and node-level differential privacy guarantees for the message-passing framework and propose DP-GNN with rigorous privacy analysis.", link: "#" },
  { id: 6, title: "Diffusion Models for Inverse Problems in Medical Imaging", authors: "Deepa Subramaniam, Nandini Varma", venue: "MICCAI", year: "2023", field: "Medical AI", abstract: "We unify score-based diffusion models for MRI reconstruction, CT denoising, and PET attenuation correction, achieving competitive performance with 10× fewer labeled examples.", link: "#" },
  { id: 7, title: "Topology-Aware Sampling Strategies for Contrastive Learning on Hyperbolic Manifolds", authors: "Arjun Mehta, Siddharth Rao", venue: "AAAI", year: "2023", field: "Machine Learning", abstract: "Contrastive learning in Euclidean space ignores hierarchical structure. We propose Hyperbolic Contrastive Learning (HCL) with curvature-aware negative sampling.", link: "#" },
];

const EMPTY_FORM = { title: "", authors: "", venue: "", year: "", field: "", abstract: "", link: "" };

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=Source+Sans+3:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .root {
    display: flex;
    align-items: flex-start;
    width: 100%;
    min-height: 100vh;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 15px;
    color: #1c1c1c;
    background: #f8f7f4;
  }

  /* List column — scrolls with the page */
  .list-col {
    flex: 1;
    min-width: 0;
    padding: 52px 48px 80px;
    border-right: 1px solid #e0ddd8;
  }

  .form-col {
    width: 320px;
    flex-shrink: 0;
    padding: 52px 32px 80px;
  }

  .page-label { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #999; margin-bottom: 6px; }
  .page-title { font-family: 'Lora', serif; font-size: 26px; font-weight: 500; color: #111; margin-bottom: 4px; letter-spacing: -0.01em; }
  .page-sub { font-size: 13.5px; color: #999; margin-bottom: 28px; font-weight: 300; }

  .filter-bar { margin-bottom: 20px; }
  .filter-search {
    width: 100%; font-family: 'Source Sans 3', sans-serif; font-size: 13.5px;
    font-weight: 300; color: #1c1c1c; background: #fff; border: 1px solid #dddad5;
    border-radius: 2px; padding: 7px 11px; margin-bottom: 12px;
  }
  .filter-search:focus { outline: none; border-color: #aaa; }
  .filter-search::placeholder { color: #ccc; }

  .filter-row { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
  .filter-label { font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #aaa; margin-right: 2px; white-space: nowrap; padding: 5px 0; }
  .filter-chip {
    font-family: 'Source Sans 3', sans-serif; font-size: 12px; font-weight: 400;
    padding: 4px 11px; border-radius: 2px; border: 1px solid #dddad5;
    background: transparent; color: #666; cursor: pointer; white-space: nowrap;
  }
  .filter-chip:hover { border-color: #aaa; color: #222; }
  .filter-chip.active { background: #1c1c1c; border-color: #1c1c1c; color: #f8f7f4; }
  .filter-divider { width: 1px; height: 16px; background: #dddad5; margin: 0 2px; flex-shrink: 0; }

  .count-label { font-size: 12px; color: #bbb; margin-bottom: 16px; letter-spacing: 0.03em; }

  .pub-item { padding: 22px 0; border-bottom: 1px solid #e8e5e0; }
  .pub-item:first-of-type { border-top: 1px solid #e8e5e0; }

  .pub-top-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 5px; }
  .pub-title { font-family: 'Lora', serif; font-size: 15.5px; font-weight: 500; color: #111; line-height: 1.5; text-decoration: none; display: block; flex: 1; }
  .pub-title:hover { color: #555; }
  .pub-field-badge { font-size: 10.5px; font-weight: 400; letter-spacing: 0.05em; padding: 3px 9px; border-radius: 2px; border: 1px solid #dddad5; color: #888; white-space: nowrap; flex-shrink: 0; margin-top: 3px; background: #fff; font-family: 'Source Sans 3', sans-serif; }
  .pub-authors { font-family: 'Lora', serif; font-style: italic; font-size: 13px; color: #666; margin-bottom: 5px; }
  .pub-venue { font-size: 12.5px; color: #888; font-weight: 500; letter-spacing: 0.02em; margin-bottom: 8px; }
  .pub-abstract { font-size: 13.5px; color: #666; line-height: 1.65; font-weight: 300; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .pub-actions { display: flex; gap: 6px; align-items: center; }

  .btn { font-family: 'Source Sans 3', sans-serif; font-size: 12px; font-weight: 400; padding: 4px 12px; border-radius: 2px; cursor: pointer; border: 1px solid transparent; text-decoration: none; display: inline-block; line-height: 1.6; }
  .btn-primary { background: #1c1c1c; color: #f8f7f4; border-color: #1c1c1c; }
  .btn-primary:hover { background: #3a3a3a; border-color: #3a3a3a; }
  .btn-ghost { background: transparent; color: #666; border-color: #d5d2cd; }
  .btn-ghost:hover { border-color: #aaa; color: #222; }
  .btn-delete { background: transparent; border: none; color: #bbb; cursor: pointer; font-size: 12px; padding: 4px 6px; font-family: 'Source Sans 3', sans-serif; margin-left: 2px; }
  .btn-delete:hover { color: #b00; }

  .edit-box { background: #fff; border: 1px solid #e0ddd8; border-radius: 3px; padding: 16px 18px; margin-top: 10px; }
  .edit-box .field { margin-bottom: 10px; }
  .edit-actions { display: flex; gap: 6px; margin-top: 12px; }

  .form-heading { font-family: 'Lora', serif; font-size: 16px; font-weight: 500; color: #111; margin-bottom: 22px; padding-bottom: 14px; border-bottom: 1px solid #e0ddd8; }
  .field { margin-bottom: 14px; }
  .field label { display: block; font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #999; margin-bottom: 4px; }
  .field input, .field textarea, .field select {
    width: 100%; font-family: 'Source Sans 3', sans-serif; font-size: 13.5px; font-weight: 300;
    color: #1c1c1c; background: #fff; border: 1px solid #dddad5; border-radius: 2px;
    padding: 7px 10px; resize: none; line-height: 1.5; appearance: none;
  }
  .field input:focus, .field textarea:focus, .field select:focus { outline: none; border-color: #aaa; }
  .field input::placeholder, .field textarea::placeholder { color: #ccc; }
  .field select { cursor: pointer; }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

  .form-submit { width: 100%; margin-top: 6px; padding: 8px; font-size: 13px; font-weight: 500; letter-spacing: 0.05em; background: #1c1c1c; color: #f8f7f4; border: none; border-radius: 2px; cursor: pointer; font-family: 'Source Sans 3', sans-serif; }
  .form-submit:hover { background: #3a3a3a; }
  .form-clear { display: block; width: 100%; text-align: center; margin-top: 8px; font-size: 12px; color: #bbb; cursor: pointer; background: none; border: none; font-family: 'Source Sans 3', sans-serif; padding: 4px; }
  .form-clear:hover { color: #555; }

  .empty-state { color: #bbb; font-size: 14px; padding-top: 32px; font-weight: 300; }

  @media (max-width: 820px) {
    .root { flex-direction: column; }
    .list-col { border-right: none; border-bottom: 1px solid #e0ddd8; padding: 32px 24px; }
    .form-col { width: 100%; padding: 32px 24px; position: static; max-height: none; overflow-y: visible; }
  }
`;

export default function App() {
  const [pubs, setPubs] = useState(INITIAL);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [nextId, setNextId] = useState(100);
  const [activeField, setActiveField] = useState(null);
  const [activeYear, setActiveYear] = useState(null);
  const [search, setSearch] = useState("");

  const years = useMemo(() =>
    [...new Set(pubs.map(p => p.year).filter(Boolean))].sort((a, b) => b - a),
    [pubs]
  );

  const filtered = useMemo(() => pubs.filter(p => {
    if (activeField && p.field !== activeField) return false;
    if (activeYear && p.year !== activeYear) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        (p.field || "").toLowerCase().includes(q);
    }
    return true;
  }), [pubs, activeField, activeYear, search]);

  const handleAdd = () => {
    if (!form.title.trim()) return;
    setPubs([{ id: nextId, ...form }, ...pubs]);
    setNextId(n => n + 1);
    setForm(EMPTY_FORM);
  };

  const handleDelete = (id) => setPubs(pubs.filter(p => p.id !== id));
  const startEdit = (pub) => { setEditId(pub.id); setEditData({ ...pub }); };
  const cancelEdit = () => setEditId(null);
  const saveEdit = () => {
    setPubs(pubs.map(p => p.id === editId ? { ...editData } : p));
    setEditId(null);
  };

  const yearRange = years.length > 1 ? `${years[years.length - 1]}–${years[0]}` : years[0] || "";

  useEffect(() => {
    // Force the React mount point and all its ancestors to full width
    let el = document.currentScript?.parentElement || document.getElementById("root") || document.body.firstElementChild;
    while (el && el !== document.body) {
      el.style.display = "block";
      el.style.width = "100%";
      el.style.margin = "0";
      el.style.padding = "0";
      el = el.parentElement;
    }
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "#f8f7f4";
  }, []);

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", alignItems: "flex-start", width: "100%", minHeight: "100vh", background: "#f8f7f4", fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", color: "#1c1c1c" }}>

        {/* List — natural page scroll */}
        <div className="list-col">
          <p className="page-label">IIT · Laboratory for Intelligent Systems</p>
          <h1 className="page-title">Publications</h1>
          <p className="page-sub">Research output{yearRange ? ` · ${yearRange}` : ""}</p>

          <div className="filter-bar">
            <input className="filter-search" placeholder="Search by title, author, or field…" value={search} onChange={e => setSearch(e.target.value)} />
            <div className="filter-row">
              <span className="filter-label">Field</span>
              <button className={`filter-chip${!activeField ? " active" : ""}`} onClick={() => setActiveField(null)}>All</button>
              {FIELDS.map(f => (
                <button key={f} className={`filter-chip${activeField === f ? " active" : ""}`} onClick={() => setActiveField(activeField === f ? null : f)}>{f}</button>
              ))}
              {years.length > 0 && <div className="filter-divider" />}
              {years.map(y => (
                <button key={y} className={`filter-chip${activeYear === y ? " active" : ""}`} onClick={() => setActiveYear(activeYear === y ? null : y)}>{y}</button>
              ))}
            </div>
          </div>

          <p className="count-label">
            {filtered.length} of {pubs.length} publication{pubs.length !== 1 ? "s" : ""}
            {activeField ? ` · ${activeField}` : ""}{activeYear ? ` · ${activeYear}` : ""}
          </p>

          {filtered.length === 0 && <p className="empty-state">No publications match the current filter.</p>}

          {filtered.map(pub => (
            <div className="pub-item" key={pub.id}>
              {editId === pub.id ? (
                <div className="edit-box">
                  <div className="field"><label>Title</label><input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} /></div>
                  <div className="field"><label>Authors</label><input value={editData.authors} onChange={e => setEditData({ ...editData, authors: e.target.value })} /></div>
                  <div className="field-row">
                    <div className="field"><label>Venue</label><input value={editData.venue} onChange={e => setEditData({ ...editData, venue: e.target.value })} /></div>
                    <div className="field"><label>Year</label><input value={editData.year} onChange={e => setEditData({ ...editData, year: e.target.value })} /></div>
                  </div>
                  <div className="field"><label>Field</label>
                    <select value={editData.field} onChange={e => setEditData({ ...editData, field: e.target.value })}>
                      <option value="">— select —</option>
                      {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="field"><label>Abstract</label><textarea rows={3} value={editData.abstract} onChange={e => setEditData({ ...editData, abstract: e.target.value })} /></div>
                  <div className="field"><label>Link</label><input value={editData.link} onChange={e => setEditData({ ...editData, link: e.target.value })} /></div>
                  <div className="edit-actions">
                    <button className="btn btn-primary" onClick={saveEdit}>Save</button>
                    <button className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="pub-top-row">
                    <a className="pub-title" href={pub.link || "#"}>{pub.title}</a>
                    {pub.field && <span className="pub-field-badge">{pub.field}</span>}
                  </div>
                  <p className="pub-authors">{pub.authors}</p>
                  <p className="pub-venue">{pub.venue}{pub.year ? ` · ${pub.year}` : ""}</p>
                  <p className="pub-abstract">{pub.abstract}</p>
                  <div className="pub-actions">
                    <a className="btn btn-primary" href={pub.link || "#"} target="_blank" rel="noreferrer">View Paper</a>
                    <button className="btn btn-ghost" onClick={() => startEdit(pub)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(pub.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Form — sticky sidebar */}
        <div className="form-col">
          <h2 className="form-heading">Add Publication</h2>
          <div className="field"><label>Title</label><input placeholder="Full paper title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div className="field"><label>Authors</label><input placeholder="Author A, Author B, …" value={form.authors} onChange={e => setForm({ ...form, authors: e.target.value })} /></div>
          <div className="field-row">
            <div className="field"><label>Venue</label><input placeholder="NeurIPS" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} /></div>
            <div className="field"><label>Year</label><input placeholder="2024" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
          </div>
          <div className="field"><label>Field</label>
            <select value={form.field} onChange={e => setForm({ ...form, field: e.target.value })}>
              <option value="">— select field —</option>
              {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="field"><label>Abstract</label><textarea rows={4} placeholder="One or two sentence summary…" value={form.abstract} onChange={e => setForm({ ...form, abstract: e.target.value })} /></div>
          <div className="field"><label>Paper URL</label><input placeholder="https://arxiv.org/…" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} /></div>
          <button className="form-submit" onClick={handleAdd}>Add Publication</button>
          <button className="form-clear" onClick={() => setForm(EMPTY_FORM)}>Clear form</button>
        </div>

      </div>
    </>
  );
}