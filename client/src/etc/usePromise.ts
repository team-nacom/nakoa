import { useState, useEffect } from 'react';

export default function usePromise<Type>(promiseCreator: () => Promise<Type>, deps: React.DependencyList = [], ifError: 'abort' | 'ignore' = 'abort', cleanup : () => void = () => {} ) {
  const [loading, setLoading] = useState<boolean>(true);
  const [content, setContent] = useState<Type>();
  const [error, setError] = useState<Error>();

  const process = async () => {
    try {
      const result = await promiseCreator();
      setContent(result);
    } catch (error) {
      setError(error);
      console.log('While getting promise: ', promiseCreator);
      console.log('We got an error: ', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    process();
    return cleanup;
  }, deps);

  return [loading, content, error] as [boolean, Type, Error];
}