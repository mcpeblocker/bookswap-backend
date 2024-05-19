import express from "express";
import { getFromS3 } from "../services/s3.service";
import { responser } from "../utils/requests";
import { ErrorCode } from "../enums/ErrorCode.enum";

const router = express.Router();

router.get("/:filename", async (req, res) => {
  if (!req.params.filename) {
    return res.status(400).json(responser.error([ErrorCode.INVALID_ID]));
  }
  const stream = await getFromS3(req.params.filename);
  if (!stream) {
    return res.status(404).json(responser.error([ErrorCode.INVALID_ID]));
  }
  stream.pipeTo(
    new WritableStream({
      write(chunk) {
        res.write(chunk);
      },
      close() {
        res.end();
      },
    })
  );
});

export default router;
