'use client';

import { useEffect } from 'react';
import { useBackgroundContext } from '../../components/BackgroundCanvas';
import Experiment4 from '../../components/Experiment4';

export default function InDevelopment() {
  const { setBackground } = useBackgroundContext();

  useEffect(() => {
    setBackground(<Experiment4 />);
  }, [setBackground]);

  return <></>;
}
