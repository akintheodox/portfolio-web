import { client } from "@/sanity/client";
import Image from "next/image";
import Link from "next/link";
// @ts-ignore
import imageUrlBuilder from "@sanity/image-url";

export const revalidate = 30; 

const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
});

function urlFor(source: any) {
  return builder.image(source);
}

const ALL_CASES_QUERY = `*[_type == "caseStudy"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  role,
  deliverables,
  description,
  coverImage,
  "aspectRatio": coverImage.asset->metadata.dimensions.aspectRatio
}`;

function ProjectCard({ project, index }: { project: any; index: number }) {
  return (
    <Link href={`/case-study/${project.slug}`} className="group block w-full">
      <article className="flex flex-col">
        
        <div className="relative w-full mb-6 md:mb-8 bg-black border border-white/10 overflow-hidden group">
          {project.coverImage ? (
            <Image
              src={urlFor(project.coverImage).width(1200).url()}
              alt={`${project.title} cover`}
              width={1200}
              height={900}
              priority={index < 2}
              className="w-full h-auto group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            />
          ) : (
            <div className="w-full aspect-[4/3] flex items-center justify-center text-gray-800 text-sm font-medium tracking-widest uppercase">
              No Image Provided
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
            <span className="bg-white text-black px-6 py-3 text-xs uppercase tracking-[0.2em] font-bold translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
              View Project
            </span>
          </div>
        </div>

        <div className="flex flex-col border-t border-white/10 pt-6">
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
            <p className="text-gray-400 text-base line-clamp-2 max-w-md mb-4">
              {project.description}
            </p>
          )}

          {project.deliverables && project.deliverables.length > 0 && (
            <div className="flex flex-wrap gap-2">
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
  );
}

export default async function CasesIndexPage() {
  const caseStudies = await client.fetch(ALL_CASES_QUERY);

  const leftColumn: any[] = [];
  const rightColumn: any[] = [];
  let leftHeight = 0;
  let rightHeight = 0;

  caseStudies.forEach((project: any) => {
    const ratio = project.aspectRatio || 1.333; 
    const estimatedImageHeight = 1000 / ratio; 
    const totalEstimatedHeight = estimatedImageHeight + 250; 

    if (leftHeight <= rightHeight) {
      leftColumn.push(project);
      leftHeight += totalEstimatedHeight;
    } else {
      rightColumn.push(project);
      rightHeight += totalEstimatedHeight;
    }
  });

  return (
    <main className="w-full min-h-screen bg-[#050505] text-left overflow-x-hidden pt-32 md:pt-48 pb-32">
      <div className="px-6 md:px-12 lg:px-24">
        
        {/* MOBILE VIEW */}
        <div className="flex flex-col md:hidden gap-12">
          {caseStudies.map((project: any, index: number) => (
            <ProjectCard key={project._id} project={project} index={index} />
          ))}
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden md:flex flex-row gap-12 lg:gap-16 items-start">
          <div className="flex flex-col w-1/2 gap-12 lg:gap-16">
            {leftColumn.map((project: any, index: number) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </div>
          <div className="flex flex-col w-1/2 gap-12 lg:gap-16">
            {rightColumn.map((project: any, index: number) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}