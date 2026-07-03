import React from 'react';

export interface ButtonProps {
  title: string;
  onPress: () => void;
}

export function Button({ title, onPress }: ButtonProps) {
  return (
    <button
      onClick={onPress}
      style={{
        padding: '8px 16px',
        backgroundColor: '#007AFF',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {title}
    </button>
  );
}