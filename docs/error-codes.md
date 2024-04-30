# Error Codes

## Description

Below is the list of error codes used for specifying problem in HTTP responses.

## List

### Server
- `SERVER_ERROR`
  - Unspecified error is occured in the server procedures
### Validation
#### Login schema
- `INVALID_EMAIL`
  - Invalid email is provided
- `INVALID_TOKEN`
  - Invalid google authentication token is provided
#### Boarded User schema
- `INVALID_USER_ID`
  - Invalid user ID is provided (should be valid MongoDB ObjectID)
- `INVALID_NICKNAME`
  - Invalid nickname is provided
- `INVALID_GENRE`
  - Invalid genre is provided
- `INVALID_AVATAR`
  - Invalid avatar file is provided (should be picture)
- `FILE_MISSING`
  - File is not attached to request correctly

### S3 Upload
- `FILE_UPLOAD_ERROR`
  - Server failed to upload the attached file

### Database
- `USER_NOT_FOUND`
  - User with given credentials couldn't be found
