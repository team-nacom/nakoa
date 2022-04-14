import React, { useEffect, useCallback, useMemo, useState, useReducer } from 'react';

import { ShortcutProvider, withShortcut, IWithShortcut} from 'etc/react-keybind'; // 'react-keybind';

import lodash from 'lodash';
import { CellType, Cell, CellTypeMap, Flat, defaultCellType, defaultValue } from 'components/naflat/flat';
import { FlatState, FlatStateAction, reducer } from 'components/naflat/reducer';

import {
    CellComponentProps, FlatComponentProps,
    CellRenderStrategy, FlatContext, makeInitialState,
    CellEditor
} from 'components/naflat/component';

import { handleGlobalShortcutFactory } from 'components/naflat/strategies/helpers/handlers';

import AuthorInput from './AuthorInput';
import Button from 'components/Button';
import { localStorageKeys } from 'etc/consts';

interface FlatItemMetadata{
    title: string;
    author: string;
}

interface FlatEditorProps extends FlatComponentProps{
    metadata: FlatItemMetadata;
    upload: (metadata: FlatItemMetadata, flat: Flat) => any;
}

const emptyFlat: Flat = {
    'c0': {
        type: 'root',
        id: 'c0',
        childIds: [],
        value: defaultValue['root']
    }
};

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

        const [state, dispatch] = useReducer(reducer, makeInitialState(initialFlat || emptyFlat, props.cellId, initialFocusId));

        const [title, setTitle] = useState(metadata.title);
        const [author, setAuthor] = useState(metadata.author);

        useEffect(() => {
            localStorage.setItem(localStorageKeys.flatDraft, JSON.stringify(state.flat));
        }, [state])

        useEffect(() => {
            localStorage.setItem(localStorageKeys.metadataDraft, JSON.stringify({title: title, author: author}));
        }, [title, author])

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
            <div className='cellEditorWrapper'>
                <div className='editorTextInput'>
                    <div className='titleInput'>
                        <label>
                            제목
                        </label>
                        <input className='title' value={title} onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                    <AuthorInput author={author} setAuthor={setAuthor} />
                </div>
                <hr/> {/* only for css */}

                <div className='allCellsWrapper'>
                    <CellEditor {...others}/> { /* root cell */ }
                </div>

                <hr/> {/* only for css */}

                {/* <button onClick = { () => { console.log(state.flat) } }>console.log 남기기</button> */}
                <div className='buttonsWrapper'>
                    <Button className='uploadButton' onClick = { async () => { upload({ title, author }, state.flat) } }>업로드</Button>
                </div>
          </div>
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