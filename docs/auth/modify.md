# Modify
API Route

## Request - HTTP Request
### Route: /auth/modify
### Method: `PATCH`
### Headers
- Content-Type: form-data
- Authorization: Bearer `<token>`
### Body
#### Structure
All the fields below are optional, and at least one of them must be provided
- `nickname`
  - type: text
  - unique nickname for the user in the system
- `preferredGenres`
  - type: text
  - should be a valid sequence of genres separated by only comma
- `avatar`
  - type: file
  - picture file to be used for user profile photo
#### Example
```form-data
nickname        = "mynickname"
preferredGenres = "fiction,fantasy,romance"
avatar          = File
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
    - `userId`
      - type: string
      - ObjectID of the book record updated in database
#### Example
```json
{
    "success": true,
    "data": {
        "user": "66309f8691d019ed240c646w"
    }
}
```