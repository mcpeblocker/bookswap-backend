import server from "../core/server";
import logger from "../utils/logger";
import authRouter from "./auth";

const routes = [
  {
    path: "/auth",
    router: authRouter,
  },
];

export function initializeRoutes() {
  for (let route of routes) {
    server.use(route.path, route.router);
    logger.silly(`Route initialized: ${route.path}`);
  }
}
