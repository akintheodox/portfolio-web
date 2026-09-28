import { client } from "@/sanity/client";
import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";

export const revalidate = 30;
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

// GROQ query updated to fetch deliverables
const ALL_CASES_QUERY = `*[_type == "caseStudy"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  role,
  deliverables,
  description,
  coverImage
}`;

export default async function CasesIndexPage() {
  const caseStudies = await client.fetch(ALL_CASES_QUERY);

  return (
    <main className="w-full min-h-screen bg-[#050505] text-left overflow-x-hidden pb-32">
      
      {/* Editorial Header */}
      <header className="pt-32 md:pt-48 px-6 md:px-12 lg:px-24 mb-24 md:mb-32">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-none text-white uppercase mb-8">
          Selected <br className="hidden md:block" /> Works.
        </h1>
        <div className="w-full max-w-2xl border-t border-white/10 pt-8 mt-12 flex justify-between items-end">
          <p className="text-gray-400 text-lg md:text-xl font-medium tracking-wide">
            An archive of brand identity, visual design, and creative direction.
          </p>
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500 hidden md:block">
            [{caseStudies.length} Projects]
          </span>
        </div>
      </header>

      {/* Architectural Project Grid */}
      <div className="px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-24 md:gap-y-32">
          {caseStudies.map((project: any, index: number) => (
            <Link 
              key={project._id} 
              href={`/case-study/${project.slug}`}
              className="group block"
            >
              <article className="flex flex-col h-full">
                
                {/* Image Container with B&W to Color Hover + Button Reveal */}
                <div className="relative w-full aspect-[4/3] mb-8 bg-black border border-white/10 overflow-hidden">
                  {project.coverImage ? (
                    <Image
                      src={urlFor(project.coverImage).width(1200).height(900).url()}
                      alt={`${project.title} cover`}
                      fill
                      priority={index < 2} // Optimizes LCP for the first row of images
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-800 text-sm font-medium tracking-widest uppercase">
                      No Image Provided
                    </div>
                  )}
                  
                  {/* Subtle View Project Overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
                    <span className="bg-white text-black px-6 py-3 text-xs uppercase tracking-[0.2em] font-bold translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                      View Project
                    </span>
                  </div>
                </div>

                {/* Project Metadata */}
                <div className="flex flex-col flex-1 border-t border-white/10 pt-6">
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <h2 className="text-3xl font-bold tracking-tight text-white group-hover:text-gray-300 transition-colors">
                      {project.title}
                    </h2>
                    <div className="shrink-0 text-right">
                      <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">
                        Role
                      </span>
                      <p className="text-sm text-white font-medium">{project.role || "Project"}</p>
                    </div>
                  </div>
                  
                  {project.description && (
                    <p className="text-gray-400 text-base line-clamp-2 max-w-md mb-8">
                      {project.description}
                    </p>
                  )}

                  {/* Dynamic Deliverables Tags */}
                  {project.deliverables && project.deliverables.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                      {project.deliverables.map((tag: string, i: number) => (
                        <span 
                          key={i} 
                          className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border border-white/10 text-gray-400 rounded-full group-hover:border-white/30 group-hover:text-white transition-colors duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </article>
            </Link>
          ))}
        </div>
      </div>
      
    </main>
  );
}