import { NextRequest } from "next/server";
import { prismaDB } from "@/lib/prisma";
import { getResponse } from "@/lib/utils";
import { FileType } from "@/lib/files";

export const GET = async (req: NextRequest) => {
  const files = await prismaDB.files.findMany({
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
};
