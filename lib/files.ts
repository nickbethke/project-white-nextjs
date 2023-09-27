import {allowedDocumentTypes} from "@/lib/constants/filetypes.constants";
import {ApiFile} from "@/types/file";

export enum FileType {
    Image,
    Document,
    Video,
    Audio,
    Other
}

export function getFileTypeEnum(fileType: string) {
    if (isImage(fileType)) {
        return FileType.Image
    } else if (isDocument(fileType)) {
        return FileType.Document
    } else if (isVideo(fileType)) {
        return FileType.Video
    } else if (isAudio(fileType)) {
        return FileType.Audio
    } else {
        return FileType.Other
    }
}

export const isImage = (fileType: string) => {
    return fileType.startsWith("image/");
}

export const isVideo = (fileType: string) => {
    return fileType.startsWith("video/");
}

export const isAudio = (fileType: string) => {
    return fileType.startsWith("audio/");
}

export const isDocument = (fileType: string) => {
    return allowedDocumentTypes.indexOf(fileType) !== -1;
}

export type FileTree = {
    folder: string;
    path: string;
    files: ApiFile[];
    folders: FileTree[];
}

export class FilesTree {

    private readonly files: ApiFile[];

    constructor(files: ApiFile[]) {
        this.files = files;
    }

    public getTree() {
        const tree: FileTree = {
            folder: "/",
            path: "/",
            files: [],
            folders: []
        }

        this.files.forEach(file => {
            const folders = file.folder.split("/").filter(folder => folder !== "");
            let currentFolder = tree;
            folders.forEach(folder => {
                const folderExists = currentFolder.folders.find(f => f.folder === folder);
                if (folderExists) {
                    currentFolder = folderExists;
                } else {
                    const newFolder: FileTree = {
                        folder: folder,
                        path: `${currentFolder.path}${folder}/`,
                        files: [],
                        folders: []
                    }
                    currentFolder.folders.push(newFolder);
                    currentFolder = newFolder;
                }
            });
            currentFolder.files.push(file);
        });

        return tree;
    }
}

