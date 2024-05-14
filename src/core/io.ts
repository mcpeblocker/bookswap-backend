import { Server } from "socket.io";
import { config } from "../utils/config";
// import { instrument } from "@socket.io/admin-ui";

export const io = new Server(config.socketPort, {
  cors: {
    origin: "*",
  },
});

// instrument(io, {
//   auth: false,
//   mode: "development",
// });
