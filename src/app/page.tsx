import BackgroundCanvas from '../components/BackgroundCanvas';

export default function App() {
    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                }}
            >
                <BackgroundCanvas />
            </div>
            <main
                style={{
                    position: 'relative',
                    zIndex: '2',
                    margin: '0 auto',
                    maxWidth: '600px',
                    padding: '24px',
                }}
            >
                <h1>a bit distorted</h1>
                <p>
                    <em>a digital agency in Toronto</em>
                </p>

                <br />
                <br />

                <h2>Jon's Tuner</h2>
                <strong>Privacy Policy</strong>
                <p>
                    Jon's Tuner records audio from your microphone to analyze
                    and display musical note and frequency information. All
                    recorded audio never leaves your device and is not saved.
                </p>
                <div
                    style={{
                        height: '1200px',
                    }}
                ></div>
            </main>
        </>
    );
}
