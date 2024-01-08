import { useEffect } from 'react';

export function useFrame(
    fn: () => void,
    ms?: number,
    dependencies?: unknown[]
) {
    useEffect(() => {
        let frame = 0;
        let lastUpdate = 0;

        function update(time: number) {
            const now = time;
            if (ms === undefined) {
                fn();
                lastUpdate = now;
            } else if (now - lastUpdate > ms) {
                fn();
                lastUpdate = now;
            }
            frame = requestAnimationFrame(update);
        }

        frame = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(frame);
        };
    }, [dependencies]);
}
