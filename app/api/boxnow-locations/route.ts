import { NextRequest, NextResponse } from "next/server";

interface BNLocation {
  id: string;
  name: string;
  addressLine1: string;
  postalCode: string;
  note?: string;
  lat?: string;
  lng?: string;
}

function distance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocode(address: string, city: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const q = encodeURIComponent(`${address}, ${city}, Bulgaria`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=bg`,
      { headers: { "User-Agent": "royve-eyewear/1.0 orders@royve.eu" } }
    );
    const data = await res.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") || "";
  const address = req.nextUrl.searchParams.get("address") || "";

  try {
    const res = await fetch("https://locationapi-production.boxnow.bg/v1/apms_bg-BG.json", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    const all: BNLocation[] = data.data || data;

    // Filter by city name
    const cityLower = city.toLowerCase().trim();
    const inCity = cityLower
      ? all.filter(
          (l) =>
            l.addressLine1?.toLowerCase().includes(cityLower) ||
            l.name?.toLowerCase().includes(cityLower) ||
            l.postalCode?.includes(cityLower)
        )
      : all;

    if (inCity.length === 0) return NextResponse.json([]);

    // If we have address+city, geocode and sort by distance
    if (address && city) {
      const coords = await geocode(address, city);
      if (coords) {
        const withDist = inCity
          .filter((l) => l.lat && l.lng)
          .map((l) => ({
            ...l,
            dist: distance(coords.lat, coords.lng, parseFloat(l.lat!), parseFloat(l.lng!)),
          }))
          .sort((a, b) => a.dist - b.dist);

        return NextResponse.json(withDist.slice(0, 8));
      }
    }

    return NextResponse.json(inCity.slice(0, 8));
  } catch (err) {
    console.error("BoxNow locations error:", err);
    return NextResponse.json([]);
  }
}
