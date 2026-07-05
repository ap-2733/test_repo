import "@testing-library/jest-dom";

// jsdom has no PointerEvent implementation, so fireEvent.pointer* falls back
// to a bare Event whose clientX/clientY are silently dropped. Polyfill it on
// top of MouseEvent, which jsdom does support, so those fields survive.
if (typeof window.PointerEvent === "undefined") {
  class PointerEvent extends MouseEvent {}
  // @ts-expect-error -- partial PointerEvent polyfill for tests only
  window.PointerEvent = PointerEvent;
}