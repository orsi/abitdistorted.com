import "./reset.css";
import "./global.css";
// import { useLastInput } from "./useLastInput";
import { Navigation } from "./Navigation";
import { Terminal } from "./Terminal";

// function Test() {
//   const lastInput = useLastInput();
//   return <small class="font-smaller">last input: {lastInput}</small>;
// }

export default function App() {
  return (
    <div class="container-md py-4 px-2">
      <header>
        <Navigation />
      </header>
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        {/* <nav style={{ fontSize: "var(--font-size-smaller)" }}>
          commands: <a href="/about">about</a>
        </nav> */}
      </div>
      <main>
        <p class="color-grey mt-2">Currently available commands: "about", "clear"</p>
        <div
          class="p-2"
          style={{
            border: "1px dashed var(--color-grey)",
            margin: "var(--spacing-2) 0",
          }}
        >
          <Terminal />
        </div>
      </main>
    </div>
  );
}
