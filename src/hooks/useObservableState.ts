import Rx from 'rxjs';
import { useEffect, useState } from 'react';

export type ObservableState<T, E> = { value?: T } | { value: undefined; error: E };

export const useObservableState = <T, E = unknown>(
  observable: Rx.Observable<T>,
  initialValue?: T
): ObservableState<T, E> => {
  const [value, setValue] = useState<ObservableState<T, E>>({ value: initialValue });
  useEffect(() => {
    const subscription = observable.subscribe({
      next: value =>
        setValue(_ => ({
          value,
        })),
      error: error =>
        setValue(_ => ({
          value: undefined,
          error,
        })),
    });
    return () => subscription.unsubscribe();
  }, []);
  return value;
};
