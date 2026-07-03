import React, { useState } from "react";
import { FlatList, StyleSheet, SafeAreaView } from "react-native";
import { Button, ListItem } from "@repo/ui";
import { faker } from "@faker-js/faker";

function getData() {
  faker.seed(123);

  const data: { id: number; name: string; avatarUrl?: string }[] = [];
  for (let i = 0; i < 30; i++) {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    data.push({
      id: i,
      name,
      avatarUrl: faker.datatype.boolean(0.8)
        ? `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`
        : undefined,
    });
  }
  return data;
}

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
