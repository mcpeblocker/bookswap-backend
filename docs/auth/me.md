# Auth - Me

API Route

## Request - HTTP Request

### Route: /auth/me

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
  - collection of properties associated with authenticated user
  - properties:
    - `userId`
      - type: string
      - a valid ObjectID of the user
    - `nickname`
      - type: string
      - a nickname of the authenticated user
    - `email`
      - type: string
      - the email user used to authenticated with google
    - `preferredGenres`
      - type: array
      - items:
        - type: string
        - genre type user chosen as preferred
    - `avatar`
      - type: string
      - file path of the avatar image

#### Example

```json
{
  "success": true,
  "data": {
    "userId": "66309f8691d019ed240c646f",
    "nickname": "Rainbow",
    "email": "rainbow@gmail.com",
    "preferredGenres": ["novel", "science"],
    "avatar": "1231231203-mypic.jpg"
  }
}
```
