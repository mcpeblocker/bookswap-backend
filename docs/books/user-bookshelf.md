# User's bookshelf

API Route

## Request - HTTP Request

### Route: /books/bookshelf/:userId

### Method: `GET`

### Params

- `userId`
  - type: string
  - a valid ObjectID of the user

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

#### Example

```json
{
  "success": true,
  "data": {
    "books": [
      {
        "title": "Me Before You",
        "author": "JoJo Moyes",
        "genre": "Novel",
        "createdAt": "2024-05-03T12:42:18.179Z",
        "bookId": "6634dbaaaf67fac193ebb5f8",
        "cover": "1714740136590-delta.jpg"
      },
      {
        "title": "Me Before You",
        "author": "JoJo Moyes",
        "genre": "Novel",
        "createdAt": "2024-05-04T08:39:19.470Z",
        "bookId": "6635f437364f4c9412fa263f",
        "cover": "1714811958232-delta.jpg"
      }
    ]
  }
}
```
