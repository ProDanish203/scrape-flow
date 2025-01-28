"use server";

import { getAppUrl } from "@/lib/helper/appUrl";
import { stripe } from "@/lib/stripe/stripe";
import { getCreditsPack, PackId } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const PurchaseCredits = async (packId: PackId) => {
  let url = "/billing";
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized Access");

    const selectedPack = getCreditsPack(packId);
    if (!selectedPack) throw new Error("Invalid Pack selected");

    const priceId = selectedPack.priceId;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      invoice_creation: {
        enabled: true,
      },
      success_url: getAppUrl("billing"),
      cancel_url: getAppUrl("billing"),
      metadata: {
        packId,
        userId,
      },
      line_items: [
        {
          quantity: 1,
          price: priceId,
        },
      ],
    });

    if (session && session.url) url = session.url;
    else throw new Error("Failed to create session");
  } catch (err) {
    console.error(err);
  }

  redirect(url);
};
