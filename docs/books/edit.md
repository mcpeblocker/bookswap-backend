# Edit book
API Route

## Request - HTTP Request
### Route: /books/:bookId/edit
### Method: `PATCH`
### Headers
- Content-Type: form-data
- Authorization: {token}
### Params
- bookId: string (ObjectID)
### Body
#### Structure
All the fields listed below are optional, only the ones provided will be updated to a new value.
- `title`
  - type: text
  - the title of the book
- `author`
  - type: text
  - the name of the author of the book
- `genre`
  - type: text
  - should be a valid genre
- `cover`
  - type: file
  - picture file to be used as cover image for book
- `visibility`
  - type: text
  - can be one of the four values below:
    - ***public***
      - The book will be visible for all the users
    - ***private***
      - The book will be hidden from all the users
    - ***exceptional_public***
      - The book will be visible for only the selected exceptional users
    - ***exceptional_private***
      - The book will be hidden from only the selected exceptional users
- `exceptions`
  - type: text
  - list of id of the exceptional users
  - must be a valid list separated by comma
  - must include valid ObjectIDs of the users
  - must be present only when visibility is exceptional_*
#### Example
- Make book public to everyone
```form-data
visibility      = "public"
```
- Make book hidden from some users
```form-data
visibility      = "exceptional_private"
exceptions      = "66309f8691d019ed240c646f,66309f8691d019ed240c646d"
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
    - `bookId`
      - type: string
      - ObjectID of the book record updated in database
#### Example
- Book record is updated in the database accordingly
```json
{
    "success": true,
    "data": {
        "bookId": "66309f8691d019ed240c646w"
    }
}
```
- Invalid genre error
```json
{
    "success": false,
    "issues": [
        {
            "code": "INVALID_GENRE"
        }
    ]
}
```