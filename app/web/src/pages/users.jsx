import { useEffect, useState } from "react";
import { api } from "../api/client";

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  role: "staff",
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    api("/users")
      .then(setUsers)
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMsg("");
    try {
      await api("/users", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm(emptyForm);
      setMsg("Utilisateur créé");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-4 text-left">
      <h2 className="text-2xl font-semibold text-slate-900">Utilisateurs</h2>
      <p className="text-sm text-slate-500">Réservé aux administrateurs</p>

      <form
        onSubmit={onSubmit}
        className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2"
      >
        <p className="text-sm font-medium text-slate-700 sm:col-span-2">
          Créer un utilisateur
        </p>
        <input
          name="fullName"
          required
          placeholder="Nom complet"
          value={form.fullName}
          onChange={onChange}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Mot de passe (min. 6)"
          value={form.password}
          onChange={onChange}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
        <select
          name="role"
          value={form.role}
          onChange={onChange}
          className="rounded-md border border-slate-300 px-3 py-2"
        >
          <option value="staff">staff</option>
          <option value="admin">admin</option>
        </select>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60 sm:col-span-2"
        >
          {saving ? "..." : "Créer l'utilisateur"}
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}
      {msg && <p className="text-emerald-700">{msg}</p>}

      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
        {users.map((u) => (
          <li
            key={u.id || u.email}
            className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-medium text-slate-900">{u.fullName}</p>
              <p className="text-slate-500">{u.email}</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`rounded px-2 py-0.5 font-medium ${
                  u.role === "admin"
                    ? "bg-teal-100 text-teal-800"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {u.role}
              </span>
              {u.createdAt && (
                <span className="text-slate-400">
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
