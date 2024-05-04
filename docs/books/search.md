# Search book

API Route

## Request - HTTP Request

### Route: /books/search?text=""

### Method: `GET`

### Headers

- Authorization: Bearer `<token>`

### Query

#### Properties

- `text`
  - type: string
  - should be a valid string to search among book title, author

#### Example

```
?text=justice
```

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
      - items: list of matching books
        - type: object
        - properties:
          - `bookId`:
            - type: string
            - a valid ObjectID of the book matched
          - `title`:
            - type: string
            - the title of the book
          - `author`
            - type: string
            - the author of the book
          - `genre`
            - type: string
            - the genre of the book
          - `cover`:
            - type: string
            - the file path to get cover picture of the book
            - the path should be added to the base url of file retrieval api
          - `createdAt`:
            - type: string
            - the date book was posted in the system
          - `status`:
            - type: string
            - the current status of the book in the system

#### Example

- One book found

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "bookId": "66309f8691d019ed240c646f",
        "title": "Hot Dog",
        "author": "Michael J.Sandel",
        "genre": "Philosophy",
        "cover": "1231231203-mypic.jpg",
        "createdAt": "2024-05-03T12:42:18.179+00:00",
        "status": "AVAILABLE"
      }
    ]
  }
}
```
