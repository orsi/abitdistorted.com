'use client';

import { useEffect } from 'react';
import { useBackgroundContext } from '../components/BackgroundCanvas';
import Experiment3 from '../components/Experiment3';

export default function Home() {
  const { setBackground } = useBackgroundContext();
  useEffect(() => {
    setBackground(<Experiment3 />);
  }, [setBackground]);
  return (
    <section>
      <h1>
        <div>a</div>
        <div>bit</div>
        <div>distorted</div>
      </h1>
    </section>
  );
}
