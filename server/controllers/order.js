import { PrismaClient } from "@prisma/client";
import { BadRequest, NotFound } from "../errors/index.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  const prisma = new PrismaClient();
  const { gigId } = req.body;
  if (!gigId) {
    throw new NotFound("gig not found");
  }
  const gig = await prisma.gigs.findUnique({
    where: { id: parseInt(gigId) },
  });
  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig?.price,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const order = await prisma.orders.create({
    data: {
      paymentIntent: paymentIntent.id,
      buyer: { connect: { id: req.userId } },
      gig: { connect: { id: parseInt(gigId) } },
      price: gig?.price,
    },
  });

  return res.status(201).json({ clientSecret: paymentIntent.client_secret });
};

export const confirmOrder = async (req, res) => {
  const prisma = new PrismaClient();
  const { paymentIntent } = req.body;
  if (!paymentIntent) {
    throw new NotFound("Payment info not found");
  }
  const success = await prisma.orders.update({
    where: { paymentIntent },
    data: { isCompleted: true },
  });
  if (!success) {
    throw new BadRequest("Payment confirmation failed");
  }
  return res.status(200).json({ success: true });
};

export const getBuyerOrders = async (req, res) => {
  const prisma = new PrismaClient();
  const orders = await prisma.orders.findMany({
    where: { buyerId: req.userId, isCompleted: true },
    include: { gig: true },
  });
  if (!orders) {
    throw new BadRequest("No orders found");
  }
  return res.status(200).json({ orders });
};
export const getSellerOrders = async (req, res) => {
  const prisma = new PrismaClient();
  const orders = await prisma.orders.findMany({
    where: { gig: { createdBy: { id: req.userId } }, isCompleted: true },
    include: { gig: true, buyer: true },
  });
  if (!orders) {
    throw new BadRequest("No orders found");
  }
  return res.status(200).json({ orders });
};
