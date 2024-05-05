import { configDotenv } from "dotenv";
import logger from "./logger";
configDotenv();

const defaultConfig = {
  port: 8080,
  host: "localhost",
  databaseUri: "mongodb://localhost:27017/bookswap-auto",
};

export const config = {
  port: Number(process.env["PORT"] || defaultConfig.port),
  socketPort: Number(process.env["SOCKET_PORT"] || 8081),
  host: process.env["HOST"] || defaultConfig.host,
  databaseUri: process.env["DATABASE_URI"] || defaultConfig.databaseUri,
  s3Bucket: process.env["S3_BUCKET"] as string,
  s3Region: process.env["S3_REGION"] as string,
  s3AccessKey: process.env["S3_ACCESS_KEY"] as string,
  s3SecretKey: process.env["S3_SECRET_KEY"] as string,
  googleClientId: process.env["GOOGLE_CLIENT_ID"] as string,
  googleClientSecret: process.env["GOOGLE_CLIENT_SECRET"] as string,
  jwtSecret: process.env["JWT_SECRET"] as string,
};

const requiredConfig = [
  "s3Bucket",
  "s3Region",
  "s3AccessKey",
  "s3SecretKey",
  "googleClientId",
  "googleClientSecret",
  "jwtSecret",
];
for (const key of requiredConfig) {
  if (!config[key as keyof typeof config]) {
    logger.error(`Missing required config: ${key}`);
    process.exit(1);
  }
}
