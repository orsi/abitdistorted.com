import snes9xOsxUiImageSrc from './assets/snes9x-osx-ui.gif';
import beticalImageSrc from './assets/betical.png';
import discworldImageSrc from './assets/discworld.gif';

export default function Home() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 'var(--spacing-4)',
        zIndex: '0',
      }}
    >
      <div
        id="work"
        style={{
          paddingTop: 'var(--spacing-48)',
        }}
      />
      <h2>work</h2>
      <ul>
        <li>
          Software Engineer (L5) at{' '}
          <a href="https://www.meltwater.com" target="_blank" rel="noopener">
            Meltwater
          </a>
          , an online media, social, and consumer intelligence company.
        </li>
        <li>
          Senior Developer at{' '}
          <a href="https://bombardier.com" target="_blank" rel="noopener">
            Bombardier
          </a>
          , Canada's largest aerospace manufacturer of business jets.
        </li>
        <li>
          Lead Software Engineer at{' '}
          <a href="https://thrillworks.com" target="_blank" rel="noopener">
            Thrillworks
          </a>
          , a digital development agency specializing in web, mobile, and
          marketing solutions.
        </li>
      </ul>

      <h2
        id="online"
        style={{
          marginTop: 'var(--spacing-48)',
        }}
      >
        online
      </h2>
      <ul>
        <li>
          <a
            href="https://adarkroom.doublespeakgames.com/"
            target="_blank"
            rel="noopener"
          >
            A Dark Room
          </a>{' '}
          is an open-source, text-based, browser role-playing game. I built the
          audio engine with the Web Audio API and composed 88 original
          compositions to create a seamless, immersive audio experience.
          <div>
            <a
              href="https://github.com/doublespeakgames/adarkroom/pulls?q=+is%3Apr+author%3Aorsi+"
              target="_blank"
              rel="ooopener"
              class="contribution"
            >
              see contributions
            </a>
          </div>
          {/* <ul style={{ display: 'flex', gap: '16px', listStyle: 'none' }}>
          <li>JavaScrit</li>
          <li>Web Audio API</li>
          <li>Audio Playback Engine</li>
          <li>Sound Asset</li>
          <li>Pipeline</li>
        </ul> */}
        </li>
        <li>
          <a href="https://code-x.live/" target="_blank" rel="noopener">
            Code X
          </a>
          {` `}is a sound poem and a gallery installation piece by{' '}
          <a
            href="https://www.wmarksutherland.com/"
            target="_blank"
            rel="noopener"
          >
            W. Mark Sutherland
          </a>
          . Working with Mark, I ported his Adobe Flash version of Code X to the
          web, rebuilding the audio engine from scratch with a custom DSP chain
          — convolution reverb, wave shaping, and mouse-driven pitch and stereo
          panning.
        </li>
        <li>
          <a href="https://jojogun.ca" target="_blank" rel="noopener">
            jojogun.ca
          </a>{' '}
          is the the online presence of Jo Jo Gun and the Bullets. I setup,
          built, and deployed the site in AWS. Frontend crafted in React,
          brought to life through a procedural glitch animation system.
        </li>
      </ul>

      <h2
        id="education"
        style={{
          marginTop: 'var(--spacing-48)',
        }}
      >
        education
      </h2>
      <ul>
        <li>
          Digital Media,{' '}
          <a href="https://www.ocadu.ca/" target="_blank" rel="noopener">
            OCAD University
          </a>
          .
        </li>
        <li>
          Computer Programming and Analysis,{' '}
          <a href="https://www.georgebrown.ca/" target="_blank" rel="noopener">
            George Brown Polytechnic
          </a>
          .
        </li>
        <li>
          HBa, Latin and Philosophy,{' '}
          <a href="https://www.utoronto.ca/" target="_blank" rel="noopener">
            University of Toronto
          </a>
          .
        </li>
      </ul>

      <h2
        id="projects"
        style={{
          marginTop: 'var(--spacing-48)',
        }}
      >
        side projects
      </h2>
      <ul>
        <li>
          <a href="https://github.com/orsi/jinx" target="_blank" rel="noopener">
            jinx
          </a>{' '}
          is a barebones, reactive, functional JSX library for building
          web-based UI in Javascript. This site is built completely with jinx.
        </li>
        <li>
          <a
            href="https://github.com/orsi/roxanne"
            target="_blank"
            rel="noopener"
          >
            roxanne
          </a>{' '}
          is an experimental language compiler written in C.
        </li>
        <li>
          <a
            href="https://github.com/orsi/chromatic-tuner"
            target="_blank"
            rel="noopener"
          >
            Chromatic Tuner
          </a>{' '}
          was released in August 2022 on the App Store and Google Play as a
          React Native iOS/Android mobile application for tuning instruments.
        </li>
        <li>
          <a
            href="https://github.com/orsi/chip-8c"
            target="_blank"
            rel="noopener"
          >
            chip-8c
          </a>{' '}
          is an emulator for the CHIP-8 interpreted programming language
          developed for 8-bit machines in the 1970s.
        </li>
        <li>
          <a
            href="https://github.com/orsi/react-gamin"
            target="_blank"
            rel="noopener"
          >
            react-gamin
          </a>{' '}
          is a library for creating browser games in the functional, hook-based
          React way.
        </li>
        <li>
          <a
            href="https://github.com/orsi/simpleeq"
            target="_blank"
            rel="noopener"
          >
            SimpleEQ
          </a>{' '}
          is a C++ audio plugin created with the JUCE framework.
        </li>
        <li>
          <a
            href="https://github.com/orsi/zen-html"
            target="_blank"
            rel="noopener"
          >
            zen-html
          </a>{' '}
          is a Javascript, template string based, component library for
          rendering HTML elements.
        </li>
      </ul>

      <h2
        id="open-source"
        style={{
          marginTop: 'var(--spacing-48)',
        }}
      >
        open source
      </h2>
      <ul>
        <li>
          <a href="https://deno.com/" target="_blank" rel="noopener">
            deno
          </a>
          , a modern JavaScript/TypeScript runtime. I contributed async TLS
          networking in Rust, working across the JS-to-Rust op layer with Tokio.
          Code reviewed by Ryan Dahl (creator of Node.js and Deno).{' '}
          <div>
            <a
              href="httdivs://github.com/denoland/deno/pull/3007"
              target="_blank"
              rel="ooopener"
              class="contribution"
            >
              see contributions
            </a>
          </div>
          {/* <ul style={{ display: 'flex', gap: '16px', listStyle: 'none' }}>
          <li>Rust</li>
          <li>Javascript/Typescript</li>
          <li>Tokio</li>
          <li>tokio-rustls</li>
          <li>Async/Futures</li>
          <li>TLS</li>
        </ul> */}
        </li>
        <li>
          <img
            src={snes9xOsxUiImageSrc}
            alt="The image shows the Snes9x emulator's settings UI."
          />
          <a href="https://www.snes9x.com/" target="_blank" rel="noopener">
            Snes9x
          </a>{' '}
          is a portable, freeware Super Nintendo Entertainment System (SNES)
          emulator. Contributed to the macOS port of Snes9x, redesigning the
          preferences UI to native macOS conventions, and extending the
          preferences system with new user-facing controls in Objective-C/Cocoa.
          <div>
            <a
              href="https://github.com/snes9xgit/snes9x/pulls?q=is%3Apr+author%3Aorsi+"
              target="_blank"
              rel="ooopener"
              class="contribution"
            >
              see contributions
            </a>
          </div>
          {/* <ul style={{ display: 'flex', gap: '16px', listStyle: 'none' }}>
          <li>Objective-C</li>
          <li>Cocoa</li>
          <li>AppKit</li>
        </ul> */}
        </li>
        <li>
          <a
            href="https://github.com/ZaneDubya/UltimaXNA"
            target="_blank"
            rel="noopener"
          >
            UltimaXNA
          </a>
          : Open-source Ultima Online client in C#/XNA. Contributed spellbook
          and in-game features, from UI to reverse-engineered client-server
          packet handling.
          <div>
            <a
              href="https://github.com/ZaneDubya/UltimaXNA/pulls?q=is%3Apr+author%3Aorsi+"
              target="_blank"
              rel="ooopener"
              class="contribution"
            >
              see contributions
            </a>
          </div>
          {/* <ul style={{ display: 'flex', gap: '16px', listStyle: 'none' }}>
          <li>C#</li>
          <li>XNA</li>
          <li>TCP/IP</li>
          <li>UTF-8 Serialization</li>
          <li>Binary Protocol Parsing</li>
        </ul> */}
        </li>
      </ul>

      <h2>procedural art</h2>
      <ul>
        <li>
          <img
            alt="An overview of a procedurally generated 'disc' world, with varying colours representing different biomes."
            src={discworldImageSrc}
            style={{ width: '100%' }}
          />
          <a
            href="https://github.com/orsi/discworld"
            target="_blank"
            rel="noopener"
          >
            discworld
          </a>{' '}
          procedurally generates a dynamic world, simulating 13 colourful biomes
          from an initial text seed.
        </li>
        <li>
          <img
            src={beticalImageSrc}
            alt="A passage from betical, displaying a poem-like structure composed of unrecognizable letters."
          />
          <a
            href="https://github.com/orsi/betical"
            target="_blank"
            rel="noopener"
          >
            betical
          </a>
          , a born-digital paragraph generator composed with remixed typed
          assemblage-letters. co-created with{' '}
          <a href="https://genericpronoun.com/" target="_blank" rel="noopener">
            Dani Spinosa
          </a>
          .
        </li>
      </ul>
    </main>
  );
}
