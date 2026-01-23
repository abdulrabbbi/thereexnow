import axios from "@/utils/axios";
import { useState } from "react";

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const fileSize = file.size;
      const fileName = file.name;

      const totalParts = Math.ceil(fileSize / CHUNK_SIZE);

      // Step 1: Initialize the multipart upload and get an uploadId
      const presignedUrls = await getPresignedUrls(fileName, totalParts);

      const uploadPromises = [] as Array<{
        etag: string;
        uploadId: string;
        partNumber: string;
        storageUrl: string;
      }>;

      for (let part = 0; part < totalParts; part++) {
        const start = part * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, fileSize);
        const chunk = file.slice(start, end);

        const uploadedChunk = await uploadChunk(chunk, presignedUrls[part]);

        uploadPromises.push(uploadedChunk);
      }

      // Wait for all chunks to upload
      await Promise.all(uploadPromises);

      const completeUpload = `<CompleteMultipartUpload>${uploadPromises
        .map(
          (item) =>
            `<Part><PartNumber>${item.partNumber}</PartNumber><ETag>${item.etag}</ETag></Part>`
        )
        .join("")}</CompleteMultipartUpload>`;

      // Complete the multipart upload
      await completeMultipartUpload(
        uploadPromises[0].storageUrl,
        completeUpload
      );

      return fileName;
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
  };
}

async function getPresignedUrls(fileName: string, totalParts: number) {
  const { data: presignedUrls } = await axios.request<Array<string>>({
    method: "POST",
    url: "Upload/GetPresignedUrls",
    headers: { "Content-Type": "application/json" },
    data: { key: `files/${fileName}`, ChunkCount: totalParts },
  });

  return presignedUrls;
}

async function uploadChunk(chunk: Blob, url: string) {
  const splitedUrl = url?.split?.("?");
  const urlParams = new URLSearchParams(splitedUrl[1]);
  const uploadId: string = urlParams.get("uploadId") as string;
  const partNumber: string = urlParams.get("partNumber") as string;

  const response = await axios.request({
    url,
    data: chunk,
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });

  return {
    uploadId,
    partNumber,
    etag: response.headers["etag"],
    storageUrl: splitedUrl[0] + "?uploadId=" + uploadId,
  };
}

async function completeMultipartUpload(url: string, completeUpload: string) {
  // Here you would call an API route to finalize the upload on S3
  // This would gather all part ETAGs and call `s3.completeMultipartUpload`
  return await axios.request({
    url,
    method: "POST",
    data: completeUpload,
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
    },
  });
}
