import mongoose from "mongoose";
import { Visibility } from "../enums/Visibility.enum";

export interface Bookshelf {
  books: BookshelfBook[];
}

interface BookshelfBook {
  bookId: mongoose.Types.ObjectId;
  title: string;
  author: string;
  genre: string;
  cover: string;
  visibility: Visibility;
  status: string;
  createdAt: Date;
  exceptions?: mongoose.Types.ObjectId[];
  exchange?: BookExchange;
}

interface BookExchange {
  exchangeId: mongoose.Types.ObjectId;
  exchangedAt: Date;
  requestedBy: {
    nickname: string;
    avatar: string;
  };
  exchangedBook: {
    title: string;
    author: string;
    cover: string;
  };
}
