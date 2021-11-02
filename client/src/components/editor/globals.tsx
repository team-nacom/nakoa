// https://blog.axlight.com/posts/typescript-aware-react-hooks-for-global-state/

import React from 'react';
import { createGlobalState, createStore } from 'react-hooks-global-state';

import { useNaBubbleState, getNaBubbleState, dispatchNaBubbleState } from 'components/nabubble/actionReducer';

const { useGlobalState: usePlainEditorState } = createGlobalState({
    text: '',
    previewText: ''
})

export { useNaBubbleState, getNaBubbleState, dispatchNaBubbleState };
export { usePlainEditorState };