import Image from "next/image";
import React from "react";
import {cn} from "@/lib/utils";
import {ApiUser} from "@/types/user";
import md5 from "@/lib/md5";

type UserProfilePictureProps = {
    user: ApiUser;
    size?: number;
    className?: string;
    style?: React.CSSProperties;
}
export const UserProfilePicture = ({user, ...props}: UserProfilePictureProps) => {
    const {size = 40} = props;
    return (
        <Image
            src={user.profile_picture === 'gravatar' ? `https://www.gravatar.com/avatar/${md5(user.email)}?s=${size}&d=mp` : user.profile_picture}
            alt="avatar"
            className={cn('rounded-full', props.className)}
            style={{
                height: size,
                width: size,
                ...props.style
            }}
            width={size}
            height={size}
        />
    )
};
