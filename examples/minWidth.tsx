import {FC} from "react";
import {Width, widthFunction} from "./width";


interface minWidthProps {
    minWidth: number,
    children: widthFunction,
}

export const MinWidth: FC<minWidthProps> = ({ minWidth, children}) => {
    const width = 500;
    return  <>
                <p>
                    minWidth = {minWidth}
                </p>
                <Width width={width}>
                    {(children)}
                </Width>
            </>


};

