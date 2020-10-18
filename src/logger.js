const requestLogModel = require('./model');
const asyncErrorHandler = require('../libs/asyncErrorHandler');

const DEFAULT_TABLE_NAME = 'request_logs';

const requestLogger = (options = {}) => asyncErrorHandler(async (req, res, next) => {
  const {
    sequelize,
    tableName = DEFAULT_TABLE_NAME,
    isUuidPk,
    logRequestBody = true,
    logResponseBody = true,
    logging = { enabled: true, logger: console.log }, // eslint-disable-line no-console
    shouldThrowError = false,
  } = options;
  try {
    if (!sequelize) throw new Error('A sequelize instance must be passed');
    const model = requestLogModel({ tableName, isUuidPk })(sequelize, sequelize.Sequelize);
    await model.sync();
    const startTime = process.hrtime();
    const boundWrite = res.write.bind(res);
    const boundEnd = res.end.bind(res);
    const chunks = [];
    res.write = (chunk, ...rest) => {
      chunks.push(chunk);
      boundWrite(chunk, ...rest);
    };

    res.end = (chunk, ...rest) => {
      if (chunk) chunks.push(chunk);
      if (typeof chunk !== 'string') res.locals.body = Buffer.concat(chunks).toString();
      boundEnd(chunk, ...rest);
    };

    const actualLogRequestBody = typeof logRequestBody === 'function' ? !!logRequestBody(req) : logRequestBody;
    const actualLogResponseBody = typeof logResponseBody === 'function' ? !!logResponseBody(req) : logResponseBody;

    const record = {
      url: req.path,
      method: req.method,
      body: actualLogRequestBody ? JSON.stringify(req.body) : null,
      requestBodySize: JSON.stringify(req.body).length,
      headers: JSON.stringify(req.headers),
      params: JSON.stringify(req.params),
      query: JSON.stringify(req.query),
    };
    res.on('finish', async () => {
      const elapsedHrTime = process.hrtime(startTime);
      const time = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
      Object.assign(record, {
        statusCode: res.statusCode,
        time,
        responseBodySize: JSON.stringify(res.locals.body || '').length,
        responseBody: actualLogResponseBody ? res.locals.body : null,
      });
      await model.create(record);
      if (logging && logging.enabled) {
        logging.logger(`[HTTP-${record.method}] | ${record.url} | STATUS: ${record.statusCode} | TIME: ${record.time}`); // eslint-disable-line max-len
      }
    });
  } catch (error) {
    console.log(`[express-sequelize-logger]: ${error}`); // eslint-disable-line no-console
    if (shouldThrowError) throw error;
  }

  return next();
});

module.exports = requestLogger;
