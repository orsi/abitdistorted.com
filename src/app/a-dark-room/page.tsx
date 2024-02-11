'use client';

import { useEffect } from 'react';
import { useBackgroundContext } from '../../components/BackgroundCanvas';
import Experiment4 from '../../components/Experiment4';

export default function ADarkRoom() {
    const { reset, setBackground } = useBackgroundContext();

    useEffect(() => {
        setBackground(<Experiment4 />);

        return () => {
            reset();
        };
    }, []);

    return (
        <section>
            <h1 className="hidden">A Dark Room</h1>
            <p>
                <strong>A Dark Room</strong> is a minimalist text adventure with
                unpredictable, expanding mechanics.
            </p>
            <div className="mt-2 text-xs font-thin">
                <a href="http://press.doublespeakgames.com/adr/index.html">
                    press
                </a>{' '}
                | <a href="http://adarkroom.doublespeakgames.com/">play</a>
            </div>
        </section>
    );
}
