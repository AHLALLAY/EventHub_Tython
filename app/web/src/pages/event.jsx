import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

const statusClass = {
  draft: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
};

const emptyForm = {
  title: "",
  description: "",
  location: "",
  eventDate: "",
  maxParticipants: 20,
  status: "draft",
};

export default function Events() {
  const [status, setStatus] = useState("");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    const q = status ? `?status=${status}` : "";
    api(`/events${q}`)
      .then(setEvents)
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
  }, [status]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api("/events", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          maxParticipants: Number(form.maxParticipants),
          eventDate: new Date(form.eventDate).toISOString(),
        }),
      });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-4 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Événements</h2>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
          >
            <option value="">Tous</option>
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="cancelled">cancelled</option>
          </select>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800"
          >
            {showForm ? "Fermer" : "Créer"}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={onCreate}
          className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2"
        >
          <input
            name="title"
            required
            placeholder="Titre"
            value={form.title}
            onChange={onChange}
            className="rounded-md border border-slate-300 px-3 py-2 sm:col-span-2"
          />
          <input
            name="location"
            required
            placeholder="Lieu"
            value={form.location}
            onChange={onChange}
            className="rounded-md border border-slate-300 px-3 py-2"
          />
          <input
            name="eventDate"
            type="datetime-local"
            required
            value={form.eventDate}
            onChange={onChange}
            className="rounded-md border border-slate-300 px-3 py-2"
          />
          <input
            name="maxParticipants"
            type="number"
            min="1"
            required
            value={form.maxParticipants}
            onChange={onChange}
            className="rounded-md border border-slate-300 px-3 py-2"
          />
          <select
            name="status"
            value={form.status}
            onChange={onChange}
            className="rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={onChange}
            className="rounded-md border border-slate-300 px-3 py-2 sm:col-span-2"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60 sm:col-span-2"
          >
            {saving ? "..." : "Enregistrer l'événement"}
          </button>
        </form>
      )}

      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-2">
        {events.map((e) => (
          <li key={e.id}>
            <Link
              to={`/events/${e.id}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-teal-600"
            >
              <span className="font-medium text-slate-900">{e.title}</span>
              <span className="flex items-center gap-2 text-sm text-slate-500">
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${statusClass[e.status] || "bg-slate-100"}`}
                >
                  {e.status}
                </span>
                {new Date(e.eventDate).toLocaleString()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
