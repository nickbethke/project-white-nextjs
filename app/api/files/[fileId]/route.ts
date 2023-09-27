import {NextRequest, NextResponse} from "next/server";
import {prismaDB} from "@/lib/prisma";

export async function GET(req: NextRequest, {params}: { params: { fileId: string } }) {

    const isDownload = req.nextUrl.searchParams.has("download");

    const file = await prismaDB.files.findUnique({
        where: {
            id: params.fileId
        }
    });

    if (!file) {
        return new NextResponse(null, {
            status: 404
        })
    }
    let headers: HeadersInit = {
        'Content-Type': file.file_type,
        'Content-Length': file.file_size.toString(),
    }

    if (isDownload) {
        headers = {
            ...headers,
            'Content-Disposition': `attachment; filename="${file.file_name}"`
        }
    }

    return new NextResponse(file.file_content, {
        headers: headers,
        status: 200
    })
}
