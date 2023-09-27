import {writeFile} from 'fs/promises'
import {NextRequest, NextResponse} from 'next/server'
import {prismaDB} from "@/lib/prisma";
import {getErrorResponse, getResponse} from "@/lib/utils";
import {allowedDocumentTypes, allowedTypes} from "@/lib/constants/filetypes.constants";
import sharp from "sharp";

export async function POST(request: NextRequest) {


    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
        return getErrorResponse(400, "Invalid file type");
    }

    const bytes = await file.arrayBuffer()
    let buffer = Buffer.from(bytes)

    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
    const file_size_in_bytes = buffer.length
    let file_name = file.name;
    let file_type = file.type;

    // return file_name, file_type, file_size_in_bytes, file_dimensions, file_content

    if (isImage(file)) {
        const image = sharp(buffer)
        const metadata = await image.metadata()
        const {width, height} = metadata
        const file_dimensions = {width, height}
        const file_content = await image.toBuffer()

        return getResponse(200, "Image info", {
            fileInfo: {
                file_name,
                file_type,
                file_size_in_bytes,
                file_dimensions,
            }
        })
    } else {
        return getResponse(200, "File info", {
                fileInfo: {
                    file_name,
                    file_type,
                    file_size_in_bytes,
                }
            }
        );
    }
}

const isImage = (file: File) => {
    return file.type.startsWith("image/");
}
