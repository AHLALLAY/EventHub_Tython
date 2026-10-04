import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium ${
    isActive
      ? "bg-teal-700 text-white"
      : "text-slate-700 hover:bg-slate-100"
  }`;

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-svh bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            EventHub
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/events" className={linkClass}>
              Événements
            </NavLink>
            <NavLink to="/participants" className={linkClass}>
              Participants
            </NavLink>
            {user?.role === "admin" && (
              <NavLink to="/users" className={linkClass}>
                Users
              </NavLink>
            )}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="text-slate-600">
              {user?.fullName}{" "}
              <span className="text-slate-400">({user?.role})</span>
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
