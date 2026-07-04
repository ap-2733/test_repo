import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "../Avatar";
import { ListItemProps } from "./types";
import styles from "./styles.module.css";

const SWIPE_THRESHOLD = 120;

export function ListItem({ id, avatarUri, name, onDelete }: ListItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const foregroundRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleStart = (e: React.PointerEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    if (foregroundRef.current) {
      foregroundRef.current.style.transition = `transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)`;
    }
  };

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isDragging) {
        return;
      }
      if (foregroundRef.current) {
        foregroundRef.current.style.transform = `translateX(${e.clientX - startX}px)`;
      }
    };

    const handleEnd = (e: PointerEvent) => {
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
            wrapper.style.height = `${wrapper.offsetHeight}px`; // Lock current height

            // Force reflow
            wrapper.offsetHeight;

            wrapper.style.transition = `height 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease`;

            wrapper.style.height = "0px";
            wrapper.style.opacity = "0";
            wrapper.style.borderBottomWidth = "0px";

            setTimeout(() => {
              if (foregroundRef.current) {
                foregroundRef.current.style.transition = "none";
                foregroundRef.current.style.transform = `translateX(0px)`;
              }
              wrapper.style.transition = "none";
              wrapper.style.height = "74px";
              wrapper.style.opacity = "1";
              onDelete(id);
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

    const handleCancel = () => {
      if (!isDragging) return;
      setIsDragging(false);
      if (foregroundRef.current) {
        foregroundRef.current.style.transform = `translateX(0px)`;
      }
    };

    window.addEventListener("pointermove", handleMove); // Window to catch fast drags
    window.addEventListener("pointerup", handleEnd);
    window.addEventListener("pointercancel", handleCancel);

    return () => {
      window.removeEventListener("pointermove", handleMove); // Window to catch fast drags
      window.removeEventListener("pointerup", handleEnd);
      window.removeEventListener("pointercancel", handleCancel);
    };
  }, [isDragging, startX]);

  return (
    <div ref={wrapperRef} className={styles.container}>
      <div className={styles.background}>
        <span>🗑 Delete</span>
        <span>Delete 🗑</span>
      </div>
      <div
        ref={foregroundRef}
        className={styles.foreground}
        onPointerDown={handleStart}
      >
        <Avatar uri={avatarUri} name={name} />
        <span className={styles.text}>{name}</span>
      </div>
    </div>
  );
}
