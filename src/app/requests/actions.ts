export async function fetchRequests() {
  const res = await fetch("/api/requests");
  if (!res.ok) throw new Error("Error al cargar requests");
  return res.json();
}

export async function approveRequest(requestId: string, adminId: string) {
  await fetch("/api/requests/approve", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId, approverUserId: adminId }),
  });
}

export async function requestReturn(requestId: string) {
  await fetch("/api/requests/return", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId }),
  });
}

export async function confirmReturn(
  requestId: string,
  outcome: "returned_ok" | "returned_with_issue"
) {
  await fetch("/api/requests/confirm-return", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId, outcome }),
  });
}
