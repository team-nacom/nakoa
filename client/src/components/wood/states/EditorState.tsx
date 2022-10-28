export interface EditorState{
    parentIds: {
        [id: string]: string | undefined
    }
    rootId: string
    focusId?: string

    hideChildren: Record<string, boolean>
}
export const editorStateDefault : EditorState = {
    parentIds: {},
    rootId: 'c0',
    focusId: undefined,

    hideChildren: {}
}