'use client';

import { useEffect } from 'react';
import { useBackgroundContext } from '../components/BackgroundCanvas';
import Experiment1 from '../components/Experiment1';

export default function Home() {
    const { setBackground } = useBackgroundContext();
    useEffect(() => {
        setBackground(<Experiment1 />);
    }, [setBackground]);

    return (
        <section>
            <h1 className="">
                <div>a</div>
                <div>bit</div>
                <div>distorted</div>
            </h1>
            <p className="text-xs text-slate-300 font-thin">
                an audio visual web agency
            </p>
        </section>
    );
}
