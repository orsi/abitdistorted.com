'use client';

import styles from './MainNavigation.module.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export type Routes = '/' | '/about' | '/jons-tuner';

export default function MainNavigation() {
    const pathname = usePathname();
    const router = useRouter();
    const [selectedLink, setSelectedLink] = useState<Routes>('/');
    const linkRefs = useRef<HTMLAnchorElement[]>([]);

    useEffect(() => {
        function gotoSelectedLink(current: Routes) {
            router.push(current);
        }

        function setNextSelectedLink(current: Routes) {
            if (selectedLink === '/') {
                setSelectedLink('/about');
            } else if (selectedLink === '/about') {
                setSelectedLink('/jons-tuner');
            }
        }

        function setPreviousSelectedLink(current: Routes) {
            if (selectedLink === '/about') {
                setSelectedLink('/');
            } else if (selectedLink === '/jons-tuner') {
                setSelectedLink('/about');
            }
        }

        function onKeyDown(ev: KeyboardEvent) {
            switch (ev.key) {
                case 'ArrowDown': {
                    setNextSelectedLink(selectedLink);
                    break;
                }
                case 'ArrowUp': {
                    setPreviousSelectedLink(selectedLink);
                    break;
                }
                case 'Enter': {
                    gotoSelectedLink(selectedLink);
                    break;
                }
            }
        }

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [router, selectedLink]);

    return (
        <nav
            style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'right',
            }}
        >
            <ul>
                <li>
                    <Link
                        className={`${styles.link} ${
                            pathname === '/' ? 'active' : ''
                        } ${selectedLink === '/' ? styles.selected : ''}`}
                        href={'/'}
                        onClick={() => {
                            setSelectedLink('/');
                        }}
                        onMouseEnter={() => {
                            setSelectedLink('/');
                        }}
                        ref={(el) => el && linkRefs.current.push(el)}
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        className={`${styles.link} ${
                            pathname === '/about' ? 'active' : ''
                        } ${selectedLink === '/about' ? styles.selected : ''}`}
                        href={'/about'}
                        onClick={() => {
                            setSelectedLink('/about');
                        }}
                        onMouseEnter={() => {
                            setSelectedLink('/about');
                        }}
                        ref={(el) => el && linkRefs.current.push(el)}
                    >
                        About
                    </Link>
                </li>
                <li>
                    <Link
                        className={`${styles.link} ${
                            pathname === '/jons-tuner' ? 'active' : ''
                        } ${
                            selectedLink === '/jons-tuner'
                                ? styles.selected
                                : ''
                        }`}
                        href={'/jons-tuner'}
                        onClick={() => {
                            setSelectedLink('/jons-tuner');
                        }}
                        onMouseEnter={() => {
                            setSelectedLink('/jons-tuner');
                        }}
                        ref={(el) => el && linkRefs.current.push(el)}
                    >
                        Jon&apos;s Tuner
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
