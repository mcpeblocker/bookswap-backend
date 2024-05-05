# Message event
## Can be listened to

Received each time a new message is sent to user from via exchange association

## Payload

### Structure - JSON

- `exchangeId`
  - type: string
  - the valid ObjectID of the exchange message received
- `sender`
  - type: string
  - the valid ObjectID of the user who sent the message
- `text`
  - type: string
  - content of the new message
- `createdAt`
  - type: string
  - the exact datetime message was created in the system
- `seen`
  - type: boolean
  - indicator whether new message is seen or not
  - it is always false when new message is received with this event

### Example

```json
{
  "exchangeId": "66309f8691d019ed240c646f",
  "sender": "66309f8691d019ed240c646f",
  "text": "Hello",
  "createdAt": "2024-05-03T12:42:18.179+00:00",
  "seen": false
}
```
