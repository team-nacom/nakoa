export const dummyIndex = (s: string | undefined) => {
    if(s === undefined) throw new Error();
    return `&${s}`;
}