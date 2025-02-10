import React from 'react';
import  Canvas, {Image as CanvasImage } from 'react-native-canvas';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
import {View} from "react-native";

const CanvasScreen = () => {

    const handleCanvas = (canvas: any) => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'purple';
        ctx.fillRect(0, 0, 100, 100);

        const img = new CanvasImage(canvas);
        img.src = '@/assets/black-rook.png';


        img.addEventListener('load', () => {
            console.log('Canvas screen');
            ctx.drawImage(img, 50, 50, 100, 100);
        });
    };

    return (
        <ThemeChangeProvider>
            <View>
                <Canvas ref={handleCanvas} />
            </View>
        </ThemeChangeProvider>
    );
};

export default CanvasScreen;