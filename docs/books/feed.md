# Feed

API Route

## Request - HTTP Request

### Route: /books/feed

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
    - `books`
      - type: array
      - items: list of books owned by user
        - type: object
        - properties:
          - `bookId`:
            - type: string
            - a valid ObjectID of the book
          - `title`:
            - type: string
            - title of the book recorded
          - `author`:
            - type: string
            - author of the book recorded
          - `genre`:
            - type: string
            - genre of the book recorded
          - `cover`:
            - type: string
            - the file path to get cover picture of the book
            - the path should be added to the base url of file retrieval api
          - `createdAt`:
            - type: Date
            - the date and time book was uploaded to the system
          - `status`:
            - type: string
            - the status of the book in the system
            - books having status of _AVAILABLE_ is shown always
            - books having status of _RESERVED_ is shown only when there's an exchange linking the authenticated user and the book
          - `exchangeId`:
            - type: string
            - a valid ObjectID of the exchange in the system
            - exists when user has requested book earlier
            - appears only when _exchange_ status is either _REQUESTED_, _RESERVED_

#### Example

```json
{
  "success": true,
  "data": {
    "books": [
      {
        "bookId": "66309f8691d019ed240c646f",
        "title": "A Little Life",
        "author": "Yanagihara Hanya",
        "genre": "Novel",
        "cover": "1231231203-mypic.jpg",
        "status": "AVAILABLE",
        "createdAt": "2024-05-03T12:42:18.179+00:00",
        "exchangeId": "66309f8691d019ed240c646f"
      }
    ]
  }
}
```
