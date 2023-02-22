import create, { createStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { CtxFactoryCurry } from '#/misc/CtxFactory';

export interface ClassicEditorInitProps{
    initText?: string
}

export interface ClassicEditorState{
    text: string,
    previewText: string,
}

function createClassicEditorStore(initProps: ClassicEditorInitProps){
    var initText = initProps.initText ?? '';

    return createStore<ClassicEditorState>()((set, get) => ({
        text: initText,
        previewText: initText,
    }))
}

export const [ ClassicEditorProvider, useClassicEditorContext, useClassicEditorAction ] = CtxFactoryCurry<ClassicEditorState, ClassicEditorInitProps>(createClassicEditorStore)({
    setText: (text: string) => ({ text }),
    setPreviewText: (previewText: string) => ({ previewText })
});

export const useClassicText = () => useClassicEditorContext(state => state.text);