/**
 * An error with an HTTP status and a stable machine-readable code, sent to
 * the client as { error: { code, message, fields? } } by the error handler.
 */
export class HttpError extends Error {
  constructor(status, code, message, fields) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export const badRequest = (message, fields) => new HttpError(400, "invalid-request", message, fields);
export const unauthorized = (message = "Sign in to continue.") => new HttpError(401, "unauthenticated", message);
export const forbidden = (message = "You don't have permission to do that.") => new HttpError(403, "forbidden", message);
export const notFound = (message = "Not found.") => new HttpError(404, "not-found", message);
export const conflict = (code, message) => new HttpError(409, code, message);
