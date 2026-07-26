export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    sessions: {
      // Since 5.49, active sessions renew the access token silently before expiry;
      // idle logout happens after ~one accessTokenLifespan of inactivity.
      accessTokenLifespan: 7 * 24 * 60 * 60, // 7 days (effective idle window)
      idleSessionLifespan: 7 * 24 * 60 * 60, // 7 days idle
      idleRefreshTokenLifespan: 30 * 24 * 60 * 60, // 30 days
      maxRefreshTokenLifespan: 30 * 24 * 60 * 60, // 30 days
      maxSessionLifespan: 30 * 24 * 60 * 60, // 30 days
    },
    cookie: {
      // Railway/proxies terminate TLS at the edge; the app sees HTTP internally.
      // strapi-identity sets secure cookies using this flag — false avoids 500 on MFA login.
      secure: env.bool('ADMIN_COOKIE_SECURE', false),
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
