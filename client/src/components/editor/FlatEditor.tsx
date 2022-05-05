import React, { useEffect, useCallback, useMemo, useState, useReducer } from 'react';

import { ShortcutProvider, withShortcut, IWithShortcut} from 'etc/react-keybind'; // 'react-keybind';

import lodash from 'lodash';
import { CellType, Cell, CellTypeMap, Flat, defaultCellType, defaultValue } from 'components/naflat/flat';
import {
    FlatState, FlatStateAction,
    reducer, makeInitialState, FlatContext,
    emptyFlat, defaultRootId
} from 'components/naflat/state';
import {
    CellComponentProps, FlatComponentProps,
    CellRenderStrategy,
    CellEditor
} from 'components/naflat/component';

import { handleGlobalShortcutFactory } from 'components/naflat/strategies/helpers/handlers';

import AuthorInput from './AuthorInput';

interface FlatItemMetadata{
    title: string;
    author: string;
}

interface FlatEditorProps extends Omit<FlatComponentProps, 'cellId'>{
    metadata: FlatItemMetadata;
    upload: (metadata: FlatItemMetadata, flat: Flat) => any;
}

//attempt 2: use forked 'react-keybind'
//https://github.com/UnicornHeartClub/react-keybind
const FlatEditorComponentWithShortcut = withShortcut(
    function (props: FlatEditorProps & IWithShortcut){
        const {
            shortcut,
            metadata, upload,
            initialFlat, initialFocusId,
            ...others
        } = props;

        const [state, dispatch] = useReducer(reducer, makeInitialState(initialFlat || emptyFlat, defaultRootId, initialFocusId));

        const [title, setTitle] = useState(metadata.title);
        const [author, setAuthor] = useState(metadata.author);

        // attach global shortcuts
        // useMemo for hooking multiple functions
        const gs = useMemo(() => (
            handleGlobalShortcutFactory(state,dispatch)
        ), [state,dispatch]);

        useEffect(()=>{
            if(shortcut && shortcut.registerShortcut){
                for(var name in gs){
                    shortcut.registerShortcut(
                        gs[name].handler,
                        gs[name].keymap,
                        name,
                        gs[name].description || ''
                    );
                }
                return ()=>{
                    if(shortcut && shortcut.unregisterShortcut){
                        //unregister in reverse order
                        for(var name in gs){
                            shortcut.unregisterShortcut(gs[name].keymap);
                        }
                    }
                }
            }
        }, [ gs ]);

        return (<FlatContext.Provider value={{ state, dispatch }} >
            { /* metadata */ }
            <div className='titleEditor'>
                <label>
                    제목
                </label>
                <input className='title' value={title} onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div className='flexbox'>
                <AuthorInput author={author} setAuthor={setAuthor} />
            </div>

            { /* contents */ }
            <CellEditor cellId = { defaultRootId } {...others} /> { /* root cell */ }

            <button onClick={ () => {
                dispatch({ type:'UNDO' })
            }}> UNDO </button>
            <button onClick={ () => {
                dispatch({ type:'REDO' })
            }}> REDO </button>

            <button onClick = { () => {
                upload({ title, author }, state.flat);
            } }>업로드</button>
        </FlatContext.Provider>);
    }
)


function FlatEditor(props: FlatEditorProps){ //wrapper for shortcut.
    return (<ShortcutProvider ignoreTagNames={ [] }>
        <FlatEditorComponentWithShortcut {...props} />
    </ShortcutProvider>);
}

export type { FlatItemMetadata };
export { FlatEditor };