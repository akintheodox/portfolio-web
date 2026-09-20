import Link from "next/link";
import { sanityFetch } from "@/sanity/live";
import { ARTICLES_QUERY } from "@/sanity/queries";

export default async function HomePage() {
  const { data: articles } = await sanityFetch({ query: ARTICLES_QUERY });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight">
          My Corner of the Interweb
        </h1>
        <p className="mt-2 text-zinc-600">Articles from Sanity</p>
      </div>
      <ul className="flex flex-col gap-4">
        {articles.map((article) => (
          <li key={article._id}>
            {article.slug ? (
              <Link
                href={`/${article.slug}`}
                className="text-xl font-medium hover:underline"
              >
                {article.title}
              </Link>
            ) : (
              <span className="text-xl font-medium">{article.title}</span>
            )}
            {article.excerpt ? (
              <p className="mt-1 text-zinc-600">{article.excerpt}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
