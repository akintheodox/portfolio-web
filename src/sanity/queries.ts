import { defineQuery } from "next-sanity";

export const ARTICLES_QUERY = defineQuery(
  `*[_type == "article" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc){
    _id,
    title,
    excerpt,
    "slug": slug.current,
    publishedAt,
    author->{name}
  }`,
);

export const ARTICLE_QUERY = defineQuery(
  `*[_type == "article" && slug.current == $slug][0]{
    _id,
    title,
    excerpt,
    publishedAt,
    body,
    author->{name},
    categories[]->{title}
  }`,
);
