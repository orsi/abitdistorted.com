'use client';

import { useEffect } from 'react';
import { useBackgroundContext } from '../../components/BackgroundCanvas';
import Experiment1 from '../../components/Experiment1';

export default function JonsTuner() {
  const { setBackground } = useBackgroundContext();
  useEffect(() => {
    setBackground(<Experiment1 />);
  }, [setBackground]);

  return (
    <section>
      <p>
        <strong>Jon&apos;s Tuner</strong> is an iOS and Android mobile
        application for tuning instruments.
      </p>
      <div
        style={{
          marginTop: '16px',
        }}
      >
        <small>
          <strong>Privacy Policy</strong>
          <p>
            Jon&apos;s Tuner analyzes microphone audio to display musical note
            and frequency information. No audio is recorded or saved on your
            device.
          </p>
        </small>
      </div>
    </section>
  );
}
