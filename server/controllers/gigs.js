import { PrismaClient } from "@prisma/client";
import { BadRequest, NotFound } from "../errors/index.js";
import { renameSync, existsSync, unlinkSync } from "fs";

export const createGig = async (req, res) => {
  const prisma = new PrismaClient();
  const fileNames = [];
  if (!req.files) {
    throw new BadRequest("Files not uploaded");
  }
  try {
    const fileKeys = Object.keys(req.files);
    fileKeys.forEach((file) => {
      let name = Date.now() + req.files[file].originalname;
      renameSync(req.files[file].path, "uploads/" + name);
      fileNames.push(name);
    });
  } catch (error) {
    return res.status(400).json({ errMsg: "File upload failed", err: error });
  }
  if (req.query) {
    const {
      title,
      description,
      shortDesc,
      price,
      revisions,
      time,
      features,
      category,
    } = req.query;
    const gig = await prisma.gigs.create({
      data: {
        title,
        description,
        shortDesc,
        deliveryTime: parseInt(time),
        price: parseInt(price),
        revisions: parseInt(revisions),
        features,
        category,
        createdBy: { connect: { id: req.userId } },
        images: fileNames,
      },
    });
    return res.status(201).json(gig);
  }
  throw new BadRequest("All fields are required");
};

export const getUserGigs = async (req, res) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    include: { gigs: true },
  });
  if (!user) {
    throw new NotFound("Gigs not found of user");
  }
  return res.status(200).json({ gigs: user?.gigs });
};

export const getGigsData = async (req, res) => {
  const prisma = new PrismaClient();
  if (!req.params.gigId) {
    throw new NotFound("No id provided");
  }
  const gigs = await prisma.gigs.findUnique({
    where: { id: parseInt(req.params.gigId) },
  });
  if (!gigs) {
    throw new NotFound("Gigs not found");
  }
  return res.status(200).json({ gigs });
};

export const getGigsDataUser = async (req, res) => {
  const prisma = new PrismaClient();
  if (!req.params.gigId) {
    throw new NotFound("No id provided");
  }
  const gigs = await prisma.gigs.findUnique({
    where: { id: parseInt(req.params.gigId) },
    include: {
      createdBy: true,
      reviews: { include: { reviewer: true } },
    },
  });
  const userWithGigs = await prisma.user.findUnique({
    where: { id: gigs.createdBy.id },
    include: {
      gigs: { include: { reviews: true } },
    },
  });
  const totalReviews = userWithGigs.gigs.reduce(
    (acc, gig) => acc + gig.reviews.length,
    0
  );
  const avgRating = (
    userWithGigs.gigs.reduce(
      (acc, gig) =>
        acc + gig.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    ) / totalReviews
  ).toFixed(1);

  if (!gigs) {
    throw new NotFound("Gigs not found");
  }
  return res.status(200).json({ gigs: { ...gigs, totalReviews, avgRating } });
};

export const updateGig = async (req, res) => {
  const prisma = new PrismaClient();
  const fileNames = [];
  if (!req.files) {
    throw new BadRequest("Files not uploaded");
  }
  try {
    const fileKeys = Object.keys(req.files);
    fileKeys.forEach((file) => {
      console.log(req.files[file].path);
      let name = Date.now() + req.files[file].originalname;
      renameSync(req.files[file].path, "uploads/" + name);
      fileNames.push(name);
    });

    if (req.query) {
      const {
        title,
        description,
        shortDesc,
        price,
        revisions,
        time,
        features,
        category,
      } = req.query;
      const oldGig = await prisma.gigs.findUnique({
        where: { id: parseInt(req.params.gigId) },
      });
      const gig = await prisma.gigs.update({
        where: { id: parseInt(req.params.gigId) },
        data: {
          title,
          description,
          shortDesc,
          deliveryTime: parseInt(time),
          price: parseInt(price),
          revisions: parseInt(revisions),
          features,
          category,
          createdBy: { connect: { id: req.userId } },
          images: fileNames,
        },
      });
      oldGig?.images.forEach((image) => {
        if (existsSync(`uploads/${image}`)) unlinkSync(`uploads/${image}`);
      });
      return res.status(200).json({ success: true, gig });
    }
    throw new BadRequest("All fields are required");
  } catch (error) {
    return res
      .status(400)
      .json({ errMsg: "File operation failed", err: error });
  }
};

export const searchGig = async (req, res) => {
  const { searchTerm, category } = req.query;
  const prisma = new PrismaClient();
  if (!searchTerm && !category) {
    throw new BadRequest("Provide search queries to get data");
  }
  const gigs = await prisma.gigs.findMany(searchQuery(searchTerm, category));
  if (!gigs) {
    throw new NotFound("Gigs not found");
  }
  return res.status(200).json({ gigs });
};

const searchQuery = (searchTerm, category) => {
  const query = {
    where: {
      OR: [],
    },
    include: {
      createdBy: true,
      reviews: {
        include: {
          reviewer: true,
        },
      },
    },
  };
  if (searchTerm) {
    query.where.OR.push({
      title: { contains: searchTerm, mode: "insensitive" },
    });
  }
  if (category) {
    query.where.OR.push({
      category: { contains: category, mode: "insensitive" },
    });
  }
  return query;
};

export const checkGigOrder = async (req, res) => {
  const prisma = new PrismaClient();
  const { gigId } = req.params;
  if (!req.userId && gigId) {
    throw new BadRequest("Id not provided");
  }
  const hasOrdered = await prisma.orders.findFirst({
    where: {
      buyerId: req.userId,
      gigId: parseInt(gigId),
      isCompleted: true,
    },
  });
  if (!hasOrdered) {
    throw new BadRequest("Gig not purchased");
  }
  return res.status(200).json({ hasOrdered: hasOrdered ? true : false });
};

export const AddReview = async (req, res) => {
  const prisma = new PrismaClient();
  const { gigId } = req.params;
  console.log(gigId);
  const { reviewText, rating } = req.body;
  if (!req.userId || !gigId) {
    throw new BadRequest("Id not provided");
  }
  if (!rating) {
    throw new BadRequest("Please give a rating");
  }
  const hasOrdered = await prisma.orders.findFirst({
    where: {
      buyerId: req.userId,
      gigId: parseInt(gigId),
      isCompleted: true,
    },
  });
  if (!hasOrdered) {
    throw new BadRequest("Gig not purchased");
  }
  const updateReview = await prisma.reviews.create({
    data: {
      rating,
      reviewText,
      reviewer: { connect: { id: req.userId } },
      gig: { connect: { id: parseInt(gigId) } },
    },
    include: {
      reviewer: true,
    },
  });
  if (!updateReview) {
    throw new BadRequest("Update failed for review");
  }
  return res.status(201).json({ newReview: updateReview });
};
