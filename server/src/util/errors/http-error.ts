class HttpError extends Error {
  code: number;
  statusCode: number;
  /**
   * Structured context for errors a client has to act on rather than merely
   * display. A refused curriculum delete carries the groups blocking it here,
   * so the dialog can name them and offer to archive instead.
   */
  details?: unknown;

  constructor(message: string, errorCode: number, details?: unknown) {
    super(message);
    this.code = errorCode;
    this.statusCode = errorCode;
    this.details = details;

    // Set the prototype explicitly to maintain correct prototype chain (for instanceof checks)
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export default HttpError;
