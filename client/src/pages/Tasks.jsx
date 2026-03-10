import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask, getSubjects } from '../api';
import dayjs from 'dayjs';

const EMPTY = { title: '', description: '', subject: '', dueDate: '', priority: 'medium', status: 'pending', estimatedHours: 1 };

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = () => {
    getTasks().then(r => setTasks(r.data)).catch(() => { });
    getSubjects().then(r => setSubjects(r.data)).catch(() => { });
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (t) => {
    setForm({ ...t, subject: t.subject?._id || '', dueDate: t.dueDate ? dayjs(t.dueDate).format('YYYY-MM-DD') : '' });
    setEditId(t._id);
    setModal(true);
  };

  const save = async () => {
    if (!form.title.trim()) return;
    const payload = { ...form, subject: form.subject || null };
    if (editId) await updateTask(editId, payload);
    else await createTask(payload);
    setModal(false);
    load();
  };

  const toggle = async (t) => {
    const next = t.status === 'completed' ? 'pending' : 'completed';
    await updateTask(t._id, { status: next });
    load();
  };

  const remove = async (id) => { await deleteTask(id); load(); };

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div>
      <div className="section-header">
        <div className="page-title" style={{ marginBottom: 0 }}>✅ Tasks</div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Task</button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'pending', 'in-progress', 'completed'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
          No tasks found. Click "+ Add Task" to get started!
        </div>
      ) : (
        filtered.map(task => (
          <div key={task._id} className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
            <div className={`task-check ${task.status === 'completed' ? 'checked' : ''}`} onClick={() => toggle(task)}>
              {task.status === 'completed' && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div className={`task-title ${task.status === 'completed' ? 'done' : ''}`}>{task.title}</div>
              <div className="task-meta">
                <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                <span className={`badge badge-${task.status}`}>{task.status}</span>
                {task.subject && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="color-dot" style={{ background: task.subject.color }} />
                    {task.subject.name}
                  </span>
                )}
                {task.dueDate && <span>📅 {dayjs(task.dueDate).format('MMM D, YYYY')}</span>}
                {task.estimatedHours && <span>⏱ {task.estimatedHours}h</span>}
              </div>
              {task.description && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>{task.description}</div>}
            </div>
            <div className="task-actions">
              <button className="btn btn-sm btn-ghost" onClick={() => openEdit(task)}>✏️</button>
              <button className="btn btn-sm btn-danger" onClick={() => remove(task._id)}>🗑</button>
            </div>
          </div>
        ))
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editId ? 'Edit Task' : 'New Task'}</div>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label>Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Task title..." />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Subject</label>
                <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                  <option value="">None</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Estimated Hours</label>
                <input type="number" min="0.5" step="0.5" value={form.estimatedHours} onChange={e => setForm({ ...form, estimatedHours: e.target.value })} />
              </div>
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
