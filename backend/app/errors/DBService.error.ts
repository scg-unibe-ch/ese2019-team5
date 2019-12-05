export class DBServiceError extends Error {
  errorCode : number;

  constructor(message: string, errorCode: number) {
    super(message);
    this.name = "DBServiceError";
    this.errorCode = errorCode;
  }
}
