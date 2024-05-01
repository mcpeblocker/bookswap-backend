# Login
API Route

## Request - HTTP Request
### Route: /auth/login
### Method: `POST`
### Headers
- Content-Type: application/json
### Body
#### Structure
- `email`
  - type: string
  - should be valid email
- `token`
  - type: string
  - token obtained from google authentication
#### Example
```json
{
  "email": "myemail@gmail.com",
  "token": "google-token"
}
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
    - `boarding`
      - type: boolean
      - true when the recorded user must carry out boarding procedure
      - false when recorded user already carried out boarding procedure
    - `userId`
      - type: string
      - exists when *boarding* is true
      - a valid ObjectID to be used in *Board Route*
    - `token`
      - type: string
      - exists when *boarding* is false
      - JWT token used for authentication in requests marked as **Authenticated**
#### Example
- New user registration
```json
{
    "success": true,
    "data": {
        "boarding": true,
        "userId": "66309f8691d019ed240c646f"
    }
}
```
- Existing user login
```json
{
    "success": true,
    "data": {
        "boarding": false,
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