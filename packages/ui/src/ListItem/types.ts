export interface ListItemProps {
  id: number;
  avatarUri?: string;
  name?: string;
  onDelete: (id: number) => void;
}
