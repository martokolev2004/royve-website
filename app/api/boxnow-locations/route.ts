import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") || "";

  try {
    const res = await fetch("https://locationapi-production.boxnow.bg/v1/apms_bg-BG.json", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch BoxNow locations");

    const data = await res.json();
    const locations: Array<{ id: string; name: string; addressLine1: string; postalCode: string; note?: string }> = data.data || data;

    const cityLower = city.toLowerCase().trim();
    const filtered = cityLower
      ? locations.filter((l) =>
          l.addressLine1?.toLowerCase().includes(cityLower) ||
          l.name?.toLowerCase().includes(cityLower) ||
          l.postalCode?.includes(cityLower)
        )
      : locations.slice(0, 10);

    return NextResponse.json(filtered.slice(0, 8));
  } catch (err) {
    console.error("BoxNow locations error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
