"use client";

import type { FilterField } from "@/lib/filterCatalog";

export default function CatalogFieldsInput({
  fields,
  values,
  onChange,
}: {
  fields: FilterField[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
}) {
  const inputCls =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-gold/60 transition-colors";

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {fields.map((f) => {
        const value = values[f.id] ?? "";
        switch (f.type) {
          case "select":
            return (
              <div key={f.id}>
                <label className="text-sm text-slate-400 mb-1 block">
                  {f.label}
                </label>
                <select
                  value={value}
                  onChange={(e) => onChange(f.id, e.target.value)}
                  className={inputCls}
                >
                  <option value="" className="bg-charcoal">
                    Select {f.label}
                  </option>
                  {f.options?.map((o) => (
                    <option key={o} value={o} className="bg-charcoal">
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            );
          case "multi":
            return (
              <div key={f.id} className="sm:col-span-2">
                <label className="text-sm text-slate-400 mb-2 block">
                  {f.label}
                </label>
                <div className="flex flex-wrap gap-2">
                  {f.options?.map((o) => {
                    const selected = value.split(",").includes(o);
                    return (
                      <button
                        key={o}
                        type="button"
                        onClick={() => {
                          const cur = value ? value.split(",") : [];
                          const next = selected
                            ? cur.filter((x) => x !== o)
                            : [...cur, o];
                          onChange(f.id, next.join(","));
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selected
                            ? "bg-gold/20 border border-gold/50 text-white"
                            : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          case "number":
          case "text":
          case "range":
            return (
              <div key={f.id}>
                <label className="text-sm text-slate-400 mb-1 block">
                  {f.label}
                </label>
                <input
                  type={f.type === "number" ? "number" : "text"}
                  value={value}
                  onChange={(e) => onChange(f.id, e.target.value)}
                  placeholder={f.placeholder}
                  className={inputCls}
                />
              </div>
            );
          case "toggle":
            return (
              <div
                key={f.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <span className="text-sm text-slate-300">{f.label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={value === "Yes"}
                  onClick={() => onChange(f.id, value === "Yes" ? "No" : "Yes")}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                    value === "Yes" ? "bg-gold" : "bg-white/15"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                      value === "Yes" ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
