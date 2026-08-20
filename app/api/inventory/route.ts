import { NextResponse } from "next/server";
import { getInventory } from "@/lib/db";

export async function GET() {
  try {
    const inventory = await getInventory();
    return NextResponse.json(inventory);
  } catch (err) {
    console.error("Inventory error:", err);
    return NextResponse.json({});
  }
}
