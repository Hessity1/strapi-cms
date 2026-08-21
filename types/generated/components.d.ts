import type { Schema, Struct } from '@strapi/strapi';

export interface MetaFaq extends Struct.ComponentSchema {
  collectionName: 'components_meta_faqs';
  info: {
    displayName: 'FAQ';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.Text;
    question: Schema.Attribute.String;
  };
}

export interface MetaMeta extends Struct.ComponentSchema {
  collectionName: 'components_meta_metas';
  info: {
    displayName: 'Meta';
    icon: 'oneToMany';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    keywords: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'meta.faq': MetaFaq;
      'meta.meta': MetaMeta;
    }
  }
}
