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

export function getUserByEmail(email: string) {
  return db.models.User.findOne({ email });
}
