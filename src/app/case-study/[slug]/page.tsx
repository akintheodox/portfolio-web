import { client } from "@/sanity/client";
import Image from "next/image";
import Link from "next/link";
// @ts-ignore
import imageUrlBuilder from "@sanity/image-url";
import { notFound } from "next/navigation";
import { PortableText, PortableTextComponents } from '@portabletext/react';
import HorizontalGalleryTrack from "@/components/HorizontalGallery";

export const revalidate = 30;

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-16 mb-8 text-white">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-16 mb-6 text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold tracking-tight mt-12 mb-4 text-gray-200">{children}</h3>,
    normal: ({ children }) => <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6 font-medium max-w-2xl">{children}</p>,
  },
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="relative w-full aspect-[4/3] md:aspect-video my-12 border border-white/10 bg-black overflow-hidden">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || 'Case study image'}
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
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
    <main className="w-full min-h-screen bg-[#050505] text-left pb-32">
      
      {/* Sticky Top Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <Link href="/case-study" className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors flex items-center gap-2">
          <span>←</span> Back to Works
        </Link>
        <span className="text-xs font-mono uppercase tracking-widest text-white font-bold hidden md:block">
          {caseStudy.title}
        </span>
      </nav>

      {/* Editorial Header */}
      <header className="pt-32 md:pt-48 px-6 md:px-12 lg:px-24 mb-16 md:mb-24">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-light tracking-tighter leading-none text-white uppercase mb-12">
          {caseStudy.title}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-12">
          <div className="md:col-span-1">
            <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Role</span>
            <p className="text-base text-white font-medium">{caseStudy.role}</p>
          </div>
          
          <div className="md:col-span-1">
            {caseStudy.deliverables && caseStudy.deliverables.length > 0 && (
              <>
                <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Deliverables</span>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.deliverables.map((item: string, i: number) => (
                    <span key={i} className="text-sm text-gray-300 font-medium">
                      {item}{i < caseStudy.deliverables.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="md:col-span-1">
            <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Overview</span>
            <p className="text-sm text-gray-400 leading-relaxed">{caseStudy.description}</p>
          </div>
        </div>
      </header>
      
      {/* Cinematic Cover Image */}
      {caseStudy.coverImage && (
        <div className="relative w-full aspect-video md:aspect-[21/9] bg-black border-y border-white/10 overflow-hidden mb-24">
          <Image
            src={urlFor(caseStudy.coverImage).width(1920).url()}
            alt={`${caseStudy.title} cover`}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Split-Screen Narrative Layout */}
      {caseStudy.sections && caseStudy.sections.length > 0 && (
        <div className="px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative items-start">
          
          {/* Sticky Architectural Timeline */}
          <aside className="lg:col-span-3 hidden lg:block sticky top-32">
            <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-6">Index</h4>
            <ul className="flex flex-col gap-4">
              {caseStudy.sections.map((sec: any, idx: number) => (
                <li key={idx}>
                  <a 
                    href={`#${sec.sectionId || idx}`} 
                    className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors flex items-center gap-4 group"
                  >
                    <span className="w-4 h-[1px] bg-gray-600 group-hover:bg-white transition-colors" />
                    {sec.sectionTitle}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Content Body */}
          <div className="lg:col-span-9">
            {caseStudy.sections.map((sec: any, idx: number) => (
              <section key={idx} id={sec.sectionId || idx.toString()} className="mb-24 scroll-mt-32">
                <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500 font-bold mb-8 flex items-center gap-4">
                  <span className="text-white">0{idx + 1} //</span> {sec.sectionTitle}
                </h3>
                
                {sec.content && (
                  <div className="prose prose-invert max-w-none">
                    <PortableText 
                      value={sec.content} 
                      components={portableTextComponents} 
                    />
                  </div>
                )}
              </section>
            ))}
          </div>

        </div>
      )}
    </main>
  );
}