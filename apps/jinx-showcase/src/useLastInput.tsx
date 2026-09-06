import { useEffect, useState } from "jinx";

export function useLastInput() {
  const [lastInput, setLastInput] = useState("");

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      const inputs = [];
      if (ev.altKey) {
        inputs.push("ALT");
      }
      if (ev.ctrlKey) {
        inputs.push("CTRL");
      }
      if (ev.metaKey) {
        inputs.push("CMD");
      }
      if (ev.shiftKey) {
        inputs.push("SHIFT");
      }

      if (/^.$/u.test(ev.key)) {
        // `key` matches a single unicode character
        inputs.push(ev.key);
      }

      if (ev.key === "Backspace") {
        inputs.push(ev.key);
      }

      if (ev.key === "Enter") {
        inputs.push(ev.key);
      }

      setLastInput(inputs.join("+"));
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return lastInput;
}
