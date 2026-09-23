"use server";

import { createClient } from "next-sanity";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false, 
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function submitBioDraft(bioContent: string) {
  if (!bioContent || bioContent.trim().length === 0) {
    return { success: false, error: "Bio cannot be empty." };
  }

  try {
    await writeClient.create({
      _type: "bioSubmission",
      content: bioContent.trim(),
    });
    return { success: true };
  } catch (error) {
    console.error("Sanity Write Error:", error);
    return { success: false, error: "Failed to submit bio." };
  }
}

// NEW: Fetch the most recently approved bio
export async function getLatestApprovedBio() {
  const query = `*[_type == "bioSubmission" && isApproved == true] | order(_createdAt desc)[0]`;
  try {
    const bio = await writeClient.fetch(query);
    return bio;
  } catch (error) {
    console.error("Failed to fetch bio:", error);
    return null;
  }
}