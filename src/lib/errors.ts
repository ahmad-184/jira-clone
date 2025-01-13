export const AUTHENTICATION_ERROR_MESSAGE =
  "You must be logged in to view this content";

export class RateLimitError extends Error {
  constructor() {
    super("Rate limit exceeded");
    this.name = "RateLimitError";
  }
}

export class PublicError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AuthenticationError extends PublicError {
  constructor() {
    super(AUTHENTICATION_ERROR_MESSAGE);
    this.name = "AuthenticationError";
  }
}

export class EmailInUseError extends PublicError {
  constructor() {
    super("Email is already in use");
    this.name = "EmailInUseError";
  }
}

export class NotFoundError extends PublicError {
  constructor() {
    super("Resource not found");
    this.name = "NotFoundError";
  }
}

export class TokenExpiredError extends PublicError {
  constructor() {
    super("Token has expired");
    this.name = "TokenExpiredError";
  }
}

export class LoginError extends PublicError {
  constructor() {
    super("Invalid email or password");
    this.name = "LoginError";
  }
}
