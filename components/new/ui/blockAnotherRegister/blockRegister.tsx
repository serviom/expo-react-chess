import React from "react";
import {Link} from "expo-router";
import {Text} from "@rneui/themed";
import {Href} from "expo-router/build/typed-routes/types";


interface RegisterProps {
    children: React.ReactNode;
    href: Href;
}

const BlockRegister: React.FC<RegisterProps> = ({
        href,
        children
    }: RegisterProps) => {

    return (
        <Link href={href}>
            <Text>
                {children}
            </Text>
        </Link>
    );
};

export default BlockRegister;