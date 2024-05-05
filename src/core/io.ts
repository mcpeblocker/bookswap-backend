import { Server } from "socket.io";
import { config } from "../utils/config";
// import { instrument } from "@socket.io/admin-ui";

export const io = new Server(config.socketPort);

// instrument(io, {
//   auth: false,
//   mode: "development",
// });
