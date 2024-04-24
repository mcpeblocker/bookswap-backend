import { db } from "../core/database";
import { IUser } from "../interfaces/User.interface";

export function boardUser(
  userId: string,
  email: string,
  data: Pick<IUser, "nickname" | "preferredGenres" | "avatar">
) {
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
}

export async function createBoardingUser(email: string) {
  const newUser = new db.models.User({
    email,
    onboarding: true,
  });
  return await newUser.save();
}

export function getUserByEmail(email: string) {
  return db.models.User.findOne({ email });
}
