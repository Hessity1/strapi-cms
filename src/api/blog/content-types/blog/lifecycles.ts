/**
 * When a blog slug changes, keep SEO intact by storing a redirect
 * from /blog/{oldSlug} → /blog/{newSlug} for the frontend to apply as 301.
 */

import type { Core } from '@strapi/strapi';

const blogPath = (slug: string) => `/blog/${slug}`;

async function upsertBlogRedirect(strapi: Core.Strapi, oldSlug: string, newSlug: string) {
  const from = blogPath(oldSlug);
  const to = blogPath(newSlug);

  if (from === to) {
    return;
  }

  const existing = await strapi.db.query('api::redirect.redirect').findOne({
    where: { from },
  });

  if (existing) {
    await strapi.db.query('api::redirect.redirect').update({
      where: { id: existing.id },
      data: { to, permanent: true, source: 'blog' },
    });
  } else {
    await strapi.db.query('api::redirect.redirect').create({
      data: { from, to, permanent: true, source: 'blog' },
    });
  }

  // Collapse chains: anything that pointed at the old URL now points at the new one.
  const pointingToOld = await strapi.db.query('api::redirect.redirect').findMany({
    where: { to: from },
  });

  for (const redirect of pointingToOld) {
    if (redirect.from === to) {
      // Would create a loop (new → old); delete it instead.
      await strapi.db.query('api::redirect.redirect').delete({
        where: { id: redirect.id },
      });
      continue;
    }

    await strapi.db.query('api::redirect.redirect').update({
      where: { id: redirect.id },
      data: { to },
    });
  }
}

export default {
  async beforeUpdate(event) {
    const { data, where } = event.params;

    if (!data?.slug) {
      return;
    }

    const existing = await strapi.db.query('api::blog.blog').findOne({ where });

    if (!existing?.slug || existing.slug === data.slug) {
      return;
    }

    // Only care about posts that were already published (indexed / shareable URLs).
    if (!existing.publishedAt) {
      return;
    }

    event.state = event.state ?? {};
    event.state.oldBlogSlug = existing.slug;
  },

  async afterUpdate(event) {
    const oldSlug = event.state?.oldBlogSlug as string | undefined;
    const newSlug = event.result?.slug as string | undefined;

    if (!oldSlug || !newSlug || oldSlug === newSlug) {
      return;
    }

    try {
      await upsertBlogRedirect(strapi, oldSlug, newSlug);
      strapi.log.info(`Created blog redirect: ${blogPath(oldSlug)} → ${blogPath(newSlug)}`);
    } catch (error) {
      strapi.log.error('Failed to create blog slug redirect', error);
    }
  },
};
