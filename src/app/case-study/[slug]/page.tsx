import { client } from "@/sanity/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { notFound } from "next/navigation";

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

// GROQ query to fetch a case study by its slug
const CASE_STUDY_QUERY = `*[_type == "caseStudy" && slug.current == $slug][0]{
  title,
  role,
  deliverables,
  coverImage
}`;

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await client.fetch(CASE_STUDY_QUERY, { slug });

  if (!project) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-4">{project.title}</h1>
      {project.role && (
        <p className="text-lg text-neutral-500 mb-6">{project.role}</p>
      )}

      {project.deliverables && project.deliverables.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm uppercase tracking-wider text-neutral-400 font-semibold mb-3">
            Deliverables
          </h2>
          <ul className="flex flex-wrap gap-2">
            {project.deliverables.map((item: string, index: number) => (
              <li
                key={index}
                className="bg-neutral-100 text-neutral-800 text-sm px-3 py-1 rounded-full"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.coverImage && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-200">
          <Image
            src={urlFor(project.coverImage).width(1200).url()}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
    </main>
  );
}