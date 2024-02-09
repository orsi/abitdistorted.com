'use client';

import { useEffect } from 'react';
import { useBackgroundContext } from '../../components/BackgroundCanvas';
import Experiment5 from '../../components/Experiment5';

export default function InDevelopment() {
  const { setBackground } = useBackgroundContext();

  useEffect(() => {
    setBackground(<Experiment5 />);
  }, [setBackground]);

  return <></>;
}
