import BookModel from "./Book.model";
import ExchangeModel from "./Exchange.model";
import UserModel from "./User.model";
import MessageModel from "./Message.model";
import FileModel from "./File.model";
import NotificationModel from "./Notification.model";

const models = {
  Book: BookModel,
  Exchange: ExchangeModel,
  User: UserModel,
  Message: MessageModel,
  File: FileModel,
  Notification: NotificationModel,
};

export default models;
