# Chats

API Route

## Request - HTTP Request

### Route: /chats

### Method: `GET`

### Headers

- Authorization: Bearer `<token>`

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
    - `chats`
      - type: array
      - items: list of books owned by user
        - type: object
        - properties:
          - `exchangeId`:
            - type: string
            - a valid ObjectID of the book
          - `status`
            - type: string
            - the status of the exchange
            - can be *APPROVED*, *COMPLETED*
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
          - `approvedAt`
            - type: Date
            - the date exchange request was accepted
          - `exchangedAt`
            - type: Date
            - the date exchange was completed
          - `latestMessage`:
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
    "chats": [
      {
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
        },
        "latestMessage": {
          "text": "Bye bye",
          "createdAt": "2024-05-03T12:42:18.179+00:00",
          "seen": false
        }
      }
    ]
  }
}
```
