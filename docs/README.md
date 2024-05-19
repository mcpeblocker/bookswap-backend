# BookSwap API Documentation

The API is provided via HTTP requests.
It is designed to provide straightforward interface for the client instead of complicated set of routes.

## API Groups
### - [Auth](auth)
### - [Books](books)
### - [Users](users)
### - [Exchanges](exchanges)
### - [Notifications](notifications)
### - [Chats](chats)
### - [Websocket](websocket)
### - Files
You can get the any file uploaded to backend using the route `/files/:filename` where `:filename` is the property of the file you're looking for.

## Shared Constants
### - [Error Codes](error-codes.md)