'use client';

import { useEffect } from 'react';
import { useBackgroundContext } from '../../components/BackgroundCanvas';
import Experiment3 from '../../components/Experiment3';

export default function CodeX() {
    const { setBackground } = useBackgroundContext();
    useEffect(() => {
        setBackground(<Experiment3 />);
    }, [setBackground]);

    return (
        <section>
            <h1 className="hidden">Code X</h1>
            <p>
                <strong>Code X</strong> is an interactive exploration of text,
                image and sound.
            </p>
            <div className="mt-2 text-xs font-thin">
                <a href="https://www.wmarksutherland.com/code-x">
                    instructions
                </a>{' '}
                | <a href="https://code-x.live">interact</a>
            </div>
        </section>
    );
}
