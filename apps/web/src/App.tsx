import React, { useState } from "react";
import { getData, ListItem } from "@repo/ui";

import styles from "./styles.module.css";

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
