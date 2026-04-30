import type { EnvironmentVariables } from './environment-variables.type';

const REQUIRED_KEYS: Array<keyof EnvironmentVariables> = [
  'PORT',
  'TZ',
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
  'DB_SYNCHRONIZE',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
];

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  for (const key of REQUIRED_KEYS) {
    const raw = config[key];
    if (typeof raw !== 'string' || raw.trim().length === 0) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  const dbPort = Number(config.DB_PORT);
  if (!Number.isInteger(dbPort) || dbPort <= 0) {
    throw new Error('DB_PORT must be a positive integer');
  }

  if (!['true', 'false'].includes(String(config.DB_SYNCHRONIZE))) {
    throw new Error('DB_SYNCHRONIZE must be "true" or "false"');
  }

  if (
    String(config.NODE_ENV) === 'production' &&
    String(config.DB_SYNCHRONIZE) === 'true'
  ) {
    throw new Error('DB_SYNCHRONIZE=true is not allowed in production');
  }

  if (
    String(config.JWT_SECRET) === 'dev-only-change-this-to-a-long-random-secret'
  ) {
    throw new Error('JWT_SECRET must not use the placeholder value');
  }

  return config as EnvironmentVariables;
}
