import { useState } from "jinx";

const BIRTHDATE = new Date("1986-10-02");
const NOW = new Date();
const AGE = (NOW.getTime() - BIRTHDATE.getTime()) / 1000 / 60 / 60 / 24 / 365; // milliseconds -> years

export function Navigation() {
  const [showDateNote, setShowDateNow] = useState(false);

  // useEffect(() => {
  //   const onKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === "Escape") {
  //       setShowTerminal((value) => !value);
  //     }
  //   };
  //   document.addEventListener("keydown", onKeyDown);
  //   return () => {
  //     document.removeEventListener("keydown", onKeyDown);
  //   };
  // }, []);

  // const onClickCopyEmail = (_e: Event) => {
  //   navigator.clipboard.writeText("jonathon.orsi@gmail.com");
  // };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
      }}
    >
      <div style={{ gridColumn: "span 5" }}>
        <h1
          class="font-normal"
          onMouseenter={() => setShowDateNow(true)}
          onMouseleave={() => setShowDateNow(false)}
          style={{
            position: "relative",
            wordBreak: "break-all",
            lineHeight: "1",
          }}
        >
          jonathon orsi v{AGE.toFixed(1)}
          <em
            style={{
              background: "hsla(0, 0%, 0%, .7)",
              border: "1px solid hsla(0, 0%, 100%, .7)",
              display: showDateNote ? "block" : "none",
              fontSize: ".75rem",
              position: "absolute",
              padding: "var(--spacing-2)",
              top: "var(--spacing-4)",
              left: "var(--spacing-4)",
              wordBreak: "break-word",
            }}
          >
            Only {Math.ceil((1 - (AGE - Math.floor(AGE))) * 365)} days until I'm{" "}
            {Math.ceil(AGE)} 🥳
          </em>
        </h1>
        <small class="font-smaller">
          Copyright (C) 1986-{NOW.getFullYear()}
        </small>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gridColumn: "span 7",
        }}
      >
        {/* SECTIONS/"PROGRAMS" */}
        {/* <nav style={{ display: "flex", gap: "var(--spacing-2)" }}>
            <a href="#about">about</a>
            <a href="#xp">experience</a>
            <a href="#contact">contact</a>
          </nav> */}

        {/* ICON TRAY */}
        <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
          {/* <button
              onClick={onClickCopyEmail}
              style={{
                background: "transparent",
                border: "none",
                display: "block",
                height: "24px",
                padding: "0",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                style={{ height: "100%" }}
              >
                <rect
                  stroke="white"
                  x="8"
                  y="4"
                  width="12"
                  height="12"
                  rx="2"
                  ry="2"
                />
                <rect
                  stroke="white"
                  x="5"
                  y="8"
                  width="12"
                  height="12"
                  rx="2"
                  ry="2"
                />
              </svg>
            </button> */}
          <a href="https://github.com/orsi" target="_blank" rel="noopener">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height="16"
            >
              <path
                fill="white"
                d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943"
              ></path>
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/jonorsi"
            target="_blank"
            rel="noopener"
          >
            <svg
              fill="white"
              height="16"
              viewBox="0 0 32 32"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>linkedin</title>
              <path d="M28.778 1.004h-25.56c-0.008-0-0.017-0-0.027-0-1.199 0-2.172 0.964-2.186 2.159v25.672c0.014 1.196 0.987 2.161 2.186 2.161 0.010 0 0.019-0 0.029-0h25.555c0.008 0 0.018 0 0.028 0 1.2 0 2.175-0.963 2.194-2.159l0-0.002v-25.67c-0.019-1.197-0.994-2.161-2.195-2.161-0.010 0-0.019 0-0.029 0h0.001zM9.9 26.562h-4.454v-14.311h4.454zM7.674 10.293c-1.425 0-2.579-1.155-2.579-2.579s1.155-2.579 2.579-2.579c1.424 0 2.579 1.154 2.579 2.578v0c0 0.001 0 0.002 0 0.004 0 1.423-1.154 2.577-2.577 2.577-0.001 0-0.002 0-0.003 0h0zM26.556 26.562h-4.441v-6.959c0-1.66-0.034-3.795-2.314-3.795-2.316 0-2.669 1.806-2.669 3.673v7.082h-4.441v-14.311h4.266v1.951h0.058c0.828-1.395 2.326-2.315 4.039-2.315 0.061 0 0.121 0.001 0.181 0.003l-0.009-0c4.5 0 5.332 2.962 5.332 6.817v7.855z" />
            </svg>
          </a>
          {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <defs>
                <mask id="crescent">
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  <circle fill="black" r="6" cx={cx} cy={cy} />
                </mask>
              </defs>
              <circle
                fill="white"
                r="12"
                cx="12"
                cy="12"
                mask="url(#crescent)"
              />
            </svg> */}
        </div>
      </div>
    </div>
  );
}
