# Websocket API Group

## Overview

To support realtime messaging the [socket.io](https://socket.io/) is used in the backend.
Refer to official documentation to establish websocket connection with the backend:

- [Initialization](https://socket.io/docs/v4/client-initialization/)
- [Socket Instance](https://socket.io/docs/v4/client-socket-instance/)

## Events

### You can _listen to_ ...

Here are the list of events to listen from backend:

- [`notification`](notification-listen.md)
- [`message`](message-listen.md)

### You can _emit_ ...

Here are the list of events to emit from client:

- [`message`](message-emit.md)
