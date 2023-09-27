import {NextRequest, NextResponse} from "next/server";
import {prismaDB} from "@/lib/prisma";
import {FileInfo} from "@/types/axios-responses";
import {getErrorResponse, getResponse} from "@/lib/utils";
import {isImage, isVideo} from "@/lib/files";
import sharp from "sharp";
import MediaInfoFactory from 'mediainfo.js'
import {ReadChunkFunc} from "mediainfo.js/src/MediaInfo";

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
