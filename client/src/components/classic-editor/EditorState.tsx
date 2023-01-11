import create, { StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface ClassicEditorState{
    text: string,
    previewText: string,

    setText(text: string): void,
    setPreviewText(previewText: string): void
}

export const createClassicEditorState : StateCreator<
    any, [], [], ClassicEditorState
> = (set, get, api) => ({
    text: '',
    previewText: '',

    setText(text){
        set((state: ClassicEditorState)=>{ state.text = text })
    },
    setPreviewText(previewText){
        set((state: ClassicEditorState)=>{ state.previewText = previewText })
    },
})

export const useClassicEditorState = create<ClassicEditorState>()(immer(createClassicEditorState))

export const useClassicEditorInit = () => useClassicEditorState(
    state => (text: string) => {
        state.setText(text);
        state.setPreviewText(text);
    }
)

export const useClassicText = () => useClassicEditorState(state => state.text);