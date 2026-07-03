import { useMemo } from "react";

function getInitials(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const initials =
    parts.length > 1
      ? parts[0][0] + parts[parts.length - 1][0]
      : parts[0].slice(0, 2);
  return initials.toUpperCase();
}

export function stringToColor(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }

  const hue = Math.abs(hash) % 360;
  const saturation = 35 + (Math.abs(hash >> 8) % 30); // 35-65%
  const lightness = 20 + (Math.abs(hash >> 16) % 15); // 20-35%, keeps it dark

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export interface UseAvatarResult {
  initials: string;
  backgroundColor: string;
}

export function useAvatar(name?: string): UseAvatarResult {
  return useMemo(
    () => ({
      initials: getInitials(name),
      backgroundColor: stringToColor(name ?? ""),
    }),
    [name],
  );
}
