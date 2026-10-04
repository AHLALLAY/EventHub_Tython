import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";

function toLocalInput(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [regs, setRegs] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [participantId, setParticipantId] = useState("");

  const load = () =>
    Promise.all([
      api(`/events/${id}`),
      api(`/registrations?eventId=${id}`),
      api("/participants"),
    ])
      .then(([ev, registrations, parts]) => {
        setEvent(ev);
        setRegs(registrations);
        setParticipants(parts);
        setForm({
          title: ev.title,
          description: ev.description || "",
          location: ev.location,
          eventDate: toLocalInput(ev.eventDate),
          maxParticipants: ev.maxParticipants,
        });
      })
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMsg("");
    try {
      const updated = await api(`/events/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          maxParticipants: Number(form.maxParticipants),
          eventDate: new Date(form.eventDate).toISOString(),
        }),
      });
      setEvent(updated);
      setEditing(false);
      setMsg("Événement modifié");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onStatus = async (status) => {
    setError("");
    setMsg("");
    try {
      const updated = await api(`/events/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setEvent(updated);
      setMsg(`Statut → ${status}`);
      if (status === "cancelled") load();
    } catch (err) {
      setError(err.message);
    }
  };

  const onRegStatus = async (regId, status) => {
    setError("");
    try {
      await api(`/registrations/${regId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      const registrations = await api(`/registrations?eventId=${id}`);
      setRegs(registrations);
    } catch (err) {
      setError(err.message);
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();
    if (!participantId) return;
    setError("");
    setMsg("");
    try {
      await api("/registrations", {
        method: "POST",
        body: JSON.stringify({ eventId: id, participantId }),
      });
      setParticipantId("");
      setMsg("Inscription ajoutée");
      const registrations = await api(`/registrations?eventId=${id}`);
      setRegs(registrations);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error && !event) return <p className="text-red-600">{error}</p>;
  if (!event || !form) return <p className="text-slate-500">Chargement...</p>;

  return (
    <section className="space-y-6 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/events"
          className="text-sm font-medium text-teal-700 hover:underline"
        >
          ← Retour
        </Link>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            {editing ? "Annuler modif." : "Modifier"}
          </button>
          {event.status === "draft" && (
            <button
              type="button"
              onClick={() => onStatus("published")}
              className="rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
            >
              Publier
            </button>
          )}
          {event.status !== "cancelled" && (
            <button
              type="button"
              onClick={() => onStatus("cancelled")}
              className="rounded-md bg-rose-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-800"
            >
              Annuler l'événement
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {msg && <p className="text-emerald-700">{msg}</p>}

      {!editing ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">{event.title}</h2>
          {event.description && (
            <p className="mt-2 text-slate-600">{event.description}</p>
          )}
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Lieu</dt>
              <dd className="font-medium text-slate-900">{event.location}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Date</dt>
              <dd className="font-medium text-slate-900">
                {new Date(event.eventDate).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Statut</dt>
              <dd className="font-medium text-slate-900">{event.status}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Max participants</dt>
              <dd className="font-medium text-slate-900">
                {event.maxParticipants}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <form
          onSubmit={onSave}
          className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2"
        >
          <input
            name="title"
            required
            value={form.title}
            onChange={onChange}
            className="rounded-md border border-slate-300 px-3 py-2 sm:col-span-2"
          />
          <input
            name="location"
            required
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
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            className="rounded-md border border-slate-300 px-3 py-2 sm:col-span-2"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60 sm:col-span-2"
          >
            {saving ? "..." : "Enregistrer les modifications"}
          </button>
        </form>
      )}

      {event.status === "published" && (
        <form
          onSubmit={onRegister}
          className="flex flex-wrap items-end gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <label className="grow text-sm">
            Inscrire un participant
            <select
              value={participantId}
              onChange={(e) => setParticipantId(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              required
            >
              <option value="">Choisir...</option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.email})
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
          >
            Inscrire
          </button>
        </form>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-lg font-medium text-slate-900">Inscriptions</h3>
        {regs.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune inscription</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {regs.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"
              >
                <span>
                  <span className="font-medium text-slate-900">
                    {r.participant?.fullName}
                  </span>{" "}
                  <span className="text-slate-500">
                    ({r.participant?.email})
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={r.status}
                    onChange={(e) => onRegStatus(r.id, e.target.value)}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
