import React, { createContext, useContext, useState } from 'react';
// import { ScopeFromState, ScopeFromReducer } from './helpers'

export interface EditorState{
    parentIds: {
        [id: string]: string | undefined
    }
    focusId?: string
}
export const editorStateDefault : EditorState = {
    parentIds: {},
    focusId: undefined
}

// since editor data needs (might need) to be referred on every update,
// don't make any reducer for it.

// export const EditorStateContext = createContext(editorStateDefault)

// export const useEditorState = useState<EditorState>
// export const useEditorStateData = () => useContext(EditorStateContext)