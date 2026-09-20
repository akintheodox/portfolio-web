import { client } from "@/sanity/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { notFound } from "next/navigation";
import { PortableText, PortableTextComponents } from '@portabletext/react';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

// Custom components for PortableText to render images and GIFs
const portableTextComponents: PortableTextComponents = {
    block: {
        h1: ({ children }) => <h1 className="text-5xl font-bold tracking-tight mt-12 mb-6 text-white">{children}</h1>,
        h2: ({ children }) => <h2 className="text-4xl font-bold tracking-tight mt-10 mb-5 text-white">{children}</h2>,
        h3: ({ children }) => <h3 className="text-3xl font-semibold tracking-tight mt-8 mb-4 text-white">{children}</h3>,
        h4: ({ children }) => <h4 className="text-2xl font-semibold tracking-tight mt-6 mb-3 text-white">{children}</h4>,
        h5: ({ children }) => <h5 className="text-xl font-medium tracking-tight mt-6 mb-2 text-white">{children}</h5>,
        h6: ({ children }) => <h6 className="text-lg font-medium tracking-tight mt-4 mb-2 text-gray-200">{children}</h6>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-gray-500 pl-6 my-6 italic text-gray-300 text-lg">
            {children}
          </blockquote>
        ),
        normal: ({ children }) => <p className="text-gray-300 leading-relaxed mb-6">{children}</p>,
      },
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="relative w-full my-8 aspect-video rounded-lg overflow-hidden bg-gray-900">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || 'Case study image'}
            fill
            className="object-contain"
          />
        </div>
      );
    },
  },
};

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
      
      {/* Rich Content Body with PortableText */}
      {caseStudy.body && (
  <section className="max-w-3xl mx-auto text-gray-200 space-y-6 leading-relaxed">
    <PortableText value={caseStudy.body} components={portableTextComponents} />
  </section>
)}
    </main>
  );
}