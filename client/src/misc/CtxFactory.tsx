import { createContext, useContext, useRef, PropsWithChildren } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';

type Func<Args extends unknown[], Ret> = (...args: Args) => Ret;
type Setter<S> = Parameters< StoreApi<S>['setState'] >[0];

export function CtxFactoryCurry<State, InitProps = Partial<State>>(
    createCtxStore: (props: Omit<PropsWithChildren<InitProps>,'children'>) => ReturnType<ReturnType<typeof createStore<State> >>
){
    type CtxStore = ReturnType< typeof createCtxStore >;

    return function<Mutations extends { [key: string]: Func<any[], Setter<State>> }>(mutations: Mutations){
        const CtxContext = createContext<CtxStore | null>( null );

        function CtxProvider({ children, ...props }: PropsWithChildren<InitProps>): JSX.Element {
            const storeRef = useRef<CtxStore>();
            storeRef.current ??= createCtxStore(props);
            return (
                <CtxContext.Provider value={storeRef.current}>
                    { children }
                </CtxContext.Provider>
            );
        }

        function useCtxContext<T>(
            selector: (state: State) => T,
            equalityFn: (left: T, right: T) => boolean = (l,r) => (l === r)
        ){
            const store = useContext(CtxContext);
            if (store === null) throw new Error('Missing Context Provider in the tree');
            
            let state = useStore(store, selector, equalityFn);

            return state;
        }

        function useCtxAction<T>() /* : Record<keyof Mutations, () => void> */ {
            const store = useContext(CtxContext);
            if (store === null) throw new Error('Missing Context Provider in the tree');

            let actions = Object.entries(mutations)
                    .reduce(
                        (prev, [key, setter]) => ({ [key]: (...args) => store.setState(setter(...args)), ...prev}),
                        {} as { [K in keyof Mutations]: Func< Parameters<Mutations[K]>, void > }
                    );
            
            return actions;
        }

        return [CtxProvider, useCtxContext, useCtxAction] as const;
    }
}

export function CtxFactory<
    State, InitProps,
    Mutations extends { [key: string]: (...args: any[]) => Setter<State> }
>(
    createCtxStore: (props: Omit<PropsWithChildren<InitProps>,'children'>) => ReturnType<ReturnType<typeof createStore<State> >>,
    mutations: Mutations
){
    return CtxFactoryCurry(createCtxStore)(mutations);
}