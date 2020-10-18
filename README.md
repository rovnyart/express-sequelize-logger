# express-sequelize-logger

An Express middleware for logging API requests into database via Sequelize

## Install

To install via npm:

```bash
npm install --save express-sequelize-logger
```

or Yarn:

```bash
yarn add express-sequelize-logger
```

## Usage

For a simple usage just add middleware to your `app`:

```javascript
import express from 'express'
import requestLogger from 'sequelize-express-logger'
import sequelize from '../config/database' // your Sequelize instance here

const app = express();

//...other middlewares
app.use(requestLogger({ sequelize })); 
```

And that's it. By default, middleware will create table called `request_logs` (can be changed by option passed)
and insert all requests logs there.

### Log table columns

| name               | type    | description                                                                                                    |
|--------------------|---------|----------------------------------------------------------------------------------------------------------------|
| id                 | INTEGER | Auto-increment (SERIAL) integer record id (primary key). Can be altered to UUID v4 if `isUuidPk` option passed |
| method             | VARCHAR | Method name (GET/POST/PUT/DELETE etc)                                                                          |
| url                | TEXT    | Request path                                                                                                   |
| headers            | TEXT    | Request headers                                                                                                |
| body               | TEXT    | Request body (can be disabled by `logRequestBody` option)                                                       |
| response_body               | TEXT    | Response body (can be disabled by `logResponseBody` option)                                                       |
| params             | TEXT    | URL params                                                                                                     |
| query              | TEXT    | Query string                                                                                                   |
| status_code        | INTEGER | Request status code                                                                                            |
| time               | FLOAT   | Request time (ms)                                                                                              |
| request_body_size  | INTEGER | Size of request body (bytes)                                                                                   |
| response_body_size | INTEGER | Size of response body (bytes)                                                                                 |

### Options

| name            | type             | required | default value                          | description                                                                                                                    |
|-----------------|------------------|----------|----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| sequelize       | Object           | YES      | -                                      | Your app `sequelize` instance. Usually exported from db config file.                                                           |
| tableName       | String           |          | request_logs                           | Log table name                                                                                                                 |
| isUuidPk        | Boolean          |          | false                                  | If `true`, `id` column (primary key) will be of type `UUID(v4)`                                                                |
| logRequestBody  | Boolean/function |          | true                                   | A boolean or function with signature `(req) => {}`, should return Boolean. Whether to log request bodies.                      |
| logResponseBody | Boolean/function |          | true                                   | A boolean or function with signature `(req) => {}`, should return Boolean. Whether to log response bodies.                      |
| logging         | Object           |          | { enabled: true, logger: console.log } | Console logger options                                                                                                         |
| logging.enabled | Boolean          |          | true                                   |                                                                                                                                |
| logging.logger  | function         |          | console.log                            | A function with signature `(message) => {}`, should return String. For example, you can pass your `winston` logger method here |
| shouldThrowError | Boolean         |          | false                           | Whether to throw errors from middleware. By default, errors will not be thrown, any errors would be console-logged. |

## License

[MIT](http://vjpr.mit-license.org)
