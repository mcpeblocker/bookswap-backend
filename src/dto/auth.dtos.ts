export interface AuthLoginDto {
  email: string;
  password: string;
}

export interface AuthBoardDto {
  userId: string;
  email: string;
  nickname: string;
  preferredGenres: string[];
}