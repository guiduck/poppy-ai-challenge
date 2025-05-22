/* eslint-disable @typescript-eslint/no-explicit-any*/
export async function fetchClaudeResponse(
  messages: any[],
  imageBase64: string | null
) {
  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages, imageBase64 }),
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

  return res.json();
}
