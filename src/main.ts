import express from "express";
import { connectDatabase } from "./core/database";
import server from "./core/server";
import { initializeRoutes } from "./routes";
import { config } from "./utils/config";
import logger from "./utils/logger";

connectDatabase();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

initializeRoutes();

server.listen(config.port, config.host, () => {
  logger.info(`Server is running on http://${config.host}:${config.port}`);
});
