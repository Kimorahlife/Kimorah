class HttpError extends Error {
  code: number;
  statusCode: number;

  constructor(message: string, errorCode: number) {
    super(message);
    this.code = errorCode;
    this.statusCode = errorCode;

    // Set the prototype explicitly to maintain correct prototype chain (for instanceof checks)
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export default HttpError;
