export async function searchExa(query: string) {
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.EXA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      num_results: 3,
    }),
  });

  const data = await res.json();
  return data.results;
}
