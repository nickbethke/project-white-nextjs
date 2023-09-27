import {NextRequest, NextResponse} from "next/server";
import {prismaDB} from "@/lib/prisma";

export async function GET(req: NextRequest, {params}: { params: { path: string } }) {

    const isDownload = req.nextUrl.searchParams.has("download");

    const folder = params.path.split("/").slice(0, -1).join("/");
    const file_name = params.path.split("/")[0];

    const file = await prismaDB.files.findUnique({
        where: {
            folder,
            file_name
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
        "Cache-Control": "public, max-age=31536000, immutable"
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
