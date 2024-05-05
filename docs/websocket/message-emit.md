# Message event
## Can be emitted

Client needs to send each time a new message is created by the user

## Payload

### Structure - JSON

- `exchangeId`
  - type: string
  - the valid ObjectID of the exchange message sent
- `text`
  - type: string
  - content of the new message

### Example

```json
{
  "exchangeId": "66309f8691d019ed240c646f",
  "text": "Hello"
}
```
