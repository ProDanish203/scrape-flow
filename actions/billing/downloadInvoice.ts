"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import { auth } from "@clerk/nextjs/server";

export const DownloadInvoice = async (id: string) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized Access");

    const purchase = await prisma.userPurchase.findUnique({
      where: {
        userId,
        id,
      },
    });

    if (!purchase) throw new Error("Purchase not found");

    const session = await stripe.checkout.sessions.retrieve(purchase.stripeId);

    if (!session || !session.invoice) throw new Error("Invoice not found");

    const invoice = await stripe.invoices.retrieve(session.invoice as string);

    return invoice.hosted_invoice_url;
  } catch (err) {
    console.error(err);
  }
};
