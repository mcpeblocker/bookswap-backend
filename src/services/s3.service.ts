import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import s3Client from "../core/s3";
import { config } from "../utils/config";
import logger from "../utils/logger";

export async function uploadToS3(fileName: string, fileBuffer: Buffer) {
  // Code to upload to S3
  const fileKey = `${Date.now().toString()}-${fileName}`;
  const params = {
    Bucket: config.s3Bucket,
    Key: fileKey,
    Body: fileBuffer,
  };
  try {
    await s3Client.send(new PutObjectCommand(params));
    return fileKey;
  } catch (error: any) {
    logger.error(`Error uploading to S3: ${error.message}`, { error });
    return null;
  }
}
