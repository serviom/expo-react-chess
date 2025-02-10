import React, {FC} from "react";
import {MinWidth} from "./minWidth";

export type widthFunction = (number: number) => any;

export interface WidthProps {
    children: widthFunction,
    width: number
}

export const Width: FC<WidthProps> = ({ width, children }) => children(width);


// <div>{["Hello ", <span>World</span>, "!"]}</div>
//
// <div>
//     <MinWidth minWidth={500}>
//     {(width) => (width > 400 ? <div>width more then 400</div> : <div>width less then 400</div>)}
// </MinWidth>
// </div>

