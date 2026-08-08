import { NextResponse } from "next/server";
import { db } from "@/db";
import { boosters } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allBoosters = await db
      .select()
      .from(boosters)
      .orderBy(desc(boosters.rating))
      .limit(20);
    return NextResponse.json(allBoosters);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
