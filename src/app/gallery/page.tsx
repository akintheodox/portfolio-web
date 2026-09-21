import { client } from "@/sanity/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

const GALLERY_QUERY = `*[_type == "galleryItem"] | order(_createdAt desc) {
  _id,
  title,
  category,
  mediaType,
  image,
  videoUrl,
  aspectRatio
}`;

export default async function GalleryPage() {
  const items = await client.fetch(GALLERY_QUERY);

  return (
    <main className="w-full max-w-7xl mx-auto px-6 py-24">
      <header className="mb-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
          Archive
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
          An ongoing collection of visual experiments, 3D product renders, manga-style comic scenes, and brand explorations.
        </p>
      </header>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map((item: any) => {
          // Map your Sanity schema choices to Tailwind aspect ratio classes
          const aspectRatioClass = 
            item.aspectRatio === 'portrait' ? 'aspect-[3/4]' :
            item.aspectRatio === 'landscape' ? 'aspect-video' :
            'aspect-square';

          return (
            <div 
              key={item._id} 
              className={`relative w-full break-inside-avoid rounded-xl overflow-hidden group bg-gray-900 ${aspectRatioClass}`}
            >
              {/* Media Renderer */}
              {item.mediaType === 'video' && item.videoUrl ? (
                <video 
                  src={item.videoUrl} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : item.image?.asset ? (
                <Image
                  src={urlFor(item.image).width(1200).url()}
                  alt={item.title || 'Gallery experiment'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : null}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  {item.category}
                </p>
                <h3 className="text-xl font-semibold text-white">
                  {item.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}