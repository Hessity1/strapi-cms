const resolveServerUrl = (env) => {
  const explicitUrl = env('URL', '').trim();

  if (explicitUrl.startsWith('http')) {
    try {
      return new URL(explicitUrl).toString().replace(/\/$/, '');
    } catch {
      // Fall through when URL is malformed (e.g. "https://" during Railway build).
    }
  } else if (explicitUrl) {
    return explicitUrl;
  }

  const railwayDomain = env('RAILWAY_PUBLIC_DOMAIN', '').trim();
  if (railwayDomain) {
    return `https://${railwayDomain}`;
  }

  return '';
};

export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: resolveServerUrl(env),
  proxy: true,
});
