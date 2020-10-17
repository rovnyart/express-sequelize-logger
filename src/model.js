module.exports = ({ tableName, isUuidPk = false }) => (sequelize, DataTypes) => {
  const RequestLog = sequelize.define('requestLog', {
    ...(isUuidPk && { id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 } }),
    method: DataTypes.STRING(10),
    url: DataTypes.TEXT,
    headers: DataTypes.TEXT,
    body: DataTypes.TEXT,
    params: DataTypes.TEXT,
    query: DataTypes.TEXT,
    statusCode: DataTypes.INTEGER,
    responseBody: DataTypes.TEXT,
    time: DataTypes.FLOAT,
    requestBodySize: DataTypes.BIGINT,
    responseBodySize: DataTypes.BIGINT,
  },
  {
    underscored: true,
    tableName,
    modelName: 'requestLog',
  });

  return RequestLog;
};
