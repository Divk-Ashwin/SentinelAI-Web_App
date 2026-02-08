import { supabase } from "@/integrations/supabase/client";

interface StorageResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

// Validate file before upload
function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Invalid file type. Only PNG and JPG are allowed." };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File too large. Maximum size is 5MB." };
  }
  
  return { valid: true };
}

// Upload screenshot to storage
// Returns a signed URL since the bucket is private for security
export async function uploadScreenshot(file: File, userId: string): Promise<StorageResult> {
  try {
    // Validate the file
    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    console.log("Uploading screenshot:", filePath);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("screenshots")
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { success: false, error: uploadError.message };
    }

    // Get a signed URL (1 hour expiry) since bucket is private
    // This is more secure for SMS screenshots which may contain sensitive info
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("screenshots")
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (signedUrlError) {
      console.error("Signed URL error:", signedUrlError);
      return { success: false, error: signedUrlError.message };
    }

    console.log("Screenshot uploaded successfully with signed URL");

    return {
      success: true,
      url: signedUrlData.signedUrl,
      path: filePath,
    };
  } catch (err) {
    console.error("Unexpected upload error:", err);
    return { success: false, error: "An unexpected error occurred during upload" };
  }
}

// Delete screenshot from storage
export async function deleteScreenshot(path: string): Promise<StorageResult> {
  try {
    console.log("Deleting screenshot:", path);

    const { error } = await supabase.storage
      .from("screenshots")
      .remove([path]);

    if (error) {
      console.error("Delete error:", error);
      return { success: false, error: error.message };
    }

    console.log("Screenshot deleted successfully");
    return { success: true };
  } catch (err) {
    console.error("Unexpected delete error:", err);
    return { success: false, error: "An unexpected error occurred during deletion" };
  }
}

// Get signed URL for private screenshot (if bucket is private)
export async function getSignedUrl(path: string, expiresIn: number = 3600): Promise<StorageResult> {
  try {
    const { data, error } = await supabase.storage
      .from("screenshots")
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error("Signed URL error:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      url: data.signedUrl,
    };
  } catch (err) {
    console.error("Unexpected error getting signed URL:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}
