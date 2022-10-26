import React, { createContext, useContext, useState, useReducer, Reducer, PropsWithChildren  } from 'react';
// import { ScopeFromState, ScopeFromReducer } from './helpers'

export interface StructData{
    [id: string]: string[]
}

export const structDataDefault : StructData = {}

export type StructDataAction = {
    type: 'addChild'
    parentId: string
    pos?: number
    cellId: string
} | {
    type: 'removeChild'
    parentId: string
    pos: number
} | {
    type: 'moveChild'
    targetParentId: string
    targetPos: number
    destParentId: string
    destPos?: number
} | {
    type: 'cascadeChildren'
    id: string
}

function cascadeChildren(struct: StructData, id: string): StructData{
    let newStruct = {...struct}

    function _cascadeChildren(cellId: string){
        for(let childId of struct[cellId] || []){
            _cascadeChildren(childId);
            delete newStruct[childId];
        }
    }
    _cascadeChildren(id);
    newStruct[id] = [];
    return newStruct;
}

export const structReducer : Reducer<StructData, StructDataAction | StructDataAction[]> = (prevStruct, action) => {
    if(Array.isArray(action)){
        return action.reduce((struct: StructData, a)=> structReducer(struct, a), prevStruct )
    }

    switch(action.type){
    case 'addChild': { // parentId must be root or section.
        let {parentId, pos} = action
        if(pos === undefined) pos = prevStruct[parentId].length
        return {
            ...prevStruct,
            [parentId]: [
                ...prevStruct[parentId].slice(0, pos),
                action.cellId,
                ...prevStruct[parentId].slice(pos)
            ],
            [action.cellId]: []
        }
    }
    
    case 'removeChild': { // parentId must be root or section.
        let {parentId, pos} = action
        let {
            [prevStruct[parentId][pos]]: _unused,
            ...intermStruct
        } = cascadeChildren(prevStruct, prevStruct[parentId][pos])

        return {
            ...intermStruct,
            [parentId]: [
                ...intermStruct[parentId].slice(0,pos),
                ...intermStruct[parentId].slice(pos+1)
            ]
        }
    }

    case 'moveChild': { // targetParentId, destParentId must be root or section.
        let {targetParentId, targetPos, destParentId, destPos} = action
        if(destPos === undefined) destPos = prevStruct[destParentId].length
        if(targetParentId === destParentId){
            if(targetPos === destPos) return prevStruct
            if(targetPos < destPos) return {
                    ...prevStruct,
                    [targetParentId]: [
                        ...prevStruct[targetParentId].slice(0,targetPos),
                        ...prevStruct[targetParentId].slice(targetPos+1, destPos),
                        prevStruct[targetParentId][targetPos],
                        ...prevStruct[targetParentId].slice(destPos)
                    ]
                }
            return { //targetPos > destPos
                    ...prevStruct,
                    [targetParentId]: [
                        ...prevStruct[targetParentId].slice(0,destPos),
                        prevStruct[targetParentId][targetPos],
                        ...prevStruct[targetParentId].slice(destPos, targetPos),
                        ...prevStruct[targetParentId].slice(targetPos+1)
                    ]
            }
        }
        return {
            ...prevStruct,
            [targetParentId]: [
                ...prevStruct[targetParentId].slice(0,targetPos),
                ...prevStruct[targetParentId].slice(targetPos+1)
            ],
            [destParentId]: [
                ...prevStruct[destParentId].slice(0,destPos),
                prevStruct[targetParentId][targetPos],
                ...prevStruct[destParentId].slice(destPos)
            ]
        }
    }
    case 'cascadeChildren': {
        let { id } = action
        return cascadeChildren(prevStruct, id)
    }
    }
}


// export const StructDataContext = createContext(structDataDefault)
// export const StructDispatchContext = createContext((_: StructDataAction | StructDataAction[]) => {})

// export const useStructReducer = (init?: StructData) => useReducer(structReducer, init || structDataDefault)

// type StructDataScopeProps = PropsWithChildren<{ init?: StructData }>
// export function StructDataScope({ init, children }: StructDataScopeProps){
//     const [structData, structDispatch] = useStructReducer(init)

//     return (
//         <StructDataContext.Provider value={ structData }>
//             <StructDispatchContext.Provider value={ structDispatch }>
//                 { children }
//             </StructDispatchContext.Provider>
//         </StructDataContext.Provider>
//     )
// }

// export const useStructData = () => useContext(StructDataContext)
// export const useStructDispatch = () => useContext(StructDispatchContext)