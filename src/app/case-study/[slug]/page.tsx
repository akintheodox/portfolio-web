import { client } from "@/sanity/client";
import Image from "next/image";
import Link from "next/link";
// @ts-ignore
import imageUrlBuilder from "@sanity/image-url";
import { notFound } from "next/navigation";
import { PortableText, PortableTextComponents } from '@portabletext/react';
import HorizontalGalleryTrack from "@/components/HorizontalGallery";

export const revalidate = 30;

const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
});

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
          <div className="my-12">
            <div className="relative w-full border border-white/10 bg-[#050505] overflow-hidden">
              <Image
                src={urlFor(value).width(1200).url()}
                alt={value.alt || 'Case study image'}
                width={1200}
                height={900}
                className="w-full h-auto"
              />
            </div>
            {value.caption && (
              <div className="flex items-start gap-3 mt-4 pl-1">
                <span className="text-[10px] font-mono text-gray-600 mt-0.5">//</span>
                <p className="text-xs font-mono uppercase tracking-widest text-gray-400">
                  {value.caption}
                </p>
              </div>
            )}
          </div>
        );
      },
    videoBlock: ({ value }: { value: any }) => {
        if (!value?.videoUrl) return null;
        return (
          <div className="my-12">
            <div className="relative w-full border border-white/10 bg-[#050505] overflow-hidden">
              <video
                src={value.videoUrl}
                autoPlay
                loop
                muted
                playsInline 
                className="w-full h-auto"
              />
            </div>
            {value.caption && (
              <div className="flex items-start gap-3 mt-4 pl-1">
                <span className="text-[10px] font-mono text-gray-600 mt-0.5">//</span>
                <p className="text-xs font-mono uppercase tracking-widest text-gray-400">
                  {value.caption}
                </p>
              </div>
            )}
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
      _type == "videoBlock" => {
        "videoUrl": videoFile.asset->url,
        caption
      },
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
      
      {/* 
        NOTE: The old local sticky <nav> block was deleted here. 
        The layout is now driven by your global Navigation component.
      */}

      {/* Editorial Header - Kept the pt-32 so it clears the global nav perfectly */}
      <header className="pt-32 md:pt-48 px-6 md:px-12 lg:px-24 mb-16 md:mb-24">
        {/* Scaled down, standard case title for the editorial feel */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-none text-white mb-12">
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
      
      {/* Cinematic Cover Image (Reasonable Height, No Cropping - exactly as you requested) */}
      {caseStudy.coverImage && (
        <div className="relative w-full bg-[#050505] border-y border-white/10 overflow-hidden flex items-center justify-center mb-24">
          <Image
            src={urlFor(caseStudy.coverImage).width(1920).url()}
            alt={`${caseStudy.title} cover`}
            width={1920}
            height={1080}
            className="w-full h-auto max-h-[200px] md:max-h-[75vh] object-contain"
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