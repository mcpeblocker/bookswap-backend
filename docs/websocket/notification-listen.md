# Notification event
## Can be listened to

Received each time a new notification is created in the system for the user

## Payload

### Structure - JSON

- `notificationId`:
  - type: string
  - a valid ObjectID of the notification
- `type`:
  - type: string
  - a type of the action triggered notification
  - can be _`ARCHIVE`_, _`REQUEST`_, _`APPROVE`_, _`EXCHANGE`_
- `book`:
  - type: object
  - properties of the book
  - this refers to the book posted by owner when type is _REQUEST_, _MESSAGE_
  - this refers to the book user wanted to get when type is _ARCHIVE_, _APPROVE_
  - properties:
    - `bookId`:
      - type: string
      - a valid ObjectID of the book
    - `cover`:
      - type: string
      - a valid file path for the cover of the book
- `actor`:
  - type: object
  - properties of the actor triggered notification
  - properties:
    - `nickname`:
      - type: string
      - nickname of the actor
    - `avatar`:
      - type: string
      - a valid file path for the avatar of the user
- `exchangeId`:
  - type: string
  - a valid ObjectID for the exchange notification is associated with
- `seen`:
  - type: boolean
  - whether the notification was seen before
- `createdAt`:
  - type: Date
  - the date notification was created in the system

### Example

```json
{
  "notificationId": "66309f8691d019ed240c646f",
  "type": "EXCHANGE",
  "book": {
    "bookId": "66309f8691d019ed240c646f",
    "cover": "123123-asdsa.jpg"
  },
  "actor": {
    "nickname": "genius",
    "avatar": "123123-asdsa.jpg"
  },
  "exchangeId": "66309f8691d019ed240c646f",
  "createdAt": "2024-05-03T12:42:18.179+00:00",
  "seen": false
}
```
