import server from "../core/server";
import logger from "../utils/logger";
import authRouter from "./auth";
import usersRouter from './users';
import booksRouter from './books';

const routes = [
  {
    path: "/auth",
    router: authRouter,
  },
  {
    path: "/users",
    router: usersRouter
  },
  {
    path: "/books",
    router: booksRouter,
  }
];

export function initializeRoutes() {
  for (let route of routes) {
    server.use(route.path, route.router);
    logger.silly(`Route initialized: ${route.path}`);
  }
}
