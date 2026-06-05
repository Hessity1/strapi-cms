const previewContentType = (
    env: (key: string, defaultValue?: string) => string,
    uid: string,
    type: string,
    publishedPath: string,
) => ({
    uid,
    draft: {
        url: `${env('FRONTEND_URL', 'https://hessity.com')}/api/preview`,
        query: {
            type,
            slug: '{slug}',
            secret: env('STRAPI_PREVIEW_SECRET'),
        },
    },
    published: {
        url: `${env('FRONTEND_URL', 'https://hessity.com')}${publishedPath}`,
    },
});

export default ({ env }) => ({
    'strapi-identity': {
        enabled: true,
    },
    comments: {
        enabled: true,
        config: {},
    },
    'preview-button': {
        config: {
            contentTypes: [
                previewContentType(env, 'api::blog-post.blog-post', 'blog-post', '/blog/{slug}'),
                previewContentType(env, 'api::faq.faq', 'faq', '/faq/{slug}'),
                previewContentType(env, 'api::help-article.help-article', 'help-article', '/help/{slug}'),
                previewContentType(env, 'api::page.page', 'page', '/{slug}'),
            ],
        },
    },
    'users-permissions': {
        config: {
            jwtSecret: env('JWT_SECRET'),
        },
    },
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: env('EMAIL_HOST'),
                port: env.int('EMAIL_PORT', 587),
                secure: env.bool('EMAIL_SECURE', false),
                auth: {
                    user: env('EMAIL_USER'),
                    pass: env('EMAIL_PASS'),
                },
            },
            settings: {
                defaultFrom: env('EMAIL_FROM'),
                defaultReplyTo: env('EMAIL_FROM'),
            },
        },
    },
    'webp-converter': {
        enabled: true,
        config: {},
    },
    oembed: {
        enabled: true,
    },
    'strapi-typed-client': {
        enabled: true,
    },
    upload: {
        config: {
            provider: 'aws-s3',
            providerOptions: {
                baseUrl: env('R2_PUBLIC_URL'),
                s3Options: {
                    credentials: {
                        accessKeyId: env('R2_ACCESS_KEY_ID'),
                        secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
                    },
                    region: 'auto',
                    endpoint: env('R2_ENDPOINT'),
                    params: {
                        Bucket: env('R2_BUCKET'),
                    },
                },
            },
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
        },
    },
});
