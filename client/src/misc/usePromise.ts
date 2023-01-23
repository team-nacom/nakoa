import { useState, useEffect } from 'react';

export default function usePromise<Type>(promiseCreator: () => Promise<Type>, deps: React.DependencyList = [], cleanup : () => void = () => {} ) {
  const [loading, setLoading] = useState<boolean>(true);
  const [content, setContent] = useState<Type>();

  const process = async () => {
    try {
      const result = await promiseCreator();
      setContent(result);
    } catch (error) {
      console.log('While getting promise: ', promiseCreator);
      console.log('We got an error: ', error);
      setContent(undefined);
      // throw error;
    }
    setLoading(false);
  };

  useEffect(() => {
    process();
    return cleanup;
  }, deps);

  return [loading, content] as [true, undefined] | [false, Type];
}