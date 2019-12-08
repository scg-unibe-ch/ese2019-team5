/**
 * This is a custom Error class that extends the {@link Error}
 * besides the message like its super class it contains an errorCode which is used to distinguish the different errors
 * before sending them to the frontend.
 */
export class DBServiceError extends Error {
  errorCode : number;

  constructor(message: string, errorCode: number) {
    super(message);
    this.name = "DBServiceError";
    this.errorCode = errorCode;
  }
}
