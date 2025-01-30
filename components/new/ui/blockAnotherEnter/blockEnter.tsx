import React from "react";
import {Link} from "expo-router";
import {Text} from "@rneui/themed";
import {Href} from "expo-router/build/typed-routes/types";


interface BlockProps {
    children: React.ReactNode;
    href: Href;
}

const BlockEnter: React.FC<BlockProps> = ({
        href,
        children
    }: BlockProps) => {

    return (
        <Link href={href}>
            {children}
            <Text>
                {children}
            </Text>
        </Link>
    );
};

export default BlockEnter;