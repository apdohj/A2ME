import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(20);
    return NextResponse.json(allOrders);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { game, currentRank, desiredRank, price, eta, extras } = body;

    const [newOrder] = await db
      .insert(orders)
      .values({
        game,
        currentRank,
        desiredRank,
        price,
        eta,
        extras,
        status: "pending",
        progress: 0,
      })
      .returning();

    return NextResponse.json(newOrder, { status: 201 });
  } catch (e) {
    console.error("Order creation error:", e);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
