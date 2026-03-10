import { useEffect, useState } from 'react';
import { getSessions, createSession, updateSession, deleteSession, getSubjects } from '../api';
import dayjs from 'dayjs';

const EMPTY = { title: '', subject: '', date: '', startTime: '09:00', endTime: '10:00', notes: '', completed: false };

export default function Schedule() {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [month, setMonth] = useState(dayjs().startOf('month'));
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState(null); // selected day

  const load = () => {
    getSessions().then(r => setSessions(r.data)).catch(() => { });
    getSubjects().then(r => setSubjects(r.data)).catch(() => { });
  };
  useEffect(() => { load(); }, []);

  // Build calendar days
  const startOfCal = month.startOf('week');
  const days = [];
  for (let i = 0; i < 42; i++) days.push(startOfCal.add(i, 'day'));

  const sessionsByDay = (date) =>
    sessions.filter(s => dayjs(s.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'));

  const openAdd = (date = null) => {
    setForm({ ...EMPTY, date: (date || dayjs()).format('YYYY-MM-DD') });
    setEditId(null);
    setModal(true);
  };

  const openEdit = (s) => {
    setForm({ ...s, subject: s.subject?._id || '', date: dayjs(s.date).format('YYYY-MM-DD') });
    setEditId(s._id);
    setModal(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.subject || !form.date) return;
    if (editId) await updateSession(editId, form);
    else await createSession(form);
    setModal(false);
    load();
  };

  const remove = async (id) => { await deleteSession(id); load(); };

  const toggle = async (s) => {
    await updateSession(s._id, { completed: !s.completed });
    load();
  };

  const selectedSessions = selected ? sessionsByDay(selected) : [];

  return (
    <div>
      <div className="section-header">
        <div className="page-title" style={{ marginBottom: 0 }}>📅 Schedule</div>
        <button className="btn btn-primary" onClick={() => openAdd()}>+ Add Session</button>
      </div>

      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setMonth(m => m.subtract(1, 'month'))}>‹</button>
        <span style={{ fontWeight: 600, fontSize: 16, minWidth: 140, textAlign: 'center' }}>
          {month.format('MMMM YYYY')}
        </span>
        <button className="btn btn-ghost btn-sm" onClick={() => setMonth(m => m.add(1, 'month'))}>›</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setMonth(dayjs().startOf('month'))}>Today</button>
      </div>

      {/* Calendar */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="cal-header">{d}</div>
          ))}
          {days.map((day, i) => {
            const daySessions = sessionsByDay(day);
            const isToday = day.isSame(dayjs(), 'day');
            const isSelected = selected && day.isSame(selected, 'day');
            const otherMonth = !day.isSame(month, 'month');
            return (
              <div
                key={i}
                className={`cal-day ${isToday ? 'today' : ''} ${otherMonth ? 'other-month' : ''}`}
                style={isSelected ? { borderColor: 'var(--accent2)', background: 'rgba(86,207,178,0.06)' } : {}}
                onClick={() => setSelected(isSelected ? null : day)}
              >
                <div className="cal-day-num">{day.format('D')}</div>
                {daySessions.slice(0, 3).map(s => (
                  <div
                    key={s._id}
                    className="cal-event"
                    style={{
                      background: s.subject?.color ? s.subject.color + '33' : 'rgba(124,106,247,0.2)',
                      color: s.subject?.color || 'var(--accent)',
                      textDecoration: s.completed ? 'line-through' : 'none'
                    }}
                  >
                    {s.startTime} {s.title}
                  </div>
                ))}
                {daySessions.length > 3 && (
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>+{daySessions.length - 3} more</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected day sessions */}
      {selected && (
        <div className="card">
          <div className="section-header">
            <div className="section-title">Sessions on {selected.format('MMMM D, YYYY')}</div>
            <button className="btn btn-primary btn-sm" onClick={() => openAdd(selected)}>+ Add</button>
          </div>
          {selectedSessions.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>No sessions on this day.</p>
          ) : (
            selectedSessions.map(s => (
              <div key={s._id} className="task-item" style={{ opacity: s.completed ? 0.5 : 1 }}>
                <div
                  style={{ width: 12, height: 12, borderRadius: '50%', background: s.subject?.color || 'var(--accent)', marginTop: 4, flexShrink: 0, cursor: 'pointer' }}
                  onClick={() => toggle(s)}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, textDecoration: s.completed ? 'line-through' : 'none' }}>{s.title}</div>
                  <div className="task-meta">
                    {s.subject && <span>{s.subject.name}</span>}
                    <span>🕐 {s.startTime} – {s.endTime}</span>
                    {s.notes && <span>{s.notes}</span>}
                  </div>
                </div>
                <div className="task-actions">
                  <button className="btn btn-sm btn-ghost" onClick={() => openEdit(s)}>✏️</button>
                  <button className="btn btn-sm btn-danger" onClick={() => remove(s._id)}>🗑</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editId ? 'Edit Session' : 'New Study Session'}</div>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label>Session Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Chapter 4 Review" />
            </div>
            <div className="form-group">
              <label>Subject *</label>
              <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                <option value="">Select a subject...</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Start Time</label>
                <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..." />
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
