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

    const context = useMemo(
        () => ({
            setBackground,
        }),
        [setBackground]
    );

    return (
        <BackgroundContext.Provider value={context}>
            {currentBackgroundElement != null ? (
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
            ) : null}
            {children}
        </BackgroundContext.Provider>
    );
}

export function useBackgroundContext() {
    return useContext(BackgroundContext);
}
