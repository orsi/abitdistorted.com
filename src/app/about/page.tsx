'use client';

import { useEffect } from 'react';
import { useBackgroundContext } from '../../components/BackgroundCanvas';
import Experiment2 from '../../components/Experiment2';

export default function About() {
  const { setBackground } = useBackgroundContext();
  useEffect(() => {
    setBackground(<Experiment2 />);
  }, [setBackground]);

  return (
    <section>
      <p>
        <strong>a bit distorted</strong> is a creative digital agency conjuring
        web experiences
      </p>
    </section>
  );
}
