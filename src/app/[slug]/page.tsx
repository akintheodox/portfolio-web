import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";
import Link from "next/link";
import { sanityFetch } from "@/sanity/live";
import { ARTICLE_QUERY } from "@/sanity/queries";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: article } = await sanityFetch({
    query: ARTICLE_QUERY,
    params: { slug },
  });

  if (!article) return notFound();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <p>
        <Link href="/" className="text-zinc-500 hover:text-zinc-900">
          ← Articles
        </Link>
      </p>
      <article className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">{article.title}</h1>
        {article.author?.name ? (
          <p className="text-zinc-600">By {article.author.name}</p>
        ) : null}
        {Array.isArray(article.body) ? <PortableText value={article.body} /> : null}
      </article>
    </main>
  );
}
