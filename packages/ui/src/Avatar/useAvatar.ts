import { useMemo } from "react";
import { getInitials } from "../utils/getInitials";
import { stringToColor } from "../utils/stringToColor";

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
