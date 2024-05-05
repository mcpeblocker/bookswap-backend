# Complete exchange by swapping

Only the user who requested the offered book in exchange can complete swapping

API Route

## Request - HTTP Request

### Route: /exchanges/swap

### Method: `POST`

### Headers

- Content-Type: application/json
- Authorization: {token}

### Body

#### Structure

- `exchangeId`
  - type: string
  - a valid ObjectID of the exchange user wants to complete

#### Example

```json
{
  "exchangeId": "66309f8691d019ed240c646w"
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
    - `exchangeId`
      - type: string
      - ObjectID of the exchange record stored in database

#### Example

```json
{
  "success": true,
  "data": {
    "exchangeId": "66309f8691d019ed240c646w"
  }
}
```
