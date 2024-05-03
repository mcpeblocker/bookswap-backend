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
    return await db.models.User.findOne({ email });
  } catch (error) {
    logger.silly("Error getting user by email", { error });
    return null;
  }
}

export async function searchUsersByNickname(nickname: string) {
  try {
    return await db.models.User.aggregate([
      {
        $match: {
          nickname: {
            $regex: nickname,
            $options: "i",
          },
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
  data: Partial<Pick<IUser, "nickname" | "preferredGenres" | "avatar">>
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
