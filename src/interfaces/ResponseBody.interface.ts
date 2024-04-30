import { ErrorCode } from "../enums/ErrorCode.enum";

interface IIssue {
  code: ErrorCode;
}

export interface IResponseBody {
  success: boolean; // always exists
  data?: any; // must exist if success is true
  issues?: IIssue[]; // must exist if success is false
}
