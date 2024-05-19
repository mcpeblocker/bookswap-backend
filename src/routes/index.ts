import server from "../core/server";
import logger from "../utils/logger";
import authRouter from "./auth";
import usersRouter from "./users";
import booksRouter from "./books";
import exchangesRouter from "./exchanges";
import notificationsRouter from "./notifications";
import chatsRouter from "./chats";
import files from "./files";

const routes = [
  {
    path: "/auth",
    router: authRouter,
  },
  {
    path: "/users",
    router: usersRouter,
  },
  {
    path: "/books",
    router: booksRouter,
  },
  {
    path: "/exchanges",
    router: exchangesRouter,
  },
  {
    path: "/notifications",
    router: notificationsRouter,
  },
  {
    path: "/chats",
    router: chatsRouter,
  },
  {
    path: "/files",
    router: files,
  },
];

export function initializeRoutes() {
  for (let route of routes) {
    server.use(route.path, route.router);
    logger.silly(`Route initialized: ${route.path}`);
  }
}
