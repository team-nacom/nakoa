import { createContext, useContext, useRef, PropsWithChildren } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';

type Func<Args extends unknown[], Ret> = (...args: Args) => Ret;

export function CtxFactoryCurry<
    State, InitProps = Partial<State>
>(
    createCtxStore: (props: Omit<PropsWithChildren<InitProps>,'children'>) => ReturnType<ReturnType<typeof createStore<State> >>

    // because of this type signature, we can't use any middleware (e.g. immer) for now. wrap mutations with `produce()` manually.
){
    type CtxStore = ReturnType< typeof createCtxStore >;
    type Setter = Parameters< CtxStore['setState'] >[0];
    // type Setter = Partial<State> | Promise<Partial<State>> | ((state: State) => (Partial<State> | Promise<Partial<State>>));

    return function<Mutations extends { [key: string]: Func<any[], Setter | Promise<Setter>> }>(mutations: Mutations){
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

        function useCtxAction<T>(){
            const store = useContext(CtxContext);
            if (store === null) throw new Error('Missing Context Provider in the tree');

            let actions = Object.entries(mutations)
                    .reduce(
                        (prev, [key, setter]) => ({
                            [key]: (...args) => {
                                let obj = setter(...args);
                                if(obj instanceof Promise){
                                    (async () => store.setState(await obj))();
                                } else{
                                    store.setState(obj);
                                }
                                // store.setState(setter(...args));
                            },
                            ...prev
                        }),
                        {} as { [K in keyof Mutations]: Func< Parameters<Mutations[K]>, void > }
                    );
            
            return actions;
        }

        return [CtxProvider, useCtxContext, useCtxAction] as const;
    }
}

// export function CtxFactory<
//     State, InitProps,
//     Mutations extends { [key: string]: (...args: any[]) => Setter<State> }
// >(
//     createCtxStore: (props: Omit<PropsWithChildren<InitProps>,'children'>) => ReturnType<ReturnType<typeof createStore<State> >>,
//     mutations: Mutations
// ){
//     return CtxFactoryCurry(createCtxStore)(mutations);
// }