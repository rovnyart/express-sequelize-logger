const CATCH_ARGUMENT = 2;

const asyncErrorHandler = (fn) => (...args) => fn(...args).catch(args[CATCH_ARGUMENT]);

module.exports = asyncErrorHandler;
