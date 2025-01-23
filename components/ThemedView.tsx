import {StyleSheet, View, type ViewProps} from 'react-native';

import React from "react";
import {useTheme} from "@rneui/themed";

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
});

export const ThemedView = ({ children, style, ...otherProps }: ViewProps) => {
  const { theme } = useTheme();

  return (
      <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
            style
          ]}

          {...otherProps}
      >
        {children}
      </View>
  );
};
