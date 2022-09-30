// import React, { useContext, createContext, useState, useReducer, Reducer, Dispatch, SetStateAction, PropsWithChildren } from 'react';

// export function ScopeFromState<T, S1 extends string, S2 extends string>(valName: S1, setValName: S2, defaultValue: T){
//     const Ctxt = createContext({
//         [valName]: defaultValue,
//         [setValName]: (_: T) => {}
//     })

//     function Scope({ children }: PropsWithChildren<{}>){
//         const [val, setVal] = useState<T>(defaultValue)

//         return (
//             <Ctxt.Provider value={ {[valName]: val, [setValName]: setVal} }>
//                 { children }
//             </Ctxt.Provider>
//         )
//     }

//     const useScope = () => useContext(Ctxt)

//     return [ Scope, useScope ] as const
// }

// export function ScopeFromReducer<T, A>(valName: string, dispatchName: string, defaultValue: T, reducer: Reducer<T, A> ){
//     const Ctxt = createContext({
//         [valName]: defaultValue,
//         [dispatchName]: (_: A) => {}
//     })

//     function Scope({ children }: PropsWithChildren<{}>){
//         const [val, dispatch] = useReducer(reducer, defaultValue)

//         return (
//             <Ctxt.Provider value={ {[valName]: val, [dispatchName]: dispatch} }>
//                 { children }
//             </Ctxt.Provider>
//         )
//     }

//     const useScope = () => useContext(Ctxt)

//     return [ Scope, useScope ] as const
// }

export default {};