import { getStats } from "@/app/lib/usage-tracker";

export async function GET(request: Request) {
  // Simple auth via secret token
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const secret = process.env.STATS_SECRET;

  if (secret && token !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = getStats();
  return Response.json(stats);
}
