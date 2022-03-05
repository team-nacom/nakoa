// https://blog.axlight.com/posts/typescript-aware-react-hooks-for-global-state/

import React from 'react';
import { createGlobalState, createStore } from 'react-hooks-global-state';

const { useGlobalState: useTextEditorState } = createGlobalState({
    text: '',
    previewText: ''
})

export { useTextEditorState };