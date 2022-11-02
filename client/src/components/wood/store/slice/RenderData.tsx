import katex from 'katex'
import { StateCreator } from 'zustand'

import { Cell, CellType, CellData, labelType } from '#/components/wood/cell/types'
import { StructData } from '#/components/wood/types'

import { CellDataSlice } from './CellData'
import { StructDataSlice } from './StructData'

function _generateAllLabel(id: string, structData: StructData, obj: Record<string, number[]>, prefix: number[]){
    obj[id] = prefix;
    (structData[id] ?? []).forEach((childId,idx)=>{
        _generateAllLabel(childId, structData, obj, [...prefix, idx+1])
    })
}

export function generateAllLabel(rootId: string, structData: StructData): Record<string, number[]>{
    let obj: Record<string, number[]> = {}
    _generateAllLabel(rootId, structData, obj, [])
    return obj
}

function _generateTypedLabel(id: string, structData: StructData, cellData: CellData, obj: Record<string, number[]>, prefix: number[]){
    obj[id] = prefix;

    const idxObj : Record<string, number> = {};
    (structData[id] ?? []).forEach((childId)=>{
        const currentType = labelType(cellData[childId])
        const currentTypeNextIdx = (idxObj[currentType] ?? 0) + 1
        idxObj[currentType] = currentTypeNextIdx

        _generateTypedLabel(childId, structData, cellData, obj, [...prefix, currentTypeNextIdx])
    })
}

export function generateTypedLabel(rootId: string, structData: StructData, cellData: CellData): Record<string, number[]>{
    let obj: Record<string, number[]> = {}
    _generateTypedLabel(rootId, structData, cellData, obj, [])
    return obj
}

// helper function
function toMathMacroObj(mathMacroStr: string){
    let obj = {}
    katex.renderToString(mathMacroStr,{
        throwOnError: false,
        globalGroup: true,
        macros: obj
    })
    return obj
}

type BasicDataSlice = CellDataSlice & StructDataSlice

export interface RenderData{
    mathMacroObj: {},
    label: Record<string, number[]>
    labelTypewise: Record<string, number[]>
}

export interface RenderDataSlice{
    renderData: RenderData
    // for renderDataAction, if no explicit parameters are given, then by default the method will read states from CellDataSlice and StructDataSlice.
    readonly renderDataAction: {
        init(cellData?: CellData, rootId?: string, structData?: StructData): void
        updateFromRoot(rootCell?: Cell<'root'>): void
        relabel(cellData?: CellData, rootId?: string, structData?: StructData): void
    }
}

export const createRenderDataSlice : StateCreator<
    any, [ /* ['zustand/immer', never] */ ], [], RenderDataSlice
> = (set, get) => ({
    renderData: {
        mathMacroObj: {},
        label: {},
        labelTypewise: {},
    },
    renderDataAction: {
        init(cellData?, rootId?, structData?) {
            const _cellData = cellData ?? (get() as BasicDataSlice).cellData
            const _rootId = rootId ?? (get() as BasicDataSlice).rootId
            const _structData = structData ?? (get() as BasicDataSlice).structData

            const _rootCell = _cellData[_rootId] as Cell<'root'>
    
            set((state: RenderDataSlice) => {
                state.renderData.mathMacroObj = toMathMacroObj(_rootCell.mathMacroStr)
                state.renderData.label = generateAllLabel(_rootId, _structData)
                state.renderData.labelTypewise = generateTypedLabel(_rootId, _structData, _cellData)
            })
        },
        updateFromRoot(rootCell?) {
            set((state: RenderDataSlice) => {
                if(rootCell === undefined){
                    const cellData = (get() as BasicDataSlice).cellData
                    const rootId = (get() as BasicDataSlice).rootId
                    rootCell = cellData[rootId] as Cell<'root'>
                } 

                state.renderData.mathMacroObj = toMathMacroObj(rootCell.mathMacroStr)
            })
        },
        relabel(cellData?, rootId?, structData?) {
            set((state: RenderDataSlice) => {
                const _cellData = cellData ?? (get() as BasicDataSlice).cellData
                const _rootId = rootId ?? (get() as BasicDataSlice).rootId
                const _structData = structData ?? (get() as BasicDataSlice).structData

                state.renderData.label = generateAllLabel(_rootId, _structData)
                state.renderData.labelTypewise = generateTypedLabel(_rootId, _structData, _cellData)
            })
        },
    }
})