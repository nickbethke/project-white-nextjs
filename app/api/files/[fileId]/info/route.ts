import { isImage } from "@/lib/files";
import { prismaDB } from "@/lib/prisma";
import { getErrorResponse, getResponse } from "@/lib/utils";
import { FileInfo } from "@/types/axios-responses";
import { NextRequest } from "next/server";
import sharp from "sharp";

export async function GET(req: NextRequest, {params}: { params: { fileId: string } }) {


    const file = await prismaDB.files.findUnique({
        where: {
            id: params.fileId
        }
    });

    if (!file) {
        return getErrorResponse(404, "File not found");
    }

    if (isImage(file.file_type)) {
        const image = sharp(file.file_content);
        const metadata = await image.metadata();

        if (!metadata) {
            return getErrorResponse(500, "Could not get metadata");
        }

        if (!metadata.width || !metadata.height) {
            return getErrorResponse(500, "Could not get metadata");
        }
        const dimensions = {
            width: metadata.width,
            height: metadata.height
        }
        const fileInfo: FileInfo = {
            file_name: file.file_name,
            file_dimensions: dimensions,
            file_size_in_bytes: file.file_size,
            file_type: file.file_type,

        }

        return getResponse(200, "File info", {fileInfo});
    }

    const fileInfo: FileInfo = {
        file_name: file.file_name,
        file_size_in_bytes: file.file_size,
        file_type: file.file_type,
    }

    return getResponse(200, "File info", {fileInfo});
}
