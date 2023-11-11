import './App.css';
import { createSignal, For } from 'solid-js';

const TITLE = 'a bit distorted';
function App() {
    const [title, setTitle] = createSignal('');
    let titleRef: HTMLHeadingElement;

    let lastUpdate = 0;
    function type(time: number) {
        if (time - lastUpdate > 100 + Math.random() * 200) {
            setTitle(TITLE.substring(0, title().length + 1));
            lastUpdate = time;
        }

        if (title().length !== TITLE.length) {
            requestAnimationFrame(type);
        } else {
            setTimeout(() => {
                titleRef.className = 'distort';
                requestAnimationFrame(distort);
            }, 1000);
        }
    }
    setTimeout(() => requestAnimationFrame(type), 1000);

    function distort(time: number) {
        const duration = Math.random() * 500;
        if (time - lastUpdate > duration) {
            titleRef.style.setProperty('--animation-time', duration + 'ms');
            titleRef.style.setProperty(
                'filter',
                `drop-shadow(${-1 + Math.random() * 2}px ${
                    -1 + Math.random() * 2
                }px limegreen) blur(${Math.random() * 2}px)`
            );
            lastUpdate = time;
        }
        requestAnimationFrame(distort);
    }

    return (
        <main
            style={{
                'align-items': 'center',
                display: 'inline-flex',
                height: '100%',
                padding: '0 1.5rem',
            }}
        >
            <h1
                ref={titleRef}
                style={{
                    margin: '0',
                }}
            >
                <For each={title().split('')}>
                    {(char, i) => (
                        <span
                            style={{
                                display: 'inline-block',
                                'margin-top': `${Math.random() * 0.2}rem`,
                                'margin-left': `${Math.random() * 0.1}rem`,
                                position: 'relative',
                                'vertical-align': 'top',
                                'white-space': 'pre',
                            }}
                        >
                            {char}
                        </span>
                    )}
                </For>
                <span class="blink">|</span>
            </h1>
            <div class="filter" />
        </main>
    );
}

export default App;
