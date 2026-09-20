import { client } from "@/sanity/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { notFound } from "next/navigation";
import { PortableText } from '@portabletext/react';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

// GROQ query to fetch a case study by its slug
const CASE_STUDY_QUERY = `*[_type == "caseStudy" && slug.current == $slug][0]{
  title,
  role,
  deliverables,
  coverImage,
  body
}`;

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = await client.fetch(CASE_STUDY_QUERY, { slug });

  // If the URL slug doesn't exist in Sanity, show a 404 page
  if (!caseStudy) {
    notFound();
  }

  return (
    <main className="w-full max-w-6xl mx-auto px-6 py-20 text-left">
      {/* Editorial Hero Header */}
      <header className="mb-16">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          {caseStudy.title}
        </h1>
        
        {/* Meta Data: Role & Deliverables */}
        <div className="flex flex-col md:flex-row gap-12 text-gray-300 mt-12 border-t border-gray-800 pt-8">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold">Role</h3>
            <p className="text-lg">{caseStudy.role}</p>
          </div>
          
          {caseStudy.deliverables && caseStudy.deliverables.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold">Deliverables</h3>
              <ul className="flex flex-wrap gap-2">
                {caseStudy.deliverables.map((item: string, i: number) => (
                  <li key={i} className="px-4 py-1.5 border border-gray-700 rounded-full text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Cinematic Cover Image */}
      {caseStudy.coverImage && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-24 bg-gray-900">
          <Image
            src={urlFor(caseStudy.coverImage).width(1920).height(1080).url()}
            alt={`${caseStudy.title} cover image`}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      
      {/* 
        Content Area: 
        This is where we will eventually render your rich narrative content, 
        Sanity Portable Text, and 3D/Manga media galleries. 
      */}
      {caseStudy.body && (
  <section className="max-w-3xl mx-auto prose prose-invert">
    <PortableText value={caseStudy.body} />
  </section>
)}
    </main>
  );
}