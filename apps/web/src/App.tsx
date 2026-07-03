import React, { useState } from "react";
import { ListItem } from "@repo/ui";
import { faker } from "@faker-js/faker";

import styles from "./styles.module.css";

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
    <div className={styles.screen}>
      <div className={styles.list}>
        {items.map((d) => (
          <ListItem
            key={d.id}
            avatarUri={d.avatarUrl}
            name={d.name}
            onDelete={() =>
              setItems((prev) => prev.filter((i) => i.id !== d.id))
            }
          />
        ))}
      </div>
    </div>
  );
}
