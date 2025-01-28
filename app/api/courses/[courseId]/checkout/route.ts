import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = await params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const purchase = await db.purchase.findFirst({
      where: {
        userId: user.id,
        courseId: courseId,
      },
    });

    if (purchase) {
      return new NextResponse("Already Purchased", { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100), // Convert to cents
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses![0].emailAddress,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/course/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/course/${course.id}?canceled=1`,
      metadata: {
        userId: user.id,
        courseId: course.id,
      },
    });

    console.log("session:",session.url)
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error(error);
    return new NextResponse("Something went wrong. Please try again.", {
      status: 500,
    });
  }
}
