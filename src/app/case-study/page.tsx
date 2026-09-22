import { client } from "@/sanity/client";
import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

// GROQ query to fetch all case studies, ordered by newest first
const ALL_CASES_QUERY = `*[_type == "caseStudy"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  role,
  description,
  coverImage
}`;

export default async function CasesIndexPage() {
  const caseStudies = await client.fetch(ALL_CASES_QUERY);

  return (
    <main className="w-full pb-32 text-left overflow-x-hidden">
      
      {/* Editorial Header */}
      <header className="pt-32 md:pt-48 px-6 md:px-12 lg:px-24 mb-24 md:mb-32">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-none text-white uppercase mb-8">
          Selected <br className="hidden md:block" /> Works.
        </h1>
        <div className="w-full max-w-2xl border-t border-gray-800 pt-8 mt-12">
          <p className="text-gray-400 text-lg md:text-xl font-medium tracking-wide">
            An archive of brand identity, visual design, and creative direction.
          </p>
        </div>
      </header>

      {/* Architectural Project Grid */}
      <div className="px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-24 md:gap-y-32">
          {caseStudies.map((project: any) => (
            <Link 
              key={project._id} 
              href={`/case-study/${project.slug}`}
              className="group block"
            >
              <article className="flex flex-col">
                
                {/* Image Container with B&W to Color Hover State */}
                <div className="relative w-full aspect-[4/3] mb-8 bg-[#050505] border border-white/10 overflow-hidden">
                  {project.coverImage ? (
                    <Image
                      src={urlFor(project.coverImage).width(1200).height(900).url()}
                      alt={`${project.title} cover`}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-800 text-sm font-medium tracking-widest uppercase">
                      No Image Provided
                    </div>
                  )}
                </div>

                {/* Project Metadata */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-t border-gray-800 pt-6">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-3 group-hover:text-gray-300 transition-colors">
                      {project.title}
                    </h2>
                    {project.description && (
                      <p className="text-gray-400 text-base line-clamp-2 max-w-md">
                        {project.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="shrink-0">
                    <span className="inline-block px-4 py-1.5 border border-gray-700 text-xs uppercase tracking-widest text-gray-400 font-semibold">
                      {project.role || "Project"}
                    </span>
                  </div>
                </div>

              </article>
            </Link>
          ))}
        </div>
      </div>
      
    </main>
  );
}