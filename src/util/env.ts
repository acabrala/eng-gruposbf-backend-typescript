import dotenv from 'dotenv';

dotenv.config();

const env = {
  /* Http Interface Config */
  httpPort: parseInt(process.env.HTTP_PORT || '', 10),
  httpBodyLimit: process.env.HTTP_BODY_LIMIT,

  /* Mysql Adapter Config */
  mysqlPort: parseInt(process.env.MYSQL_PORT || '', 10),
  mysqlHost: process.env.MYSQL_HOST,
  mysqlUser: process.env.MYSQL_USER,
  mysqlPassword: process.env.MYSQL_PASSWORD,
  mysqlSchema: process.env.MYSQL_SCHEMA,
  mysqlDebug: process.env.MYSQL_DEBUG === 'true',
  mysqlPoolMin: parseInt(process.env.MYSQL_POOL_MIN || '0', 10),
  mysqlPoolMax: parseInt(process.env.MYSQL_POOL_MIN || '1', 10),

  /* AMQP Helper Config */
  amqpProtocol: process.env.AMQP_PROTOCOL,
  amqpHostname: process.env.AMQP_HOSTNAME,
  amqpPort: parseInt(process.env.AMQP_PORT || '5672', 10),
  amqpUsername: process.env.AMQP_USERNAME,
  amqpPassword: process.env.AMQP_PASSWORD,

  /* Application Config */
  httpActive: process.env.HTTP_ACTIVE === 'true',
  amqpActive: process.env.AMQP_ACTIVE === 'true',
  cronActive: process.env.CRON_ACTIVE === 'true',

  /* Topazio Integration */
  topazioFacadeUrl: process.env.TOPAZIO_FACADE_URL || '',

  /* Itau Integration */
  itauFacadeUrl: process.env.ITAU_FACADE_URL || '',

  /* External URLs Integration */
  s3Url: process.env.S3_URL || '',
  phiAuthorizationUrl: process.env.PHI_AUTHORIZATION_URL || '',
  venonSessionName: process.env.SESSION_NAME || '',

  /* Security Gateway */
  checkFraudActive: process.env.SECURITY_GATEWAY_ACTIVE === 'true',
  securityGatewayClientId: process.env.SECURITY_GATEWAY_CLIENT_ID || '',
  securityGatewayUserName: process.env.SECURITY_GATEWAY_USERNAME || '',
  securityGatewayPassword: process.env.SECURITY_GATEWAY_PASSWORD || '',
  securityGatewayUrl: process.env.SECURITY_GATEWAY_URL || '',
  maxAllowedFraudScore: parseInt(process.env.MAX_ALLOWED_FRAUD_SCORE || '0', 10),
  minFraudInsightsOccurrence: parseInt(process.env.MIN_FRAUD_INSIGHTS_OCCURRENCE || '0', 10),
  fraudInsightsCodes: process.env.FRAUD_INSIGHTS_CODES || '',
};

export { env };
