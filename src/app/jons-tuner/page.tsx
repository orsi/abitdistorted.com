'use client';

export default function JonsTuner() {
    return (
        <section>
            <h1 className="hidden">Jon&apos;s Tuner</h1>
            <p>
                <strong>Jon&apos;s Tuner</strong> is an iOS and Android mobile
                application for tuning instruments.
            </p>
            <div className="mt-2 text-xs font-thin">
                <a href="https://apps.apple.com/ca/app/jons-tuner">ios</a> |{' '}
                <a href="https://play.google.com/store/apps/details?id=com.orsi.jonstuner">
                    android
                </a>
            </div>
            <div className="mt-6 font-thin text-[.5rem]">
                <h2>Privacy Policy</h2>
                <p className="mt-2">
                    Jon&apos;s Tuner analyzes microphone audio to display
                    musical note and frequency information. No audio is recorded
                    or saved on a device.
                </p>
            </div>
        </section>
    );
}
