# Error Codes

## Description

Below is the list of error codes used for specifying problem in HTTP responses.

## List

### Server

- `SERVER_ERROR`
  - Unspecified error is occured in the server procedures

### Authorization

- `UNAUTHORIZED`
  - The authorized request must be made to the api to complete specified action
- `FORBIDDEN`
  - The action can't be carried out due to permission restrictions

### Validation

#### Login schema

- `INVALID_TOKEN`
  - Invalid google authentication token is provided

#### Boarded User schema

- `INVALID_USER_ID`
  - Invalid user ID is provided (should be valid MongoDB ObjectID)
- `INVALID_EMAIL`
  - Invalid email is provided
- `INVALID_NAME`
  - Invalid name is provided
- `INVALID_NICKNAME`
  - Invalid nickname is provided
- `INVALID_GENRE`
  - Invalid genre is provided
- `INVALID_AVATAR`
  - Invalid avatar file is provided (should be picture)
- `FILE_MISSING`
  - File is not attached to request correctly

#### Search user query

- `INVALID_QUERY`
  - Provided query is not valid, text should be a valid string

#### Book Upload/Edit schema

- `INVALID_TITLE`
  - Provided title for the book is invalid, it should be valid string
- `INVALID_AUTHOR`
  - Provided author for the book is invalid, it should be valid string
- `INVALID_VISIBILITY`
  - Provided visilibity option is invalid, see the request body specification for more info
- `INVALID_EXCEPTION`
  - Provided exception in the list is invalid, it should be a valid MongoDB ObjectID of the existing user

#### Exchange Request schema

- `INVALID_ID`
  - Provided id is invalid

### S3 Upload

- `FILE_UPLOAD_ERROR`
  - Server failed to upload the attached file

### Database

- `USER_NOT_FOUND`
  - User with given credentials couldn't be found
