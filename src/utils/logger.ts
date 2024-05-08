import { Logger } from "tslog";
import { appendFileSync, existsSync, writeFileSync } from "fs";
import { join } from "path";

const logger = new Logger({ name: "SERVER", type: "pretty" });

const logFilePath = join(__dirname, "../../logs", "silly.log");

logger.attachTransport((logObj) => {
  try {
    if (!existsSync(logFilePath)) {
      writeFileSync(logFilePath, "");
    }
    appendFileSync("logs/silly.log", JSON.stringify(logObj) + "\n");
  } catch (error) {}
});

export default logger;
