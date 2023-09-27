import {Metadata} from "next";
import {Separator} from "@/components/ui/separator";
import {FilesOverview} from "./components/files-overview";
import {NewFileDialog} from "@/components/dialogs/new-file-dialog";

export function generateMetadata(): Metadata {
    return {
        title: `Files | ${process.env.NEXT_PUBLIC_APP_NAME}`,
        description: 'Files',
    }
}

export default function FilesPage() {
    return (
        <div className="flex flex-col gap-4 p-4 mr-0">
            <h1 className="text-2xl font-bold flex gap-2 items-baseline">
                Files
            </h1>
            <Separator/>
            <FilesOverview/>
        </div>
    )
}
