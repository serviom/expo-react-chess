import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { colors } from "@/style/colors";

export function ConnectionChecker() {
  const [isConnected, setConnection] = useState<boolean>(true);
  const opacity = useSharedValue<number>(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnection(Boolean(state.isConnected));
    });
    NetInfo.fetch().then((state) => {
      setConnection(Boolean(state.isConnected));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    opacity.value = withTiming(isConnected ? 0 : 1, {
      duration: 300,
    });
  }, [isConnected]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      top: interpolate(opacity.value, [0, 1], [0, styles.panel.top]),
      opacity: interpolate(opacity.value, [0, 1], [0, 1]),
    };
  });

  return (
    <Animated.View style={[styles.panel, animatedStyles]}>
      <ThemedText style={styles.text}>No connection</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    width: "100%",
    backgroundColor: colors.red,
    paddingVertical: 5,
    zIndex: 100,
    height: 30,
    top: 0
  },
  text: {
    fontSize: 15,
    lineHeight: 32,
    marginTop: -6,
    textAlign: "center",
  },
});
