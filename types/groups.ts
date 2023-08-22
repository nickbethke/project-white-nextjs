import {ApiUser} from "@/types/user";

export type ApiGroup = {
    id: string,
    name: string,
    created_at: string,
    updated_at: string,
}

export type ApiGroupMember = {
    user_id: string,
    user: ApiUser,
}

export type ApiGroupWithMembers = ApiGroup & {
    group_members: ApiGroupMember[],
}
