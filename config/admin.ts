export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
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
