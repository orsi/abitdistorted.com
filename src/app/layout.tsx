import type { Metadata } from 'next';
import './globals.css';
import BackgroundCanvas from '../components/BackgroundCanvas';
import MainNavigation from '../components/MainNavigation';

export const metadata: Metadata = {
    title: 'a bit distorted',
    description: '',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        height: '100%',
                    }}
                >
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
                            height: '100%',
                            padding: '16px',
                            position: 'relative',
                            margin: '0 auto',
                            maxHeight: '480px',
                            maxWidth: '640px',
                            width: '100%',
                            zIndex: '2',
                        }}
                    >
                        <div
                            style={{
                                border: '1px dashed rgba(255,255,255,.4)',
                                height: '100%',
                                padding: '16px',
                                margin: '0 16px',
                                minWidth: '0px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        flex: '1 0 auto',
                                        marginLeft: 'auto',
                                    }}
                                >
                                    <MainNavigation />
                                </div>
                                <div
                                    style={{
                                        marginTop: 'auto',
                                    }}
                                >
                                    {children}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}
