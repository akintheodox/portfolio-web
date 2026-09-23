"use server";

import { createClient } from "next-sanity";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false, 
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitBioDraft(bioContent: string) {
  if (!bioContent || bioContent.trim().length === 0) {
    return { success: false, error: "Bio cannot be empty." };
  }

  try {
    // 1. Write to Sanity and force instant approval
    await writeClient.create({
      _type: "bioSubmission",
      content: bioContent.trim(),
      isApproved: true, 
    });

    // 2. Fire the email notification
    // Note: On Resend's free tier, the 'to' address MUST be the email you used to sign up for Resend.
    await resend.emails.send({
      from: "Portfolio Terminal <onboarding@resend.dev>",
      to: "your-actual-email@gmail.com", // REPLACE THIS WITH YOUR EMAIL
      subject: "New Identity Protocol Override!",
      text: `Someone just wrote a new bio on your portfolio:\n\n"${bioContent.trim()}"\n\nIf it's spam, go to Sanity and uncheck 'Approved for Display'.`,
    });

    // 3. Purge the Next.js cache for the homepage so the new bio shows up instantly
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Submission Error:", error);
    return { success: false, error: "Failed to process transmission." };
  }
}

export async function getAllApprovedBios() {
  const query = `*[_type == "bioSubmission" && isApproved == true] | order(_createdAt asc)`;
  try {
    const bios = await writeClient.fetch(query);
    return bios;
  } catch (error) {
    console.error("Failed to fetch bios:", error);
    return [];
  }
}