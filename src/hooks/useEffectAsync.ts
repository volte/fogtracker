import React, { useEffect } from 'react';

export const useEffectAsync = (effect: () => Promise<void>, deps: React.DependencyList) => {
  useEffect(() => {
    void effect().catch(err => {
      console.error(err);
    });
  }, deps);
};
