import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  // Workaround for Strapi blank admin in develop after 5.50.2+
  // https://github.com/strapi/strapi/issues/27062
  const include = new Set([
    ...(config.optimizeDeps?.include ?? []),
    'yup',
    'property-expr',
    'toposort',
    'fuzzysort',
    'es-toolkit/compat/isEqual',
    'extend',
    'debug',
    'sanitize-html',
  ]);

  return mergeConfig(config, {
    optimizeDeps: {
      include: [...include],
      needsInterop: ['property-expr', 'fuzzysort', 'toposort'],
    },
  });
};
