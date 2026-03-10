import { useEffect, useState } from 'react';
import { getTasks } from '../api';
import { getSubjects } from '../api';
import dayjs from 'dayjs';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    getTasks().then(r => setTasks(r.data)).catch(() => { });
    getSubjects().then(r => setSubjects(r.data)).catch(() => { });
  }, []);

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;

  const upcoming = tasks
    .filter(t => t.dueDate && t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div>
      <div className="page-title">📊 Dashboard</div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--low)' }}>{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--warn)' }}>{inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--muted)' }}>{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent2)' }}>{subjects.length}</div>
          <div className="stat-label">Subjects</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Upcoming tasks */}
        <div className="card">
          <div className="section-header">
            <div className="section-title">⏰ Upcoming Deadlines</div>
          </div>
          {upcoming.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>No upcoming tasks 🎉</p>
          ) : (
            upcoming.map(task => (
              <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{task.title}</div>
                  {task.subject && (
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                      <span className="color-dot" style={{ background: task.subject.color, marginRight: 5 }} />
                      {task.subject.name}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--warn)', fontWeight: 600 }}>
                  {dayjs(task.dueDate).format('MMM D')}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Subject progress */}
        <div className="card">
          <div className="section-header">
            <div className="section-title">📚 Subject Progress</div>
          </div>
          {subjects.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>No subjects added yet</p>
          ) : (
            subjects.map(sub => {
              const pct = Math.min(100, Math.round((sub.studiedHours / sub.targetHours) * 100));
              return (
                <div key={sub._id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="color-dot" style={{ background: sub.color }} />
                      {sub.name}
                    </span>
                    <span style={{ color: 'var(--muted)', fontSize: 12 }}>{sub.studiedHours}h / {sub.targetHours}h</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: sub.color }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
