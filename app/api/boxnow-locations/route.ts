import { NextRequest, NextResponse } from "next/server";

interface BNLocation {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  note?: string;
  lat?: string | number;
  lng?: string | number;
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

// Known city centers in Bulgaria for geocoding fallback
const CITY_CENTERS: Record<string, { lat: number; lng: number }> = {
  "софия": { lat: 42.6977, lng: 23.3219 },
  "пловдив": { lat: 42.1354, lng: 24.7453 },
  "варна": { lat: 43.2141, lng: 27.9147 },
  "бургас": { lat: 42.5048, lng: 27.4626 },
  "стара загора": { lat: 42.4258, lng: 25.6345 },
  "русе": { lat: 43.8356, lng: 25.9657 },
  "велико търново": { lat: 43.0757, lng: 25.6172 },
  "благоевград": { lat: 42.0121, lng: 23.0941 },
  "плевен": { lat: 43.4170, lng: 24.6066 },
  "перник": { lat: 42.6037, lng: 23.0340 },
};

function getCityCenter(city: string): { lat: number; lng: number } | null {
  const lower = city.toLowerCase().trim();
  for (const [key, coords] of Object.entries(CITY_CENTERS)) {
    if (lower.includes(key) || key.includes(lower)) return coords;
  }
  return null;
}

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") || "";

  try {
    const res = await fetch("https://locationapi-production.boxnow.bg/v1/apms_bg-BG.json", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    const all: BNLocation[] = data.data || data;

    const cityLower = city.toLowerCase().trim();
    const inCity = cityLower
      ? all.filter(
          (l) =>
            l.addressLine1?.toLowerCase().includes(cityLower) ||
            l.addressLine2?.toLowerCase().includes(cityLower) ||
            l.name?.toLowerCase().includes(cityLower) ||
            l.postalCode?.includes(cityLower)
        )
      : all.slice(0, 8);

    if (inCity.length === 0) {
      return NextResponse.json({ lockers: [], cityCenter: null });
    }

    const cityCenter = getCityCenter(city);

    // Sort by distance from city center if we have coordinates
    if (cityCenter) {
      const withCoords = inCity.filter((l) => l.lat && l.lng);
      const withoutCoords = inCity.filter((l) => !l.lat || !l.lng);

      const sorted = withCoords
        .map((l) => ({
          ...l,
          dist: distance(cityCenter.lat, cityCenter.lng, Number(l.lat), Number(l.lng)),
        }))
        .sort((a, b) => a.dist - b.dist);

      return NextResponse.json({
        lockers: [...sorted, ...withoutCoords].slice(0, 8),
        cityCenter,
      });
    }

    return NextResponse.json({ lockers: inCity.slice(0, 8), cityCenter: null });
  } catch (err) {
    console.error("BoxNow locations error:", err);
    return NextResponse.json({ lockers: [], cityCenter: null });
  }
}
