import { useEffect, useState } from "react";
import { api } from "../api/client";

const emptyForm = { fullName: "", email: "", phone: "" };

export default function Participants() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = (q = search) => {
    const query = q ? `?search=${encodeURIComponent(q)}` : "";
    api(`/participants${query}`)
      .then(setList)
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setForm({
      fullName: p.fullName,
      email: p.email,
      phone: p.phone || "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone || null,
      };
      if (editId) {
        await api(`/participants/${editId}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        await api("/participants", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
      cancelEdit();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-4 text-left">
      <h2 className="text-2xl font-semibold text-slate-900">Participants</h2>

      <div className="flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher nom ou email"
          className="grow rounded-md border border-slate-300 px-3 py-2"
        />
        <button
          type="button"
          onClick={() => load(search)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-100"
        >
          Rechercher
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3"
      >
        <p className="text-sm font-medium text-slate-700 sm:col-span-3">
          {editId ? "Modifier le participant" : "Ajouter un participant"}
        </p>
        <input
          name="fullName"
          required
          minLength={4}
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
          name="phone"
          placeholder="Téléphone (optionnel)"
          value={form.phone}
          onChange={onChange}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
        <div className="flex gap-2 sm:col-span-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
          >
            {saving ? "..." : editId ? "Mettre à jour" : "Créer"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {error && <p className="text-red-600">{error}</p>}

      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
        {list.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-medium text-slate-900">{p.fullName}</p>
              <p className="text-slate-500">
                {p.email}
                {p.phone ? ` · ${p.phone}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => startEdit(p)}
              className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-100"
            >
              Modifier
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
