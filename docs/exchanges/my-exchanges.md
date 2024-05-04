# My exchanges

Returns list of exchanges requested by authenticated user

API Route

## Request - HTTP Request

### Route: /exchanges/my

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
          - `offeredBook`:
            - type: object
            - a collection of properties related to the book user requested
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

#### Example
```json
{
  "success": true,
  "data": {
    "exchanges": [
      {
        "exchangeId": "66309f8691d019ed240c646f",
        "offeredBook": {
          "title": "A Little Life",
          "author": "Yanagihara Hanya",
          "genre": "Novel",
          "cover": "1231231203-mypic.jpg",
          "createdAt": "2024-05-03T12:42:18.179+00:00"
        },
        "status": "REQUESTED"
      }
    ]
  }
}
```
