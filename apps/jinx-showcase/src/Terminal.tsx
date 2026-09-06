import "./Terminal.css";
import { useEffect, useState } from "jinx";

export function Terminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (/^.$/u.test(ev.key)) {
        // `key` matches a single unicode character
        setPrompt((value) => value + ev.key);
      } else if (ev.key === "Backspace") {
        setPrompt((value) => value.substring(0, value.length - 1));
      } else if (ev.key === "Enter" && prompt.trim().length > 0) {
        setPrompt("");
        setLines((value) => {
          let newValue = [...value];

          if (prompt.toLowerCase() === "about") {
            newValue.push(
              `Hi, my name is Jonathon Orsi! Thanks for visiting my very experimental website. Not only is it my portfolio site, but it is a test subject for learning new tech and a lot of my own side projects. For instance, instead of using React, I created "jinx" to learn what React is, what it does, and how it would be implemented.`,
              "",
              `As a professional software developer, I've spent most of my career working on problems that sit somewhere between product engineering and platform engineering. I like building features, but I tend to gravitate toward the work that makes everyone else's job easier: design systems, shared infrastructure, developer tooling, architecture, and modernizing codebases that have grown difficult to work in.`,
              "",
              `At Meltwater, I led the engineering portion of the Fjord design system, which is now used by more than 500 developers. For Bombardier, I built internal software, where I learned how to design and development systems from complicated business processes. And while at Thrillworks, I worked on everything from financial platforms running on AWS to large ecommerce and headless CMS implementations.`,
              "",
              `Outside of work I still write software because it's fun. Some of my side projects include a compiler, a CHIP-8 emulator, and a handful of graphics and audio experiments. I've also written audio engines and composed music for indie games. Those projects aren't directly related to my day job, but they've made me a better engineer by forcing me to think about software from different angles.`,
              "",
            );
          } else if (prompt.toLowerCase() === "clear") {
            newValue = [];
          } else {
            newValue.push(`Unknown command: ${prompt}`);
          }

          setTimeout(() => {
            window.scrollTo({
              top: document.body.clientHeight,
              behavior: "smooth",
            });
          }, 0);
          return newValue;
        });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [prompt]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <ul style={{ listStyle: "none", margin: "0", padding: "0" }}>
        {lines.map((line) => (
          <li
            style={{
              margin: "0",
              minHeight: "1rem",
            }}
          >
            <pre style={{ whiteSpace: "break-spaces" }}>{line}</pre>
          </li>
        ))}
      </ul>
      <div
        style={{
          display: "inline-flex",
          position: "relative",
          wordBreak: "break-all",
        }}
      >
        <span>$</span>
        <pre style={{ marginLeft: ".3em", whiteSpace: "break-spaces" }}>
          {prompt}
          <span class="cursor">█</span>
        </pre>
        <input
          type="text"
          name="terminal"
          value=""
          style={{
            background: "transparent",
            border: "none",
            caretColor: "transparent",
            color: "transparent",
            fontSize: "1rem",
            outline: "none",
            padding: "0",
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            width: "100%",
            zIndex: "2",
          }}
        />
      </div>
    </div>
  );
}
