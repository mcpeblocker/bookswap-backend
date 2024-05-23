import mongoose from "mongoose";
import { db } from "../core/database";
import { IUser } from "../interfaces/User.interface";
import logger from "../utils/logger";

export async function boardUser(
  userId: string,
  email: string,
  data: Pick<IUser, "nickname" | "preferredGenres" | "avatar">
) {
  try {
    return db.models.User.findOneAndUpdate(
      {
        _id: userId,
        onboarding: true,
        email,
      },
      {
        $set: {
          ...data,
          onboarding: false,
        },
      }
    );
  } catch (error) {
    logger.silly("Error boarding user", { error });
    return null;
  }
}

export async function createBoardingUser(email: string) {
  try {
    const newUser = new db.models.User({
      email,
      onboarding: true,
    });
    return await newUser.save();
  } catch (error) {
    logger.silly("Error creating boarding user", { error });
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.models.User.findOne({ email });
    if (!user) return null;
    if (user.onboarding) return user;
    const avatar = await db.models.File.findById(user.avatar);
    if (!avatar) return null;
    return {
      ...user.toObject(),
      avatar: avatar.filename,
    };
  } catch (error) {
    logger.silly("Error getting user by email", { error });
    return null;
  }
}

export async function getUserById(userId: mongoose.Types.ObjectId) {
  try {
    const pipeline = [
      {
        $match: {
          _id: userId,
        },
      },
      {
        $lookup: {
          from: "files",
          localField: "avatar",
          foreignField: "_id",
          as: "avatar",
        },
      },
      {
        $unwind: {
          path: "$avatar",
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          nickname: 1,
          email: 1,
          preferredGenres: 1,
          avatar: "$avatar.filename",
        },
      },
    ];
    const results = await db.models.User.aggregate(pipeline);
    if (!results[0]) return null;
    return results[0];
  } catch (error) {
    logger.silly("Error getting user by id", { error });
    return null;
  }
}

export async function searchUsersByNickname(
  nickname: string,
  userId: mongoose.Types.ObjectId
) {
  try {
    return await db.models.User.aggregate([
      {
        $match: {
          nickname: {
            $regex: nickname,
            $options: "i",
          },
          _id: { $ne: userId },
        },
      },
      {
        $lookup: {
          from: "files",
          localField: "avatar",
          foreignField: "_id",
          as: "avatar",
        },
      },
      {
        $unwind: {
          path: "$avatar",
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          nickname: 1,
          avatar: "$avatar.filename",
        },
      },
    ]);
  } catch (error) {
    logger.silly("Error searching users by nickname", { error });
    return null;
  }
}

export function modifyUser(
  userId: mongoose.Types.ObjectId,
  data: Partial<Pick<IUser, "name" | "nickname" | "preferredGenres" | "avatar">>
) {
  try {
    return db.models.User.findOneAndUpdate(
      { _id: userId },
      { $set: data },
      { new: true }
    );
  } catch (error) {
    logger.silly("Error modifying user", { error });
    return null;
  }
}
