export enum ErrorCode {
  // Server
  SERVER_ERROR = "SERVER_ERROR",

  // Validation
  // [Auth] Login schema
  INVALID_EMAIL = "INVALID_EMAIL",
  INVALID_TOKEN = "INVALID_TOKEN",
  // [Auth] Boarded User schema
  INVALID_USER_ID = "INVALID_USER_ID",
  // INVALID_EMAIL = "INVALID_EMAIL", - Already defined
  INVALID_NICKNAME = "INVALID_NICKNAME",
  INVALID_GENRE = "INVALID_GENRE",
  INVALID_AVATAR = "INVALID_AVATAR",
  FILE_MISSING = "FILE_MISSING",
  // [Users] Search user
  INVALID_QUERY = "INVALID_QUERY",
  // [Books] Upload schema
  INVALID_TITLE = "INVALID_TITLE",
  INVALID_AUTHOR = "INVALID_AUTHOR",
  // INVALID_GENRE = "INVALID_GENRE", - Already defined
  INVALID_VISIBILITY = "INVALID_VISIBILITY",
  INVALID_EXCEPTION = "INVALID_EXCEPTION",

  // S3 Upload
  FILE_UPLOAD_ERROR = "FILE_UPLOAD_ERROR",

  // Database
  USER_NOT_FOUND = "USER_NOT_FOUND",
}
