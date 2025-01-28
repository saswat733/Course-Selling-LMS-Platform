import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = Stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(
      `Error while verifying Stripe webhook signature: ${error.message}`
    );
    return new NextResponse("Webhook Error: " + error.message, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      console.error("Missing userId or courseId in webhook metadata");
      return new NextResponse("Webhook Error: Missing metadata", {
        status: 400,
      });
    }

    try {
      console.log("heloo bantaiiiiiiiiiiiii")
      await db.purchase.create({
        data: {
          courseId: courseId,
          userId: userId,
        },
      });
    } catch (error: any) {
      console.error(`Error creating purchase in database: ${error.message}`);
      return new NextResponse("Database Error: " + error.message, {
        status: 500,
      });
    }
  } else {
    console.warn(`Unhandled event type: ${event.type}`);
    return new NextResponse(
      `Webhook Error: Unhandled event type ${event.type}`,
      { status: 400 }
    );
  }

  return new NextResponse(null, { status: 200 });
}
