import { S3Client } from "@aws-sdk/client-s3";
import { config } from "../utils/config";

const s3Client = new S3Client({
  region: config.s3Region,
  credentials: {
    accessKeyId: config.s3AccessKey,
    secretAccessKey: config.s3SecretKey,
  },
});

export default s3Client;
