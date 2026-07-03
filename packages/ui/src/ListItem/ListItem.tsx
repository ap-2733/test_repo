import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "../Avatar";
import { ListItemProps } from "./types";
import styles from "./styles.module.css";

const SWIPE_THRESHOLD = 120;

export function ListItem({ avatarUri, name, onDelete }: ListItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const foregroundRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const handleStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isDragging) {
        return;
      }
      if (foregroundRef.current) {
        foregroundRef.current.style.transform = `translateX(${e.clientX - startX}px)`;
      }
    };

    const handleEnd = (e: MouseEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      const currentX = e.clientX - startX;
      if (Math.abs(currentX) > SWIPE_THRESHOLD) {
        // Trigger Delete
        const direction = Math.sign(currentX);
        const screenWidth = 475;

        // Animate off screen
        if (foregroundRef.current) {
          foregroundRef.current.style.transform = `translateX(${direction * screenWidth}px)`;
        }
        // Collapse height after sliding off
        setTimeout(() => {
          const wrapper = wrapperRef.current;
          if (wrapper) {
            wrapper.style.height = `${wrapperRef.current.offsetHeight}px`; // Lock current height

            // Force reflow
            wrapper.offsetHeight;

            wrapper.style.height = "0px";
            wrapper.style.opacity = "0";
            wrapper.style.borderBottomWidth = "0px";

            setTimeout(() => {
              onDelete();
            }, 300); // Matches CSS transition duration
          }
        }, 300);
      } else {
        // Spring back to center
        if (foregroundRef.current) {
          foregroundRef.current.style.transform = `translateX(0px)`;
        }
      }
    };

    window.addEventListener("mousemove", handleMove); // Window to catch fast drags
    window.addEventListener("mouseup", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove); // Window to catch fast drags
      window.removeEventListener("mouseup", handleEnd);
    };
  }, [isDragging, startX]);

  return (
    <div ref={wrapperRef} className={styles.container}>
      <div className={styles.background}></div>
      <div
        ref={foregroundRef}
        className={
          styles.foreground + " " + (!isDragging ? styles.isAnimating : "")
        }
        onMouseDown={handleStart}
      >
        <Avatar uri={avatarUri} name={name} />
        <span className={styles.text}>{name}</span>
      </div>
    </div>
  );
}
