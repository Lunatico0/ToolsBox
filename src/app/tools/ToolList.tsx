"use client";

import { useEffect, useState } from "react";
import { fetchTools } from "./actions";

export function ToolList() {
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    fetchTools().then(setTools);
  }, []);

  return (
    <div className="space-y-2">
      {tools.map((t) => (
        <div
          key={t._id}
          className="border rounded p-3 flex justify-between"
        >
          <div>
            <div className="font-medium">{t.name}</div>
            <div className="text-sm text-gray-500">
              {t.internalCode} · {t.location.shelf}-{t.location.column}-{t.location.row}
            </div>
          </div>

          <span className="text-sm">{t.status}</span>
        </div>
      ))}
    </div>
  );
}
