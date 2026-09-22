"use server";

import { createClient } from "next-sanity";

// We create a specialized client here that includes your secure write token
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false, // Must be false for writing
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