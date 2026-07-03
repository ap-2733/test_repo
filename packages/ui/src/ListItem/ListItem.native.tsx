import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "../Avatar";
import { ListItemProps } from "./types";

export function ListItem({ avatarUri, name }: ListItemProps) {
  return (
    <View style={styles.container}>
      <Avatar uri={avatarUri} name={name} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  textContainer: {
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
});
