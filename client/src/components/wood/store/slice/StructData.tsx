import { StateCreator } from 'zustand'

import { Cell, CellType } from '#/components/wood/cell/types'
import { StructData } from '#/components/wood/types'

export interface StructDataSlice{
    rootId: string,
    parentIds: {[id: string]: string | undefined},
    structData: StructData,
    readonly structDataAction: {
        init(rootId: string, structData: StructData): void,
        addChild(cellId: string, parentId: string, pos?: number): void,
        remove(targetId: string): void,
        move(targetId: string, destParentId: string, destPos?: number): void,
        cascadeChildren(id: string): void
    }
}

function cascadeChildren(struct: StructData, id: string): StructData{
    //todo: ok to modify struct directly - since we're using immer.
    let newStruct = {...struct}

    function _cascadeChildren(cellId: string){
        for(let childId of struct[cellId] ?? []){
            _cascadeChildren(childId);
            delete newStruct[childId];
        }
    }
    _cascadeChildren(id);
    newStruct[id] = [];
    return newStruct;
}

export const createStructDataSlice : StateCreator<
    any, [], [], StructDataSlice
> = (set, get) => ({
    rootId: 'c0',
    parentIds: {'c0': undefined},
    structData: {},
    structDataAction: {
        init(rootId, structData) {
            set((state: StructDataSlice) => {
                state.rootId = rootId
                state.structData = structData
                state.parentIds = { [rootId]: undefined }
                for(let pid in structData){
                    for(let cid of structData[pid]){
                        state.parentIds[cid] = pid
                    }
                }
            })
        },
        addChild(cellId, parentId, pos?){
            set((state: StructDataSlice) => {
                const prevChildren: string[] = state.structData[parentId]
                if(pos === undefined) pos = prevChildren.length

                state.structData[parentId].splice(pos, 0, cellId)
                state.structData[cellId] = []

                state.parentIds[cellId] = parentId
            } )
        },
        remove(targetId) {
            set((state: StructDataSlice) => {

                const targetParentId = state.parentIds[targetId]
                if(targetParentId === undefined) return
                const targetPos = state.structData[targetParentId]?.indexOf(targetId)
                if(targetPos === undefined || targetPos === -1) return

                state.structData = cascadeChildren(state.structData, targetId)
                
                // state.structData[targetParentId].splice(targetPos, 0)
                state.structData[targetParentId] = [
                    ...state.structData[targetParentId].slice(0, targetPos),
                    ...state.structData[targetParentId].slice(targetPos+1)
                ]

                // recalculate parents
                state.parentIds = { [state.rootId]: undefined }
                for(let pid in state.structData){
                    for(let cid of state.structData[pid]){
                        state.parentIds[cid] = pid
                    }
                }
            } )
        },
        move(targetId, destParentId, destPos?) {
            set((state: StructDataSlice) => {
                const targetParentId = state.parentIds[targetId]
                if(targetParentId === undefined) return
                const targetPos = state.structData[targetParentId]?.indexOf(targetId)
                if(targetPos === undefined || targetPos === -1) return

                if(destPos === undefined) destPos = state.structData[destParentId].length

                if(targetParentId === destParentId && targetPos < destPos){ destPos-- }
                state.structData[targetParentId].splice(targetPos, 1) // this should return [targetId]
                state.structData[destParentId].splice(destPos, 0, targetId)
    
                // the above logic is equivalent to the logic commented below:
    
                // if(targetParentId === destParentId){
                //     if(targetPos < destPos){
                //         state.structData[targetParentId].splice(targetPos, 1)
                //         state.structData[targetParentId].splice(destPos-1, 0, targetId)
                //     }
                //     else if(targetPos > destPos){
                //         state.structData[targetParentId].splice(targetPos, 1)
                //         state.structData[targetParentId].splice(destPos, 0, targetId)
                //     }
                // }
                // else{
                //     state.structData[targetParentId].splice(targetPos, 1)
                //     state.structData[destParentId].splice(destPos, 0, targetId)
                // }

                state.parentIds[targetId] = destParentId
            })
        },
        cascadeChildren(id) {
            set( (state: StructDataSlice) => {
                state.structData = cascadeChildren(state.structData, id)

                // recalculate parents... seems redundant though.
                state.parentIds = { [state.rootId]: undefined }
                for(let pid in state.structData){
                    for(let cid of state.structData[pid]){
                        state.parentIds[cid] = pid
                    }
                }
            })
        },
    }
})