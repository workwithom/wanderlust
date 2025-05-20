class ExpressError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.messsage = message;

    
  }
}

module.exports = ExpressError;