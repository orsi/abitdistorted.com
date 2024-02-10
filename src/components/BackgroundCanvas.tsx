'use client';

import {
    useState,
    createContext,
    PropsWithChildren,
    useContext,
    ReactNode,
    useCallback,
    useMemo,
} from 'react';
import Experiment1 from './Experiment1';

const BackgroundContext = createContext({
    setBackground: (node: ReactNode) => {},
    reset: () => {},
});
interface BackgroundContextProviderProps extends PropsWithChildren {}
export function BackgroundContextProvider({
    children,
}: BackgroundContextProviderProps) {
    const [currentBackgroundElement, setCurrentBackgroundElement] =
        useState<ReactNode>(<Experiment1 />);

    const setBackground = useCallback((node: ReactNode) => {
        setCurrentBackgroundElement(node);
    }, []);

    const reset = useCallback(() => {
        setCurrentBackgroundElement(<Experiment1 />);
    }, []);

    const context = useMemo(
        () => ({
            setBackground,
            reset,
        }),
        [setBackground, reset]
    );

    return (
        <BackgroundContext.Provider value={context}>
            <div
                style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    height: '100%',
                    width: '100%',
                    zIndex: 1,
                }}
            >
                {currentBackgroundElement}
            </div>
            {children}
        </BackgroundContext.Provider>
    );
}

export function useBackgroundContext() {
    return useContext(BackgroundContext);
}
