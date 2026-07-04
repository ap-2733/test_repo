import React, { useCallback, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { getData, ListItem } from "@repo/ui";

export default function App() {
  const [items, setItems] = useState(getData);

  const handleDelete = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <FlashList
        data={items}
        keyExtractor={(d) => String(d.id)}
        contentContainerStyle={styles.container}
        renderItem={({ item: d }) => {
          return (
            <ListItem
              key={d.id}
              id={d.id}
              avatarUri={d.avatarUrl}
              name={d.name}
              onDelete={handleDelete}
            />
          );
        }}
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
