import React from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { useAvatar } from "./useAvatar";

export interface AvatarProps {
  uri?: string;
  name?: string;
}

export function Avatar({ uri, name }: AvatarProps) {
  const { initials, backgroundColor } = useAvatar(name);
  const dimensionStyle = { width: 48, height: 48, borderRadius: "50%" };

  if (uri) {
    return <Image source={{ uri }} style={dimensionStyle} />;
  }

  return (
    <View style={[styles.fallback, { backgroundColor }, dimensionStyle]}>
      <Text style={[styles.initials]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 19,
  },
});
