/* eslint-disable @typescript-eslint/no-explicit-any*/
export async function fetchGptResponse(messages: any[]) {
  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) throw res;

  return res.json();
}

export async function fetchWebSearch(query: string) {
  const res = await fetch("/api/exa", {
    method: "POST",
    body: JSON.stringify({ query }),
  });

  if (!res.ok) throw res;

  const data = await res.json();

  return data;
}
