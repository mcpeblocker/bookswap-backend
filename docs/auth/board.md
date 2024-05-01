# Board
API Route

## Request - HTTP Request
### Route: /auth/board
### Method: `POST`
### Headers
- Content-Type: form-data
### Body
#### Structure
- `userId`
  - type: text
  - should be a valid ObjectID
  - received userId from *Login Route* should be passed
- `email`
  - type: text
  - should be valid email
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
userId          = "66309f8691d019ed240c646f"
email           = "myemail@gmail.com"
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
    - `token`
      - type: string
      - JWT token used for authentication in requests marked as **Authenticated**
#### Example
- User logged in with updated information
```json
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjMwOWY4NjkxZDAxOWVkMjQwYzY0NmYiLCJpYXQiOjE3MTQ0NjI2MTIsImV4cCI6MTcxNzA1NDYxMn0.9J9nva9Aw3Eu0GelEXED_Idl2mRSA5SGp-eFVVVYiuw"
    }
}
```
- Invalid email error
```json
{
    "success": false,
    "issues": [
        {
            "code": "INVALID_EMAIL"
        }
    ]
}
```