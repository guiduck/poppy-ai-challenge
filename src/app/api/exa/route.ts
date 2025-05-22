import { searchExa } from "@/lib/exa";

export async function POST(req: Request) {
  const { query } = await req.json();
  const results = await searchExa(query);
  return Response.json(results);
}
