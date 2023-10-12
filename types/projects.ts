import {ApiUser} from "@/types/user";

export type ApiProject = {
    id: string;
    name: string;
    description: string;
    is_public: boolean;
    homepages: string;
    members: ApiUser[];
    parent_id: string;
    parent: ApiProject;
    children: ApiProject[];

    createdAt: Date;
    updatedAt: Date;


}
