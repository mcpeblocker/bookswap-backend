# My bookshelf

API Route

## Request - HTTP Request

### Route: /books/bookshelf/my

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
  - properties: refer to example below

#### Example

```json
{
  "success": true,
  "data": {
    "available": [
      {
        "title": "Me Before You",
        "author": "JoJo Moyes",
        "genre": "Novel",
        "visibility": "PRIVATE",
        "exceptions": [
          "60b4f0c4d9f7f8b7a0d3d1b4",
          "60b4f0c4d9f7f8b7a0d3d1d4",
          "60b4f0c4d9f7f8b7a0d3d1c4"
        ],
        "status": "AVAILABLE",
        "createdAt": "2024-05-04T10:38:41.556Z",
        "bookId": "6636103105d279df47ce14c1",
        "cover": "1714819120129-delta.jpg"
      }
    ],
    "reserved": [
      {
        "title": "Me Before You",
        "author": "JoJo Moyes",
        "genre": "Novel",
        "visibility": "EXCEPTIONAL_PUBLIC",
        "exceptions": [
          "60b4f0c4d9f7f8b7a0d3d1b4",
          "60b4f0c4d9f7f8b7a0d3d1d4",
          "60b4f0c4d9f7f8b7a0d3d1c4"
        ],
        "status": "RESERVED",
        "createdAt": "2024-05-04T08:39:19.470Z",
        "exchange": {
          "requestedBy": {
            "nickname": "mcpeblocker",
            "avatar": "1714462607783-delta.jpg"
          },
          "exchangedBook": {
            "title": "You Before Me",
            "author": "JoJo Moyes",
            "cover": "1714532709878-racoonpedro.webp"
          },
          "exchangeId": "6634ef7c91b7813412a9b1fb",
          "approvedAt": "2024-05-04T09:20:19.350Z"
        },
        "bookId": "6635f437364f4c9412fa263f",
        "cover": "1714811958232-delta.jpg"
      }
    ],
    "offered": [
      {
        "title": "Me Before You",
        "author": "JoJo Moyes",
        "genre": "Novel",
        "visibility": "PUBLIC",
        "status": "EXCHANGED",
        "createdAt": "2024-05-03T12:42:18.179Z",
        "exchange": {
          "requestedBy": {
            "nickname": "mcpeblocker",
            "avatar": "1714462607783-delta.jpg"
          },
          "exchangedBook": {
            "title": "Me Before You",
            "author": "JoJo Moyes",
            "cover": "1714740136590-delta.jpg"
          },
          "exchangeId": "6634efb55c3aa14f5651a232",
          "approvedAt": "2024-05-04T09:20:19.350Z",
          "exchangedAt": "2024-05-04T09:20:19.350Z"
        },
        "bookId": "6634dbaaaf67fac193ebb5f8",
        "cover": "1714740136590-delta.jpg"
      }
    ],
    "exchanged": [
      {
        "title": "Harry Potter",
        "author": "J. K. Rowling",
        "genre": "Novel",
        "visibility": "PUBLIC",
        "status": "EXCHANGED",
        "createdAt": "2024-05-03T12:42:18.179Z",
        "exchange": {
          "offeredBy": {
            "nickname": "mcpeblocker",
            "avatar": "1714462607783-delta.jpg"
          },
          "offeredBook": {
            "title": "Me Before You",
            "author": "JoJo Moyes",
            "cover": "1714740136590-delta.jpg"
          },
          "exchangeId": "6634efb55c3aa14f5651a232",
          "approvedAt": "2024-05-04T09:20:19.350Z",
          "exchangedAt": "2024-05-04T09:20:19.350Z"
        },
        "bookId": "6634dbaaaf67fac193ebb5f8",
        "cover": "1714740136590-delta.jpg"
      }
    ]
  }
}
```
