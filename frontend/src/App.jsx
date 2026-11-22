import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '/api/students';
const EMPTY_FORM = { nim: '', name: '', major: '', semester: '4', gpa: '3.50' };

export default function App() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, averageGpa: 0, byMajor: [] });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [majorFilter, setMajorFilter] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState({ text: '', error: false });

  async function loadStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (res.ok) setStats(await res.json());
  }

  async function loadStudents(major = majorFilter, q = search) {
    const params = new URLSearchParams();
    if (major) params.set('major', major);
    if (q.trim()) params.set('search', q.trim());
    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}${qs}`);
    if (res.ok) {
      const body = await res.json();
      setStudents(body.data);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadStudents(majorFilter, search);
  }, [majorFilter, search]);

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      nim: form.nim.trim(),
      name: form.name.trim(),
      major: form.major.trim(),
      semester: Number(form.semester),
      gpa: Number(form.gpa),
    };
    const res = await fetch(editId ? `${API_BASE}/${editId}` : API_BASE, {
      method: editId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setStatus({ text: err.message || 'Gagal menyimpan data', error: true });
      return;
    }
    setStatus({
      text: editId ? 'Data berhasil diperbarui' : 'Data berhasil ditambahkan',
      error: false,
    });
    setForm(EMPTY_FORM);
    setEditId(null);
    await Promise.all([loadStats(), loadStudents(majorFilter, search)]);
  }

  function handleEdit(s) {
    setEditId(s.id);
    setForm({
      nim: s.nim,
      name: s.name,
      major: s.major,
      semester: String(s.semester),
      gpa: String(s.gpa),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setStatus({ text: 'Gagal menghapus data', error: true });
      return;
    }
    setStatus({ text: 'Data berhasil dihapus', error: false });
    await Promise.all([loadStats(), loadStudents(majorFilter, search)]);
  }

  function handleCancel() {
    setEditId(null);
    setForm(EMPTY_FORM);
  }

  return (
    <div className="container">
      <header>
        <div>
          <h1>Student Manager</h1>
          <p className="subtitle">Vite React + NestJS REST API + PostgreSQL + Prisma ORM</p>
        </div>
        <span className="badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
            <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
          </svg>
          PostgreSQL Connected
        </span>
      </header>

      <section className="stats-grid" aria-label="Statistik Mahasiswa">
        <div className="card">
          <div className="stat-label">Total Mahasiswa</div>
          <div className="stat-value" id="stat-total">{stats.totalStudents}</div>
        </div>
        <div className="card">
          <div className="stat-label">Rata-rata IPK</div>
          <div className="stat-value" id="stat-gpa">{Number(stats.averageGpa).toFixed(2)}</div>
        </div>
        <div className="card">
          <div className="stat-label">Jumlah Jurusan</div>
          <div className="stat-value" id="stat-majors">{stats.byMajor.length}</div>
        </div>
      </section>

      <main className="layout">
        <section className="card">
          <h2 className="section-title">{editId ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="nim">NIM</label>
              <input
                id="nim"
                required
                placeholder="2301001"
                value={form.nim}
                onChange={(e) => setForm({ ...form, nim: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="name">Nama Lengkap</label>
              <input
                id="name"
                required
                placeholder="Budi Santoso"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="major">Jurusan</label>
              <input
                id="major"
                required
                placeholder="Teknik Informatika"
                value={form.major}
                onChange={(e) => setForm({ ...form, major: e.target.value })}
              />
            </div>
            <div className="row-2">
              <div className="field">
                <label htmlFor="semester">Semester</label>
                <input
                  id="semester"
                  type="number"
                  min="1"
                  max="14"
                  required
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="gpa">IPK</label>
                <input
                  id="gpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  required
                  value={form.gpa}
                  onChange={(e) => setForm({ ...form, gpa: e.target.value })}
                />
              </div>
            </div>
            <div className="actions">
              <button type="submit" className="btn-primary" id="submit-btn">
                {editId ? 'Perbarui' : 'Simpan'}
              </button>
              {editId && (
                <button type="button" className="btn-secondary" onClick={handleCancel}>
                  Batal
                </button>
              )}
            </div>
            <div id="status-msg" className={`status-msg${status.error ? ' error' : ''}`} role="status">
              {status.text}
            </div>
          </form>
        </section>

        <section className="card">
          <h2 className="section-title">Daftar Mahasiswa</h2>
          <div className="filters">
            <input
              id="search-input"
              placeholder="Cari NIM atau nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              id="major-filter"
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
            >
              <option value="">Semua Jurusan</option>
              {stats.byMajor.map((m) => (
                <option key={m.major} value={m.major}>
                  {m.major} ({m.count})
                </option>
              ))}
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>NIM</th>
                  <th>Nama</th>
                  <th>Jurusan</th>
                  <th>Smt</th>
                  <th>IPK</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody id="table-body">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">Belum ada data mahasiswa.</td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id}>
                      <td>{s.nim}</td>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.major}</td>
                      <td>{s.semester}</td>
                      <td>{Number(s.gpa).toFixed(2)}</td>
                      <td>
                        <div className="row-actions">
                          <button type="button" className="btn-secondary btn-sm" onClick={() => handleEdit(s)}>
                            Edit
                          </button>
                          <button type="button" className="btn-danger btn-sm del-btn" onClick={() => handleDelete(s.id)}>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mobile-cards">
            {students.length === 0 ? (
              <p className="empty-state">Belum ada data mahasiswa.</p>
            ) : (
              students.map((s) => (
                <div className="student-card" key={s.id}>
                  <div className="student-card-head">
                    <strong>{s.name}</strong>
                    <span>{s.nim}</span>
                  </div>
                  <div className="student-meta">
                    {s.major} | Semester {s.semester} | IPK {Number(s.gpa).toFixed(2)}
                  </div>
                  <div className="row-actions">
                    <button type="button" className="btn-secondary btn-sm flex-1" onClick={() => handleEdit(s)}>
                      Edit
                    </button>
                    <button type="button" className="btn-danger btn-sm flex-1" onClick={() => handleDelete(s.id)}>
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
