'use client';

import styles from './MainNavigation.module.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const ROUTES = [
    { path: '/', displayName: '/home' },
    { path: '/jons-tuner' },
    { path: '/code-x' },
    { path: '/a-dark-room' },
];

if (process.env.NODE_ENV === 'development') {
    ROUTES.push({ path: '/in-development' });
}

export type TRouteName = (typeof ROUTES)[number]['path'];

export default function MainNavigation() {
    const pathname = usePathname();
    const router = useRouter();
    const [currentSelection, setCurrentSelection] = useState<number>(0);

    useEffect(() => {
        function onKeyDown(ev: KeyboardEvent) {
            switch (ev.key) {
                case 'ArrowDown': {
                    const nextSelection = currentSelection + 1;
                    if (nextSelection > ROUTES.length - 1) {
                        break;
                    }

                    setCurrentSelection(nextSelection);
                    break;
                }
                case 'ArrowUp': {
                    const nextSelection = currentSelection - 1;
                    if (nextSelection < 0) {
                        break;
                    }

                    setCurrentSelection(nextSelection);
                    break;
                }
                case 'Enter': {
                    const currentSelectedRoute = ROUTES[currentSelection];
                    if (!currentSelectedRoute) {
                        break;
                    }
                    router.push(currentSelectedRoute.path);
                    break;
                }
            }
        }

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [currentSelection, router]);

    return (
        <nav
            style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'right',
            }}
        >
            <ul>
                {ROUTES.map((route, i) => {
                    return (
                        <li key={route.path}>
                            <Link
                                className={`${styles.link} ${
                                    pathname === route.path ? 'active' : ''
                                } ${
                                    ROUTES[currentSelection]?.path ===
                                    route.path
                                        ? styles.selected
                                        : ''
                                }`}
                                href={route.path}
                                onClick={() => {
                                    setCurrentSelection(i);
                                }}
                                onMouseEnter={() => {
                                    setCurrentSelection(i);
                                }}
                            >
                                {route.displayName || route.path}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
