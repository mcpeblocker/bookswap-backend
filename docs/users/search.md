# Search user
API Route

## Request - HTTP Request
### Route: /users/search?text=""
### Method: `GET`
### Headers
- Authorization: Bearer `<token>`
### Query
#### Properties
- `text`
  - type: string
  - should be a valid string to search among user nicknames
#### Example
```
?text=hot
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
    - `users`
      - type: array
      - items: list of matching users
        - type: object
        - properties:
          - `userId`:
            - type: string
            - a valid ObjectID of the user matched
          - `nickname`:
            - type: string
            - the nickname of the user matched
          - `avatar`:
            - type: string
            - the file path to get avatar picture of the user
            - the path should be added to the base url of file retrieval api
#### Example
- One user found
```json
{
    "success": true,
    "data": {
        "users": [
            {                
                "userId": "66309f8691d019ed240c646f",
                "nickname": "Hot Dog",
                "avatar": "1231231203-mypic.jpg"
            }
        ]
    }
}
```