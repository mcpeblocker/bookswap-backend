# Book exchanges

Returns the exchanges associated with the book

API Route

## Request - HTTP Request

### Route: /exchanges/:bookId

### Params:

- `bookId`:
  - type: string
  - a valid ObjectID for the book stored in database

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
    - `book`:
      - type: object
      - a collection of properties related to the book users requested
      - properties:
        - `title`:
          - type: string
          - title of the book
        - `author`:
          - type: string
          - author of the book
        - `genre`
          - type: string
          - genre of the book
        - `cover`:
          - type: string
          - a valid file path for the cover image of the book
        - `createdAt`
          - type: Date
          - the date book was posted in the system
        - `status`
          - type: string
          - the status of the book in the system
          - can be one of them: _`AVAILABLE`_, _`RESERVED`_, _`EXCHANGED`_
    - `exchanges`
      - type: array
      - items: list of exchanges associated with authenticated user
        - type: object
        - properties:
          - `exchangeId`:
            - type: string
            - a valid ObjectID of the book
          - `status`
            - type: string
            - the status of the exchange
            - can be one of them: _`REQUESTED`_, _`APPROVED`_, _`COMPLETED`_, _`ARCHIVED`_
          - `createdAt`
            - type: Date
            - the data exchange request was created in the system
          - `requestedBy`
            - type: object
            - a collection of properties to represent user who requested the book
            - properties:
              - `userId`
                - type: string
                - a valid ObjectID of the user in the system
              - `nickname`
                - type: string
                - nickname of the user
              - `avatar`
                - type: string
                - a file path to the avatar of the user

#### Example

```json
{
  "success": true,
  "data": {
    "book": {
      "title": "A Little Life",
      "author": "Yanagihara Hanya",
      "genre": "Novel",
      "cover": "1231231203-mypic.jpg",
      "createdAt": "2024-05-03T12:42:18.179+00:00",
      "status": "AVAILABLE"
    },
    "exchanges": [
      {
        "exchangeId": "66309f8691d019ed240c646f",
        "status": "REQUESTED",
        "createdAt": "2024-05-03T12:42:18.179+00:00",
        "requestedBy": {
          "userId": "66309f8691d019ed240c646f",
          "nickname": "Fox Kim",
          "avatar": "123121-avatar.jpg"
        }
      }
    ]
  }
}
```
