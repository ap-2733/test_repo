import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { getData, ListItem } from "@repo/ui";

export default function App() {
  const [items, setItems] = useState(getData);

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={items}
        keyExtractor={(d) => String(d.id)}
        contentContainerStyle={styles.container}
        renderItem={({ item: d }) => (
          <ListItem
            avatarUri={d.avatarUrl}
            name={d.name}
            onDelete={() =>
              setItems((prev) => prev.filter((i) => i.id !== d.id))
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    gap: 16,
  },
});
