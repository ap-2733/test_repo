import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Avatar } from "../Avatar";
import { ListItemProps } from "./types";

const SWIPE_THRESHOLD = 120;
const ITEM_HEIGHT = 74;
const SCREEN_WIDTH = Dimensions.get("window").width;

export function ListItem({ id, avatarUri, name, onDelete }: ListItemProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const itemHeight = useRef(new Animated.Value(ITEM_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 5,
      onPanResponderMove: Animated.event([null, { dx: translateX }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > SWIPE_THRESHOLD) {
          const direction = Math.sign(gesture.dx);
          Animated.timing(translateX, {
            toValue: direction * SCREEN_WIDTH,
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            Animated.parallel([
              Animated.timing(itemHeight, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
            ]).start(() => {
              itemHeight.setValue(ITEM_HEIGHT);
              opacity.setValue(1);
              translateX.setValue(0);
              onDelete(id);
            });
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Animated.View style={[styles.wrapper, { height: itemHeight, opacity }]}>
      <View style={styles.background} />
      <Animated.View
        style={[styles.foreground, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <Avatar uri={avatarUri} name={name} />
        <Text style={styles.title}>{name}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    overflow: "hidden",
  },
  background: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "indianred",
  },
  foreground: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: ITEM_HEIGHT,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
