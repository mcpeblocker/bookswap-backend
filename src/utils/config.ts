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
  host: process.env["HOST"] || defaultConfig.host,
  databaseUri: process.env["DATABASE_URI"] || defaultConfig.databaseUri,
  s3Bucket: process.env["S3_BUCKET"] as string,
  s3Region: process.env["S3_REGION"] as string,
  s3AccessKey: process.env["S3_ACCESS_KEY"] as string,
  s3SecretKey: process.env["S3_SECRET_KEY"] as string,
};

const requiredConfig = ["s3Bucket", "s3Region", "s3AccessKey", "s3SecretKey"];
for (const key of requiredConfig) {
  if (!config[key as keyof typeof config]) {
    logger.error(`Missing required config: ${key}`);
    process.exit(1);
  }
}
