// pages/api/create-checkout-session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { pinId, userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_123abc", // ⛔ replace with real Stripe Price ID from dashboard
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        pinId,
        userId,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/private/check-pins?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pin/${pinId}`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Stripe session failed" });
  }
}
