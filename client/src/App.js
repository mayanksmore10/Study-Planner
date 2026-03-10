import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Subjects from './pages/Subjects';
import Schedule from './pages/Schedule';

const NAV = [
  { to: '/', icon: '🏠', label: 'Dashboard' },
  { to: '/tasks', icon: '✅', label: 'Tasks' },
  { to: '/subjects', icon: '📚', label: 'Subjects' },
  { to: '/schedule', icon: '📅', label: 'Schedule' },
];

function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-logo">Study<span>Plan</span></div>
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </aside>
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/schedule" element={<Schedule />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;