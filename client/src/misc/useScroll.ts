import React from 'react';

export default function useScroll() {
  const [scroll, setScroll] = React.useState<number>(0);

  React.useEffect(() => {
    window.addEventListener('scroll', () => {
        setScroll(window.scrollY);
    }, true);
  })

  return scroll;
}

export function useDeltaScroll() {
    const scroll = useScroll();
    const [befScroll, setBefScroll] = React.useState(scroll);
    const [deltaScroll, setDeltaScroll] = React.useState(0);

    React.useEffect(() => {
        setDeltaScroll(scroll - befScroll);
        setBefScroll(scroll);
    }, [scroll]);

    return deltaScroll;
}