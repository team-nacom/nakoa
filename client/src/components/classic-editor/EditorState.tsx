import create, { createStore, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { CtxFactory } from '#/misc/CtxFactory';

export interface ClassicEditorInitProps{
    initText?: string
}

export interface ClassicEditorState{
    text: string,
    previewText: string,
}

export interface ClassicEditorStateMachine extends ClassicEditorState{
    setText(text: string): void,
    setPreviewText(previewText: string): void
}

function createClassicEditorStore(initProps: ClassicEditorInitProps){
    var initText = initProps.initText ?? '';

    return createStore<ClassicEditorStateMachine>()(immer((set, get) => ({
        text: initText,
        previewText: initText,

        setText(text){
            set((state: ClassicEditorState)=>{ state.text = text })
        },
        setPreviewText(previewText){
            set((state: ClassicEditorState)=>{ state.previewText = previewText })
        },
    })))
}

export const [ ClassicEditorProvider, useClassicEditorContext ] = CtxFactory<ClassicEditorStateMachine, ClassicEditorInitProps>(createClassicEditorStore);

export const useClassicText = () => useClassicEditorContext(state => state.text);