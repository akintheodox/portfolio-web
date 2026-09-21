import { client } from "@/sanity/client";
import CanvasBoard from "@/components/CanvasBoard";

export const revalidate = 30;

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

  // Flatten the folders into a single continuous stream of assets for the board
  const allAssets = folders.flatMap((folder: any) => 
    (folder.assets || []).map((asset: any) => ({
      ...asset,
      folderName: folder.folderName 
    }))
  );

  return <CanvasBoard assets={allAssets} />;
}