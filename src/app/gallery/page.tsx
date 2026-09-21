import { client } from "@/sanity/client";
import Image from "next/image";

export const revalidate = 30; // Revalidates the cache every 30 seconds
// Notice we grab the Sanity metadata dimensions to prevent layout shifts!
const GALLERY_QUERY = `*[_type == "galleryFolder"] | order(_createdAt desc) {
  _id,
  folderName,
  assets[]{
    _key,
    assetSource,
    image {
      asset->{
        _id,
        url,
        metadata { dimensions }
      }
    },
    externalUrl,
    mediaType,
    caption
  }
}`;

export default async function GalleryPage() {
  const folders = await client.fetch(GALLERY_QUERY);

  // Flatten all assets from all folders into one giant array for the endless grid
  const allAssets = folders.flatMap((folder: any) => 
    (folder.assets || []).map((asset: any) => ({
      ...asset,
      folderName: folder.folderName // Attach the folder name as the hover tag
    }))
  );

  return (
    <main className="w-full max-w-7xl mx-auto px-6 py-24">
      <header className="mb-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
          Archive
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
          An ongoing collection of visual experiments, brand explorations, and motion design.
        </p>
      </header>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {allAssets.map((item: any) => {
          
          // 1. Handle External Videos (Cloudinary MP4s, etc.)
          if (item.assetSource === 'external' && item.mediaType === 'video' && item.externalUrl) {
            return (
              <div key={item._key} className="relative w-full break-inside-avoid rounded-xl overflow-hidden group bg-gray-900 mb-6">
                <video 
                  src={item.externalUrl} 
                  autoPlay muted loop playsInline
                  className="w-full h-auto object-cover"
                />
                <HoverOverlay tag={item.folderName} caption={item.caption} />
              </div>
            )
          }

          // 2. Handle External Images / GIFs
          if (item.assetSource === 'external' && item.mediaType === 'image' && item.externalUrl) {
            return (
              <div key={item._key} className="relative w-full break-inside-avoid rounded-xl overflow-hidden group bg-gray-900 mb-6">
                <img 
                  src={item.externalUrl} 
                  alt={item.caption || 'Gallery item'}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <HoverOverlay tag={item.folderName} caption={item.caption} />
              </div>
            )
          }

          // 3. Handle Sanity Uploaded Images
          if (item.assetSource === 'sanity' && item.image?.asset) {
            // Use natural dimensions from Sanity to maintain aspect ratio dynamically
            const width = item.image.asset.metadata?.dimensions?.width || 1200;
            const height = item.image.asset.metadata?.dimensions?.height || 1200;
            
            return (
              <div key={item._key} className="relative w-full break-inside-avoid rounded-xl overflow-hidden group bg-gray-900 mb-6">
                <Image
                  src={item.image.asset.url}
                  alt={item.caption || 'Gallery item'}
                  width={width}
                  height={height}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <HoverOverlay tag={item.folderName} caption={item.caption} />
              </div>
            )
          }

          return null;
        })}
      </div>
    </main>
  );
}

// Helper component for the hover state
function HoverOverlay({ tag, caption }: { tag: string, caption?: string }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
        {tag}
      </p>
      {caption && (
        <h3 className="text-xl font-semibold text-white">
          {caption}
        </h3>
      )}
    </div>
  );
}