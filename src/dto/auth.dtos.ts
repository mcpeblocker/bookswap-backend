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

export interface AuthModifyDto {
  nickname: string;
  preferredGenres: string[];
}
