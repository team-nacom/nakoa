import { createContext, useContext, useRef, PropsWithChildren } from 'react';
import { createStore, useStore } from 'zustand';

export function CtxFactory<CtxStateMachine, CtxInitProps>(
    createCtxStore: (props: Omit<PropsWithChildren<CtxInitProps>,'children'>) => ReturnType<ReturnType<typeof createStore<CtxStateMachine> >>,
){
    type CtxStore = ReturnType< typeof createCtxStore >;

    const CtxContext = createContext<CtxStore | null>( null );
    function CtxProvider({ children, ...props }: PropsWithChildren<CtxInitProps>): JSX.Element {
        const storeRef = useRef<CtxStore>();
        storeRef.current ??= createCtxStore(props);
        return (
            <CtxContext.Provider value={storeRef.current}>
                { children }
            </CtxContext.Provider>
        );
    }

    function useCtxContext<T>(
        selector: (state: CtxStateMachine) => T,
        equalityFn: (left: T, right: T) => boolean = (l,r) => (l === r)
    ): T {
        const store = useContext(CtxContext);
        if (store === null) throw new Error('Missing Context Provider in the tree');
        return useStore(store, selector, equalityFn);
    }

    return [CtxProvider, useCtxContext] as const;
}
