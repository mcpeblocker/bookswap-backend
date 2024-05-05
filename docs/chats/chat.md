# Chats

API Route

## Request - HTTP Request

### Route: /chats/:exchangeId

### Method: `GET`

### Headers

- Authorization: Bearer `<token>`

### Params

- `exchangeId`:
  - type: string
  - a valid ObjectID of the exchange with status of either _APPROVED_ or _COMPLETED_

## Response - HTTP Response

### Headers

- Content-Type: application/json

### Payload

#### Structure

- `success`
  - type: boolean
  - true when the intended action is succeeded
  - false when the intended action is failed
- `data`
  - type: object
  - properties:
    - `chat`
      - type: object
      - properties:
        - `exchangeId`:
          - type: string
          - a valid ObjectID of the book
        - `offeredBook`
          - type: object
          - properties
            - `title`
              - type: string
              - title of the book
            - `cover`
              - type: string
              - a valid file path for the cover of the book
        - `offeredBy`
          - type: object
          - properties:
            - `userId`
              - type: string
              - a valid ObjectID of the user
            - `nickname`
              - type: string
              - nickname of the user who offered the book
            - `avatar`
              - type: tring
              - a valid file path for the avatar of the user
        - `exchangedBook`
          - type: object
          - properties
            - `title`
              - type: string
              - title of the book
            - `cover`
              - type: string
              - a valid file path for the cover of the book
        - `requestedBy`
          - type: object
          - properties:
            - `userId`
              - type: string
              - a valid ObjectID of the user
            - `nickname`
              - type: string
              - nickname of the user who offered the book
            - `avatar`
              - type: tring
              - a valid file path for the avatar of the user
    - `messages`
      - type: array
      - items:
        - type: object
        - properties:
          - type: object
          - properties:
            - `text`
              - type: string
            - `createdAt`
              - type: Date
            - `seen`
              - type: boolean
            - `sender`
              - type: string
              - a valid ObjectID of the user who sent the message

#### Example

```json
{
  "success": true,
  "data": {
    "chat": {
      "exchangeId": "66309f8691d019ed240c646f",
      "offeredBook": {
        "title": "Harry Potter",
        "cover": "J. K. Rowling"
      },
      "offeredBy": {
        "userId": "66309f8691d019ed240c646f",
        "nickname": "genius",
        "avatar": "123123-genius.jpg"
      },
      "exchangedBook": {
        "title": "Justice",
        "cover": "Someone"
      },
      "requestedBy": {
        "userId": "66309f8691d019ed240c646f",
        "nickname": "fool",
        "avatar": "1231231-fool.jpg"
      }
    },
    "messages": [
      {
        "sender": "66309f8691d019ed240c646f",
        "text": "Bye bye",
        "createdAt": "2024-05-03T12:42:18.179+00:00",
        "seen": false
      }
    ]
  }
}
```
