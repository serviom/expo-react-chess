import * as MediaLibrary from 'expo-media-library';
import { useRef } from 'react';
import {View} from "react-native";
import useAuthCheck from "@/hooks/useAuthCheck";

// ...rest of the code remains same

export default function signUp() {
    const [status, requestPermission] = MediaLibrary.usePermissions();
    const imageRef = useRef<View>(null);
    // ...rest of the code remains same

    if (status === null) {
        requestPermission();
    }
    return;

    // return (
    //     <GestureHandlerRootView style={styles.container}>
    //         <View style={styles.imageContainer}>
    //             <View ref={imageRef} collapsable={false}>
    //                 <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
    //                 {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
    //             </View>
    //         </View>
    //         {/* ...rest of the code remains same */}
    //     </GestureHandlerRootView>
    // );
}
