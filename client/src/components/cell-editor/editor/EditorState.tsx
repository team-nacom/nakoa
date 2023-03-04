import katex from 'katex';

import create, { StateCreator, createStore, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { produce } from 'immer';

import isEqual from 'react-fast-compare'

import { CellArticleContent } from '#/common/Article';

import { Cell, CellType, cellTypeStr, labelType, isParentType, defaultFields } from '#/components/cell-editor/cell/types'
import { CtxFactoryCurry } from '#/misc/CtxFactory';

// helper functions

function generateId(ids: string[]) : string{
    let mx = Math.max.apply(
        null,
        ids.map( str => parseInt(str.slice(1)) )
            .filter( isFinite )
            .concat(0)
    ) + 1;
    return 'c' + mx; // cell ids are 'cNN' format now.
}

type Content = CellArticleContent<Cell>;

function _generateAllLabel(c: Content, id: string, obj: Record<string, number[]>, prefix: number[]){
    obj[id] = prefix;
    (c.structData[id] ?? []).forEach((childId,idx)=>{
        _generateAllLabel(c, childId, obj, [...prefix, idx+1])
    });
}
function generateAllLabel(c: Content): Record<string, number[]>{
    let obj: Record<string, number[]> = {};
    _generateAllLabel(c, c.rootId, obj, []);
    return obj;
}

function _generateTypedLabel(c: Content, id: string, obj: Record<string, number[]>, prefix: number[]){
    obj[id] = prefix;

    const idxObj : Record<string, number> = {};
    (c.structData[id] ?? []).forEach((childId)=>{
        const currentType = labelType(c.cellData[childId])
        const currentTypeNextIdx = (idxObj[currentType] ?? 0) + 1
        idxObj[currentType] = currentTypeNextIdx

        _generateTypedLabel(c, childId, obj, [...prefix, currentTypeNextIdx])
    });
}
function generateTypedLabel(c: Content): Record<string, number[]>{
    let obj: Record<string, number[]> = {};
    _generateTypedLabel(c, c.rootId, obj, []);
    return obj;
}

function cascadeChildren(struct: Content['structData'], id: string): Content['structData']{
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

function toMathMacroObj(mathMacroStr: string){
    let obj = {}
    katex.renderToString(mathMacroStr,{
        throwOnError: false,
        globalGroup: true,
        macros: obj
    })
    return obj
}

function calculateParentIds(struct: Content['structData'], rootId: string){
    let parentIds: Record<string, string | undefined> = { [rootId]: undefined }
    for(let pid in struct){
        for(let cid of struct[pid]){
            parentIds[cid] = pid
        }
    }
    return parentIds;
}

// end helper functions

// state type definitions

export interface RenderData{
    mathMacroObj: {},
    label: Record<string, number[]>
    labelTypewise: Record<string, number[]>
}

export interface CellEditorInitProps{
    init?: Content,
    focusId?: string,
}

export interface CellEditorState{
    content: Content,

    parentIds: Record<string, string | undefined>,
    renderData: RenderData,
    focusId?: string,
    hideChildren: Record<string, boolean>,
}

// end state type definitions

function createCellEditorStore(initProps: CellEditorInitProps){
    var { init, focusId } = initProps;

    var { rootId, cellData, structData } = init ?? {};
    rootId ??= 'c0';
    cellData ??= {
        [rootId]: {
            [cellTypeStr]: 'root',
            id: rootId,
            // title: '', author: '',
            mathMacroStr: ''
        }
    };
    if(structData === undefined){
        structData = { [rootId]: [] }
        for(let id in cellData){
            if(id === rootId) continue;
            structData[rootId].push(id)
            structData[id] = []
        }
    }
    var content: CellArticleContent<Cell> = { rootId, cellData, structData };


    var hideChildren: Record<string, boolean> = {};
    for(let id in cellData){
        const cell = cellData[id];
        if(cell.cellType === 'section' && cell.hideChildren){
            hideChildren[id] = true;
        }
    }

    var parentIds = calculateParentIds(structData, rootId);

    var renderData: RenderData = {
        mathMacroObj: toMathMacroObj((cellData[rootId] as Cell<'root'>).mathMacroStr),
        label: generateAllLabel(content),
        labelTypewise: generateTypedLabel(content),
    };

    return createStore<CellEditorState>()(immer((set, get) => ({
        content,

        parentIds,
        renderData,
        focusId,
        hideChildren,
    })))
}

// slice functions : this will assume that all usage will be wrapped inside immer `produce()`; ok to directly modify

type HelperActions = { [key: string]: (...a: any[]) => (s: CellEditorState) => any }

// actions for s.content.cellData
const cellAction: HelperActions = { // these currying is just for legacy compability - use non-curried version for this if performance is bad (or code is ugly and type inference is going crazy)
    create: (id: string, cell: Cell) => (
        s => {
            s.content.cellData[id] = cell; // use id or cell.id ?
        }
        // ok to directly update state as long as immer is used
    ),
    update: (id: string, fields: {[key: string]: unknown }) => (
        s => {
            Object.assign(s.content.cellData[id], fields);
        }
    ),
    remove: (id: string) => (
        s => {
            delete s.content.cellData[id];
        }
    ),
    toggleHideChildren: (id: string) => (
        s => {
            const cell = s.content.cellData[id]
            if(cell && cell[cellTypeStr] === 'section'){
                cell.hideChildren = !cell.hideChildren
            }
            s.content.cellData[id] = cell //since `cell` is shallow, no need to reassign it... but just for sure...
        }
    ),
};

// actions for s.content.structData and s.parentIds
const structAction: HelperActions = {
    addChild: (cellId: string, parentId: string, pos?: number) => (
        s => {
            const prevChildren: string[] = s.content.structData[parentId];
            pos ??= prevChildren.length;

            s.content.structData[parentId].splice(pos, 0, cellId);
            s.content.structData[cellId] = [];

            s.parentIds[cellId] = parentId;
        }
    ),
    remove: (targetId: string) => (
        s => {
            const targetParentId = s.parentIds[targetId];
            if(targetParentId === undefined) return;
            const targetPos = s.content.structData[targetParentId]?.indexOf(targetId);
            if(targetPos === undefined || targetPos === -1) return;

            s.content.structData = cascadeChildren(s.content.structData, targetId);
            s.content.structData[targetParentId].splice(targetPos, 1);
            // s.content.structData[targetParentId] = [
            //     ...s.content.structData[targetParentId].slice(0, targetPos),
            //     ...s.content.structData[targetParentId].slice(targetPos+1)
            // ];

            // recalculate parents
            s.parentIds = calculateParentIds(s.content.structData, s.content.rootId);
        }
    ),
    move: (targetId: string, destParentId: string, destPos?: number) => (
        s => {
            const targetParentId = s.parentIds[targetId];
            if(targetParentId === undefined) return;
            const targetPos = s.content.structData[targetParentId]?.indexOf(targetId);
            if(targetPos === undefined || targetPos === -1) return;

            if(destPos === undefined) destPos = s.content.structData[destParentId].length;

            if(targetParentId === destParentId && targetPos < destPos){ destPos--; }
            s.content.structData[targetParentId].splice(targetPos, 1); // this should return [targetId]
            s.content.structData[destParentId].splice(destPos, 0, targetId);

            // the above logic is equivalent to the logic commented below:

            // if(targetParentId === destParentId){
            //     if(targetPos < destPos){
            //         s.content.structData[targetParentId].splice(targetPos, 1)
            //         s.content.structData[targetParentId].splice(destPos-1, 0, targetId)
            //     }
            //     else if(targetPos > destPos){
            //         s.content.structData[targetParentId].splice(targetPos, 1)
            //         s.content.structData[targetParentId].splice(destPos, 0, targetId)
            //     }
            // }
            // else{
            //     s.content.structData[targetParentId].splice(targetPos, 1)
            //     s.content.structData[destParentId].splice(destPos, 0, targetId)
            // }

            s.parentIds[targetId] = destParentId;
        }
    ),
    cascadeChildren: (id: string) => (
        s => {
            s.content.structData = cascadeChildren(s.content.structData, id)

            // recalculate parents... seems redundant though.
            s.parentIds = calculateParentIds(s.content.structData, s.content.rootId);
        }
    ),
};

// actions for s.renderData
const renderDataAction: HelperActions = {
    updateFromRoot: (rootCell?: Cell<'root'>) => (
        s => {
            rootCell ??= s.content.cellData[s.content.rootId] as Cell<'root'>;
            s.renderData.mathMacroObj = toMathMacroObj(rootCell.mathMacroStr);
        }
    ),
    relabel: (content?: Partial<CellArticleContent>) => (
        s => {
            const cont : Content = {...content, ...s.content};

            s.renderData.label = generateAllLabel(cont);
            s.renderData.labelTypewise = generateTypedLabel(cont);
        }
    )
};

// end slice functions

export const [ CellEditorProvider, useCellEditorContext, useCellEditorAction ] = CtxFactoryCurry<CellEditorState, CellEditorInitProps>(createCellEditorStore)({
    update: (id: string, fields: {[key: string]: unknown}) => produce((s: CellEditorState) => {
        cellAction.update(id, fields)(s);
    }),
    changeType: (id: string, cellType: CellType) => produce((s: CellEditorState) => {
        if(cellType === 'root') return;
        if(s.content.cellData[id]?.cellType === 'root') return;
        
        cellAction.create(id, {
            [cellTypeStr]: cellType,
            id,
            ...defaultFields[cellType]
        } as Cell)(s);
        structAction.cascadeChildren(id)(s); // redundant since we don't call changeType from parent cells...?
        renderDataAction.relabel()(s);
    }),
    move: (id: string, destParentId: string, destPos?: number) => produce((s: CellEditorState) => {
        structAction.move(id, destParentId, destPos)(s);
        renderDataAction.relabel()(s);
    }),
    createChild: (cellType: CellType, parentId: string, pos?: number) => produce((s: CellEditorState) => {
        const id = generateId(Object.keys(s.parentIds));
        cellAction.create(id, {
            [cellTypeStr]: cellType,
            id,
            ...defaultFields[cellType]
        } as Cell)(s);
        structAction.addChild(id, parentId, pos)(s);
        renderDataAction.relabel()(s);
    }),
    remove: (id: string) => produce((s: CellEditorState) => {
        cellAction.remove(id)(s);
        structAction.remove(id)(s);
        renderDataAction.relabel()(s);
    }),

    focus: (id?: string) => produce((s: CellEditorState) => {
        s.focusId = id;
    }), //focus() : blur
    toggleHideChildren: (id: string) => produce((s: CellEditorState) => {
        cellAction.toggleHideChildren(id)(s);
        s.hideChildren[id] = !s.hideChildren[id];
    }),
    updateRenderData: () => produce((s: CellEditorState) => {
        renderDataAction.updateFromRoot(s.content.cellData[s.content.rootId] as Cell<'root'>)(s);
    })
});

export const useContent = () => useCellEditorContext(state => state.content)
export const useCellData = () => useCellEditorContext(state => state.content.cellData)
export const useRootId = () => useCellEditorContext(state => state.content.rootId)
export const useStructData = () => useCellEditorContext(state => state.content.structData)

export const useParentIds = () => useCellEditorContext(state => state.parentIds)
export const useRenderData = () => useCellEditorContext(state => state.renderData)

export const useSingleCell = (id: string) => useCellEditorContext(state => state.content.cellData[id])
export const useSingleCellType = (id: string) => useCellEditorContext(state => state.content.cellData[id]?.cellType)
export const useSingleCellFocused = (id: string) => useCellEditorContext(state => state.focusId === id)

export const useSingleCellLabel = (id: string) => useCellEditorContext(state => state.renderData.label[id], isEqual)
export const useSingleCellLabelTypewise = (id: string) => useCellEditorContext(state => state.renderData.labelTypewise[id], isEqual)

function getChildren(state: CellEditorState, id: string): (string[] | undefined){
    const cellType = state.content.cellData[id]?.cellType;
    if(isParentType(cellType)) return state.content.structData[id] ?? [];
    return undefined;
}
export const useSingleCellChildren = (id: string) => useCellEditorContext(state => getChildren(state, id))
export const useSingleCellHideChildren = (id: string) => useCellEditorContext(state => state.hideChildren[id])