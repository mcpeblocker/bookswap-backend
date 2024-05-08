export interface AuthLoginDto {
  token: string;
}

export interface AuthBoardDto {
  userId: string;
  email: string;
  nickname: string;
  preferredGenres: string[];
}

export interface AuthModifyDto {
  name: string;
  nickname: string;
  preferredGenres: string[];
}
