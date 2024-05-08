import { OAuth2Client } from "google-auth-library";
import { config } from "../utils/config";
import logger from "../utils/logger";

const client = new OAuth2Client();

export async function verifyGoogleToken(token: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.googleClientId,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return null;
    }
    const email = payload.email;
    const name = payload.name || "Booklover";
    return {
      email,
      name,
    };
  } catch (error) {
    logger.silly("Error verifying google token", { error });
    return null;
  }
}
