import { supabase } from "@/apis/supabase";
import { MAX_IMAGE_FILE_SIZE } from "@/constants/files";

export const generateSafeFileName = (file: File): string => {
  const fileExtension = file.name.split(".").pop();
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomString}.${fileExtension}`;
};

export const uploadFileToStorage = async (
  file: File,
  bucketName: string,
): Promise<string> => {
  const safeFileName = generateSafeFileName(file);

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(`/${safeFileName}`, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("파일 업로드 에러:", uploadError);
    throw new Error("파일 업로드에 실패했습니다.");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(uploadData.path);

  return publicUrl;
};

export const deleteStorageFile = async (
  url: string,
  bucketName: string,
): Promise<void> => {
  const urlMatch = url.match(new RegExp(`/${bucketName}/(.+)`));
  if (urlMatch && urlMatch[1]) {
    const filePath = urlMatch[1].replace(/^\//, "");
    console.log("삭제할 파일 경로:", filePath);

    const { data: deleteData, error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([`${filePath}`]);

    if (deleteError) {
      console.error("파일 삭제 에러:", deleteError);
      console.error("에러 상세:", JSON.stringify(deleteError, null, 2));
      throw new Error("파일 삭제에 실패했습니다.");
    } else {
      console.log("파일 삭제 성공:", deleteData);
    }
  }
};

export const validateFileSize = (file: File): boolean => {
  return file.size <= MAX_IMAGE_FILE_SIZE;
};
