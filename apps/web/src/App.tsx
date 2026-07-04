import React, { useState } from "react";
import { List, RowComponentProps, useDynamicRowHeight } from "react-window";
import { getData, ListItem } from "@repo/ui";

import styles from "./styles.module.css";

const ROW_HEIGHT = 74;

interface RowProps {
  items: ReturnType<typeof getData>;
  onDeleteItem: (id: number) => void;
}

function Row({
  index,
  style,
  items,
  onDeleteItem,
}: RowComponentProps<RowProps>) {
  const item = items[index];
  return (
    <div style={style}>
      <ListItem
        avatarUri={item.avatarUrl}
        name={item.name}
        onDelete={() => onDeleteItem(item.id)}
      />
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState(getData);

  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: ROW_HEIGHT,
  });

  const onDeleteItem = (id: number) => {
    const index = items.findIndex((i) => i.id === id);
    rowHeight.setRowHeight(index, ROW_HEIGHT);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className={styles.screen}>
      <div className={styles.list}>
        <List
          rowComponent={Row}
          rowCount={items.length}
          rowHeight={rowHeight}
          rowProps={{ items, onDeleteItem }}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
}
