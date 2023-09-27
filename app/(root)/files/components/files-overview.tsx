"use client";

import {ApiFile} from "@/types/file";
import axios from "axios";
import {IFilesResponse} from "@/types/axios-responses";
import {Button} from "@/components/ui/button";
import React from "react";
import {ChevronUp, Folder, Loader, RefreshCcw} from "lucide-react";
import {fileOverviewItemVariants, FilesOverviewItem} from "./files-overview-item";
import {FilesTree, FileTree} from "@/lib/files";
import {Separator} from "@/components/ui/separator";
import {cn} from "@/lib/utils";
import {formatBytes} from "@/lib/numbers";
import {VariantProps} from "class-variance-authority";
import {StepSlider} from "@/components/ui/step-slider";
import {NewFileDialog} from "@/components/dialogs/new-file-dialog";

export const FilesOverview = () => {

    const [files, setFiles] = React.useState<ApiFile[]>([]);
    const [tree, setTree] = React.useState<FileTree>((new FilesTree([])).getTree());
    const [loading, setLoading] = React.useState<boolean>(false);
    const [currentFolder, setCurrentFolder] = React.useState<string>("/");

    const initialSize = localStorage.getItem("fileOverviewItemSize") as VariantProps<typeof fileOverviewItemVariants>["size"] ?? "md";

    const [size, setSize] = React.useState<typeof initialSize>(initialSize);

    const [selectedFile, setSelectedFile] = React.useState<ApiFile["id"] | null>(null);

    React.useEffect(() => {
        (async () => {
            setLoading(true);
            await loadFiles();
            setLoading(false);
        })();
    }, []);

    React.useEffect(() => {
        setTree(getFolder(currentFolder, (new FilesTree(files)).getTree())!);
    }, [currentFolder, files]);

    React.useEffect(() => {
        localStorage.setItem("fileOverviewItemSize", size);
    }, [size]);

    const getFolder = (folder: string, tree: FileTree): FileTree | null => {
        if (tree.path === folder) {
            return tree;
        }

        for (const child of tree.folders) {
            const result = getFolder(folder, child);
            if (result) {
                return result;
            }
        }

        return null;
    }

    const loadFiles = async () => {
        try {
            const response = await axios.get<IFilesResponse>("/api/files");
            setFiles(response.data.data.files);
            setTree(getFolder(currentFolder, (new FilesTree(files)).getTree())!);
        } catch (e) {
            console.log(e);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col gap-4 items-center justify-center h-full py-16">
                <Loader className="animate-spin" size={32}/>
                <span className="text-muted-foreground font-bold">Loading files</span>
            </div>
        )
    }

    if (files.length === 0) {
        return (
            <div className="flex flex-col gap-4 items-center justify-center h-full">
                <span className="text-2xl font-bold">No files found</span>
                <NewFileDialog buttonVariant="default" onUploaded={async (files) => {
                    await loadFiles();
                }}/>
                <Button onClick={loadFiles}>
                    <RefreshCcw className="mr-2" size={16}/>
                    Reload
                </Button>
            </div>
        )
    }

    const renderTree = (tree: FileTree) => {
        return (
            <>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex justify-between items-center">
                        <NewFileDialog buttonVariant="outline" onUploaded={async (files) => {
                            await loadFiles();
                        }}/>
                    </div>
                    <span className="text-sm font-bold">Folders</span>
                    <Separator/>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="unStyled" size="none"
                                className={cn("rounded shadow border border-muted overflow-hidden hover:border-muted-foreground", currentFolder === "/" ? "hidden" : "")}
                                onClick={() => {
                                    goFolderUp();
                                }}>
                            <div className="flex items-center gap-2 p-4">
                                <ChevronUp size={20}/>
                            </div>
                        </Button>
                        {tree.folders.toSorted((a, b) => a.folder.localeCompare(b.folder)).map((folder) => (
                            <Button key={folder.path} variant="outline"
                                    onClick={() => {
                                        setCurrentFolder(folder.path);
                                    }}>
                                <div className="flex items-center gap-2 p-4">
                                    <Folder size={20}/>
                                    <span className="text-sm font-bold">{folder.folder}</span>
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex justify-between items-center">
                        <div className="flex items-end gap-2">
                            <span className="text-sm font-bold">Files</span>
                            <span
                                className="text-xs text-muted-foreground">({formatBytes(tree.files.map((file) => file.file_size).reduce((a, b) => a + b, 0))})</span>
                        </div>
                        <StepSlider<typeof size> steps={[
                            {label: "Small", value: "sm"},
                            {label: "Medium", value: "md"},
                            {label: "Large", value: "lg"},
                            {label: "Extra Large", value: "xl"}
                        ]} value={size} onChange={(value) => {
                            setSize(value);
                        }}/>
                    </div>
                    <Separator/>
                    <div className="flex flex-wrap items-start gap-4">
                        {tree.files.toSorted((a, b) => a.file_name.localeCompare(b.file_name)).map((file) => (
                            <FilesOverviewItem
                                size={size}
                                file={file}
                                key={file.id}
                                selected={selectedFile === file.id}
                                onClick={(file) => {
                                    if (selectedFile === file.id) {
                                        setSelectedFile(null);
                                    } else {
                                        setSelectedFile(file.id);
                                    }
                                }}/>
                        ))}
                    </div>
                </div>
            </>
        )
    }

    const goFolderUp = () => {
        setCurrentFolder(currentFolder.slice(0, -1).split("/").slice(0, -1).join("/") + "/");
    }

    console.log(tree);

    return (
        <>
            <div className="flex gap-2">
                <div
                    className="flex items-center gap-4 text-sm text-muted-foreground border border-muted-foreground/25 rounded px-2 py-1 w-full">
                    {currentFolder}
                </div>
                <Button variant="ghost" size="icon" onClick={loadFiles}>
                    <RefreshCcw size={20}/>
                </Button>
            </div>
            <div className="flex flex-col gap-2">
                {renderTree(tree)}
            </div>
        </>
    )
};
