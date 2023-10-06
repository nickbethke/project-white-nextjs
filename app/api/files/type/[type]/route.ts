import { NextRequest, NextResponse } from "next/server";
import { prismaDB } from "@/lib/prisma";
import { FileType } from "@/lib/files";
import {
  allowedAudioTypes,
  allowedDocumentTypes,
  allowedImageTypes,
  allowedTypes,
  allowedVideoTypes,
} from "@/lib/constants/filetypes.constants";
import { getResponse } from "@/lib/utils";
import { forEach } from "lodash";

export async function GET(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  // enum values
  const types = params.type
    .split("|")
    .map((type) => Number.parseInt(type)) as FileType[];
  const realFileTypes: string[] = [];
  if (types.length === 0) {
    forEach(allowedTypes, (type) => {
      realFileTypes.push(type);
    });
  }

  forEach(types, (type) => {
    switch (type) {
      case FileType.Image:
        forEach(allowedImageTypes, (imageType) => {
          realFileTypes.push(imageType);
        });
        break;
      case FileType.Video:
        forEach(allowedVideoTypes, (videoType) => {
          realFileTypes.push(videoType);
        });
        break;
      case FileType.Audio:
        forEach(allowedAudioTypes, (audioType) => {
          realFileTypes.push(audioType);
        });
        break;
      case FileType.Document:
        forEach(allowedDocumentTypes, (documentType) => {
          realFileTypes.push(documentType);
        });
        break;
    }
  });

  const files = await prismaDB.files.findMany({
    where: {
      file_type: {
        in: realFileTypes,
      },
    },
    select: {
      id: true,
      file_name: true,
      file_type: true,
      file_size: true,
      createdAt: true,
      updatedAt: true,
      folder: true,
      file_content: false,
    },
  });

  const filesWithUrl = files.map((file) => {
    return {
      ...file,
      url: `${process.env.APP_HOST}/public/uploads${
        file.folder
      }${encodeURIComponent(file.file_name)}`,
    };
  });

  return getResponse(200, "Files", { files: filesWithUrl });
}
