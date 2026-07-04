import React, { useState } from "react";
import { useAvatar } from "./useAvatar";

export interface AvatarProps {
  uri?: string;
  name?: string;
}

export function Avatar({ uri, name }: AvatarProps) {
  const { initials, backgroundColor } = useAvatar(name);

  const [checkedUri, setCheckedUri] = useState(uri);

  if (checkedUri) {
    return (
      <img
        src={checkedUri}
        alt={name ?? "Avatar"}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
        draggable={false}
        onError={() => {
          setCheckedUri("");
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        backgroundColor,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: "19px",
      }}
    >
      {initials}
    </div>
  );
}
