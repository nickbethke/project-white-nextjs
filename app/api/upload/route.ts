import { NextRequest } from "next/server";
import { prismaDB } from "@/lib/prisma";
import { getErrorResponse, getResponse } from "@/lib/utils";
import {
  allowedDocumentTypes,
  allowedTypes,
} from "@/lib/constants/filetypes.constants";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  console.log(data.get("file"));
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return getErrorResponse(400, "Invalid file type");
  }

  const bytes = await file.arrayBuffer();
  let buffer = Buffer.from(bytes);

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const file_size_in_bytes = buffer.length;
  let file_name = file.name;
  let file_type = file.type;

  if (allowedTypes.indexOf(file_type) === -1) {
    return getErrorResponse(400, "Invalid file type");
  }

  const dbFile = await prismaDB.files.create({
    data: {
      file_name: file_name,
      file_type: file_type,
      file_size: file_size_in_bytes,
      file_content: buffer,
    },
  });

  return getResponse(200, "File uploaded", {
    file: {
      ...dbFile,
      url: `${process.env.APP_HOST}/public/uploads${
        dbFile.folder
      }${encodeURIComponent(dbFile.file_name)}`,
    },
  });
}

const isImage = (file: File) => {
  return file.type.startsWith("image/");
};

const isVideo = (file: File) => {
  return file.type.startsWith("video/");
};

const isAudio = (file: File) => {
  return file.type.startsWith("audio/");
};

const isDocument = (file: File) => {
  return allowedDocumentTypes.indexOf(file.type) !== -1;
};
