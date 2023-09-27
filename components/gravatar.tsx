import {createHash} from "crypto";
import Image from "next/image";
import {cn} from "@/lib/utils";
import React from "react";

type GravatarProps = {
    email: string;
    size?: number;
    className?: string;
    style?: React.CSSProperties;
}
export default function Gravatar(props: GravatarProps) {

    const {email, size = 40, className, style} = props;
    const hash = createHash("md5").update(email).digest("hex");
    return (
        <Image
            src={`https://www.gravatar.com/avatar/${hash}?s=${size}`}
            alt="avatar gravatar"
            width={size}
            height={size}
            className={cn("rounded-full", className)}
            style={style}
        />
    )
}
