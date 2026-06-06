export default ({ env }) => ({
  auth: {
    cookie: {
      secure: env.bool('ADMIN_COOKIE_SECURE', false),
    },
  },
});
