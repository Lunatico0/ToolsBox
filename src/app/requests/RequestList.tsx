"use client";

import { useEffect, useState } from "react";
import {
  fetchRequests,
  approveRequest,
  requestReturn,
  confirmReturn,
} from "./actions";

export function RequestList() {
  const [requests, setRequests] = useState<any[]>([]);

  async function load() {
    const data = await fetchRequests();
    setRequests(data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <div
          key={req._id}
          className="border rounded p-3 flex justify-between items-center"
        >
          <div>
            <div className="font-medium">{req.toolId}</div>
            <div className="text-sm text-gray-500">{req.status}</div>
          </div>

          <div className="space-x-2">
            {req.status === "pending_approval" && (
              <button
                className="btn"
                onClick={async () => {
                  await approveRequest(req._id, "ADMIN_ID");
                  load();
                }}
              >
                Aprobar
              </button>
            )}

            {req.status === "approved" && (
              <button
                className="btn"
                onClick={async () => {
                  await requestReturn(req._id);
                  load();
                }}
              >
                Avisar devolución
              </button>
            )}

            {req.status === "pending_return_confirmation" && (
              <>
                <button
                  className="btn"
                  onClick={async () => {
                    await confirmReturn(req._id, "returned_ok");
                    load();
                  }}
                >
                  OK
                </button>
                <button
                  className="btn"
                  onClick={async () => {
                    await confirmReturn(req._id, "returned_with_issue");
                    load();
                  }}
                >
                  Falla
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
