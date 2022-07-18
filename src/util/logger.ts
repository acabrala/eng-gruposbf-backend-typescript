import { init } from '@somosphi/logger';

export const {
  ExpressLogger,
  Logger,
  AxiosLogger,
  Redact,
} = init({
  PROJECT_NAME: 'dict',
  LOG_LEVEL: 'debug',
});

Redact.addKey(/^access_token$/);
