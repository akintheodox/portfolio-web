import { client } from "@/sanity/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { notFound } from "next/navigation";
import { PortableText, PortableTextComponents } from '@portabletext/react';
import HorizontalGalleryTrack from "@/components/HorizontalGallery";

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-16 mb-8 text-white">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-16 mb-6 text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-semibold tracking-tight mt-12 mb-4 text-white">{children}</h3>,
    normal: ({ children }) => <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-3xl">{children}</p>,
  },
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset?._ref) return null;
      return (
        // Breaks out of the container to span edge-to-edge. No backgrounds or borders so PNGs float cleanly.
        <div className="relative w-[100vw] left-1/2 -translate-x-1/2 my-24 px-4 md:px-12 flex justify-center">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || 'Case study image'}
            width={1920}
            height={1080}
            className="w-full h-auto max-h-[90vh] object-contain"
          />
        </div>
      );
    },
    horizontalGallery: ({ value }: { value: any }) => {
      if (!value?.images) return null;
      return <HorizontalGalleryTrack images={value.images} />;
    }
  },
};

// Added 'description' to the GROQ Query
const CASE_STUDY_QUERY = `*[_type == "caseStudy" && slug.current == $slug][0]{
  title,
  description,
  role,
  deliverables,
  coverImage,
  sections[]{
    sectionTitle,
    "sectionId": sectionId.current,
    content[]{
      ...,
      _type == "horizontalGallery" => {
        "images": images[]{
          _key,
          alt,
          caption,
          "asset": {
            "url": asset->url
          }
        }
      }
    }
  }
}`;

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudy = await client.fetch(CASE_STUDY_QUERY, { slug });

  if (!caseStudy) notFound();

  return (
    <main className="w-full pb-32 text-left overflow-x-hidden">
      
      {/* 1. Full-Bleed Cinematic Cover Image */}
      {caseStudy.coverImage && (
        <div className="relative w-full h-[60vh] md:h-screen mb-16 md:mb-32">
          <Image
            src={urlFor(caseStudy.coverImage).url()}
            alt={`${caseStudy.title} cover`}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* 2. Edge-to-Edge Typography Header */}
      <header className="px-6 md:px-12 lg:px-24 mb-32">
        <h1 className="text-[12vw] md:text-[9vw] font-bold tracking-tighter leading-none mb-16 text-white uppercase">
          {caseStudy.title}
        </h1>
        
        {/* Metadata Grid with new Description section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-gray-300 border-t border-gray-800 pt-12">
          <div className="md:col-span-3">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-bold">Role</h3>
            <p className="text-lg">{caseStudy.role}</p>
          </div>
          
          <div className="md:col-span-3">
            {caseStudy.deliverables && caseStudy.deliverables.length > 0 && (
              <>
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-bold">Deliverables</h3>
                <ul className="flex flex-col gap-2">
                  {caseStudy.deliverables.map((item: string, i: number) => (
                    <li key={i} className="text-lg">{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="md:col-span-6 lg:col-span-5 lg:col-start-8">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-bold">Project Description</h3>
            {caseStudy.description ? (
              <p className="text-lg md:text-xl leading-relaxed">{caseStudy.description}</p>
            ) : (
              <p className="text-sm text-gray-600 italic">Add a 'description' string field to your Sanity schema to populate this area.</p>
            )}
          </div>
        </div>
      </header>
      
      {/* 3. Split-Screen Narrative Layout */}
      {caseStudy.sections && caseStudy.sections.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative px-6 md:px-12 lg:px-24">
          
          {/* Sticky Timeline */}
          <aside className="lg:col-span-3">
            <div className="sticky top-28 space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-6">Index</h3>
              <nav className="flex flex-col space-y-3">
                {caseStudy.sections.map((section: any, index: number) => (
                  <a
                    key={index}
                    href={`#${section.sectionId || index}`}
                    className="text-gray-500 hover:text-white transition-colors text-sm font-medium py-1"
                  >
                    {section.sectionTitle}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-9 space-y-32">
            {caseStudy.sections.map((section: any, index: number) => (
              <section 
                key={index} 
                id={section.sectionId || index}
                className="scroll-mt-28"
              >
                {section.content && (
                  <PortableText 
                    value={section.content} 
                    components={portableTextComponents} 
                  />
                )}
              </section>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}