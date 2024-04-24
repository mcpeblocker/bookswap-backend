import { db } from "../core/database";
import { IUser } from "../interfaces/User.interface";

export async function createUser(
  data: Pick<IUser, "nickname" | "email" | "preferredGenres" | "avatar">
) {
  const newUser = new db.models.User(data);
  return newUser.save();
}
