import './App.css';
import { createSignal, For } from 'solid-js';

const TITLE = 'awe ofijwaef' //a bit distorted';
function App() {
    const [title, setTitle] = createSignal('');

    let lastUpdate = 0;
    function update(time: number) {
        if (time - lastUpdate > 100 + Math.random() * 500) {
            setTitle(TITLE.substring(0, title().length + 1));
            lastUpdate = time;
        }

        if (title().length !== TITLE.length) {
            requestAnimationFrame(update);
        }
    }
    setTimeout(() => requestAnimationFrame(update), 1000);

    return (
        <main>
            <h1
                style={{
                    margin: '0',
                }}
            >
                <For each={title().split('')}>
                    {(char, i) => (
                        <span
                            style={{
                                display: 'inline-block',
                                'margin-top': `${Math.random() * 6}px`,
                                'margin-left': `${-1 + Math.random() * 5}px`,
                                width: '1rem',
                                position: 'relative',
                                'vertical-align': 'top',
                            }}
                        >
                            {char}
                        </span>
                    )}
                </For>
                <span class="blink">|</span>
            </h1>
        </main>
    );
}

export default App;
