import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/dashboard/stats")
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!stats) return <p className="text-slate-500">Chargement...</p>;

  const cards = [
    { label: "Total événements", value: stats.totalEvents },
    { label: "Publiés", value: stats.publishedEvents },
    { label: "Inscriptions du jour", value: stats.registrationsToday },
  ];

  return (
    <section className="space-y-6 text-left">
      <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-1 text-3xl font-semibold text-teal-800">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-medium text-slate-900">Top 5</h3>
        <ol className="list-decimal space-y-2 pl-5">
          {stats.topEvents.map((e) => (
            <li key={e.id} className="text-slate-700">
              <span className="font-medium text-slate-900">{e.title}</span>
              {" — "}
              {e._count?.registrations ?? 0} inscriptions
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
