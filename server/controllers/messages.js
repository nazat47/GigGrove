import { PrismaClient } from "@prisma/client";
import { BadRequest, NotFound } from "../errors/index.js";

export const addMessage = async (req, res) => {
  const prisma = new PrismaClient();
  const { text, recieverId } = req.body;
  const { orderId } = req.params;
  if (!text || !recieverId || !orderId) {
    throw new BadRequest("Message or reciever id or order id not received ");
  }
  const message = await prisma.message.create({
    data: {
      sender: { connect: { id: req.userId } },
      reciever: { connect: { id: parseInt(recieverId) } },
      text,
      order: { connect: { id: parseInt(orderId) } },
    },
  });

  return res.status(201).json(message);
};

export const getMessags = async (req, res) => {
  const prisma = new PrismaClient();
  const { orderId } = req.params;
  if (!orderId) {
    throw new NotFound("Order not found");
  }
  const message = await prisma.message.findMany({
    where: {
      order: {
        id: parseInt(orderId),
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  await prisma.message.updateMany({
    where: {
      orderId: parseInt(orderId),
      recieverId: req.userId,
    },
    data: {
      isRead: true,
    },
  });

  const order = await prisma.orders.findUnique({
    where: {
      id: parseInt(orderId),
    },
    include: {
      gig: true,
    },
  });
  let recieverId;
  if (order.buyerId === req.userId) {
    recieverId = order.gig.userId;
  } else if (order.gig.userId === req.userId) {
    recieverId = order.buyerId;
  }

  return res.status(201).json({ message, recieverId });
};

export const getUnreadMsgs = async (req, res) => {
  const prisma = new PrismaClient();
  const messages = await prisma.message.findMany({
    where: {
      recieverId: req.userId,
      isRead: false,
    },
    include: {
      sender: true,
    },
  });
  if (!messages) {
    throw new NotFound("Messages not found");
  }
  return res.status(200).json({ messages });
};
export const markAsRead = async (req, res) => {
  const prisma = new PrismaClient();
  if(!req.params.messageId){
    throw new BadRequest("Id not provided")
  }
  const messageRead = await prisma.message.update({
    where: {
      id: parseInt(req.params.messageId),
    },
    data: {
      isRead: true,
    },
  });
  if (!messageRead) {
    throw new NotFound("Failed to update msg");
  }
  return res.status(200).json({ success: true });
};
