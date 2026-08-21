import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const BLOG_UID = 'api::blog.blog';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // Lock blog slug after first publish (SEO: indexed URLs must stay stable).
    // Strapi 5 admin uses Document Service, so enforce this here — not in lifecycles.
    strapi.documents.use(async (context, next) => {
      if (context.uid !== BLOG_UID) {
        return next();
      }

      if (context.action !== 'update' && context.action !== 'publish') {
        return next();
      }

      const documentId = context.params?.documentId as string | undefined;
      if (!documentId) {
        return next();
      }

      const published = await strapi.documents(BLOG_UID).findOne({
        documentId,
        status: 'published',
        fields: ['slug'],
      });

      const publishedSlug =
        published && 'slug' in published
          ? (published.slug as string | undefined)
          : undefined;

      // Not published yet — slug may still be edited freely.
      if (!publishedSlug) {
        return next();
      }

      if (context.action === 'update') {
        const nextSlug = context.params?.data?.slug as string | undefined;
        if (nextSlug && nextSlug !== publishedSlug) {
          throw new errors.ApplicationError(
            'Blog slug cannot be changed after the post is published.',
          );
        }
      }

      if (context.action === 'publish') {
        const draft = await strapi.documents(BLOG_UID).findOne({
          documentId,
          status: 'draft',
          fields: ['slug'],
        });
        const draftSlug =
          draft && 'slug' in draft ? (draft.slug as string | undefined) : undefined;

        if (draftSlug && draftSlug !== publishedSlug) {
          throw new errors.ApplicationError(
            'Blog slug cannot be changed after the post is published.',
          );
        }
      }

      return next();
    });
  },

  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
