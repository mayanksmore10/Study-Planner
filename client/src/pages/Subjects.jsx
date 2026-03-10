import { useEffect, useState } from 'react';
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../api';
import dayjs from 'dayjs';

const COLORS = ['#7c6af7', '#56cfb2', '#f06b6b', '#f0a86b', '#6bc8f0', '#d06bf0', '#f0e26b', '#6bf07a'];
const EMPTY = { name: '', color: '#7c6af7', targetHours: 10, studiedHours: 0, examDate: '' };

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);

  const load = () => getSubjects().then(r => setSubjects(r.data)).catch(() => { });
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (s) => {
    setForm({ ...s, examDate: s.examDate ? dayjs(s.examDate).format('YYYY-MM-DD') : '' });
    setEditId(s._id);
    setModal(true);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    if (editId) await updateSubject(editId, form);
    else await createSubject(form);
    setModal(false);
    load();
  };

  const remove = async (id) => { await deleteSubject(id); load(); };

  const addHours = async (s, delta) => {
    const next = Math.max(0, s.studiedHours + delta);
    await updateSubject(s._id, { studiedHours: next });
    load();
  };

  return (
    <div>
      <div className="section-header">
        <div className="page-title" style={{ marginBottom: 0 }}>📚 Subjects</div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Subject</button>
      </div>

      {subjects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
          No subjects yet. Add your first subject to start tracking!
        </div>
      ) : (
        <div className="subjects-grid">
          {subjects.map(sub => {
            const pct = Math.min(100, Math.round((sub.studiedHours / sub.targetHours) * 100));
            return (
              <div key={sub._id} className="subject-card">
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: sub.color, borderRadius: '12px 12px 0 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className="color-dot" style={{ background: sub.color, width: 14, height: 14 }} />
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{sub.name}</span>
                    </div>
                    {sub.examDate && (
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        📅 Exam: {dayjs(sub.examDate).format('MMM D, YYYY')}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => openEdit(sub)}>✏️</button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(sub._id)}>🗑</button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: 'var(--muted)' }}>Study Progress</span>
                  <span style={{ fontWeight: 600, color: sub.color }}>{pct}%</span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className="progress-fill" style={{ width: `${pct}%`, background: sub.color }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                    {sub.studiedHours}h / {sub.targetHours}h
                  </span>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => addHours(sub, -0.5)}>−</button>
                    <span style={{ fontSize: 12, color: 'var(--muted)', minWidth: 40, textAlign: 'center' }}>log hrs</span>
                    <button className="btn btn-sm btn-primary" onClick={() => addHours(sub, 0.5)}>+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editId ? 'Edit Subject' : 'New Subject'}</div>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label>Subject Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mathematics" />
            </div>

            <div className="form-group">
              <label>Color</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {COLORS.map(c => (
                  <div
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
                      border: form.color === c ? '3px solid #fff' : '3px solid transparent',
                      boxSizing: 'border-box'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Target Hours</label>
                <input type="number" min="1" value={form.targetHours} onChange={e => setForm({ ...form, targetHours: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Studied Hours</label>
                <input type="number" min="0" step="0.5" value={form.studiedHours} onChange={e => setForm({ ...form, studiedHours: Number(e.target.value) })} />
              </div>
            </div>

            <div className="form-group">
              <label>Exam Date</label>
              <input type="date" value={form.examDate} onChange={e => setForm({ ...form, examDate: e.target.value })} />
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{editId ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
