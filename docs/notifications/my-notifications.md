# My notifications

Returns list of notifications received for authenticated user

API Route

## Request - HTTP Request

### Route: /notifications/my

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
    - `notifications`
      - type: array
      - items: list of exchanges associated with authenticated user
        - type: object
        - properties:
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

#### Example

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "type": "ARCHIVE",
        "book": {
          "bookId": "66366aca6e056ed36ce6cc72",
          "cover": "1714531290907-delta.jpg"
        },
        "actor": {
          "nickname": "genius",
          "avatar": "1714462187265-delta.jpg"
        },
        "seen": false,
        "createdAt": "2024-05-04T17:13:33.087Z",
        "notificationId": "66366cbd87d37569de408b7f",
        "exchangeId": "663660611fe6f082aa9f9f26"
      }
    ]
  }
}
```
