// Implementation of cell (and flat) renderer components.
// This file contains definitions which is only valid AFTER defining render strategies for each types.

import React, { useEffect, useCallback, useMemo } from 'react';
import { createContext, useContext } from 'react';

import { ShortcutProvider, withShortcut, IWithShortcut} from './react-keybind'; // 'react-keybind';

import lodash from 'lodash';
import { CellType, Cell, CellTypeMap, Flat, defaultCellType, defaultValue } from './flat';
import { FlatState, FlatStateAction, reducer } from './reducer';
import { CellComponentProps, CellRenderStrategy, FlatContext, makeInitialState } from './componentTypes';

import { handleGlobalShortcutFactory } from './strategies/helpers/handlers';



import RootCellStrategy from './strategies/Root';
import TextCellStrategy from './strategies/Text';
import MathCellStrategy from './strategies/Math';
import CodeCellStrategy from './strategies/Code';
import ImageCellStrategy from './strategies/Image';

import InterCell from './aux/InterCell';
import AuthorInput from 'components/AuthorInput';
import Button from 'components/Button';

const cellRenderStrategyMap: CellTypeMap<CellRenderStrategy> = {
    'root': RootCellStrategy,
    'text': TextCellStrategy,
    'math': MathCellStrategy,
    'code': CodeCellStrategy,
    'image': ImageCellStrategy
};

function CellDisplay(props: CellComponentProps) {
    const { state, dispatch } = useContext(FlatContext);

    const cell = state.flat[props.cellId];
    const Strategy = cellRenderStrategyMap[cell.type]['display'];

    return <>
        <div className='cellContentWrapper'>
            <Strategy {...props} />
        </div>
        { /* render children. */}
        {(cell.type === 'root' || cell.childIds.length !== 0) &&
            <div className='cellChildrenWrapper'>
                {
                    cell.childIds.reduce((prev, childId, idx) => prev.concat(
                        <CellDisplay {...props} cellId={childId} />,
                        <div className='interBlockHelper' /> //Just for css.
                    ), [ <div className='interBlockHelper' /> ])
                }
            </div>
        }
    </>;
}

function CellEditor(props: CellComponentProps) {
    const { state, dispatch } = useContext(FlatContext);

    const cell = state.flat[props.cellId];
    const isFocused = (state.focusId === props.cellId);

    const PreviewStrategy = cellRenderStrategyMap[cell.type]['preview'];
    const EditorStrategy = cellRenderStrategyMap[cell.type]['editor'];

    function cellTypeButtonHandlerFactory(type : CellType){
        return () => {
            if(cell.type === type) return;
            if(lodash.isEqual(cell.value, defaultValue[cell.type])
                || window.confirm('셀 타입을 변경하면 내용이 초기화됩니다. 변경하시겠습니까?')
            ){ //either the value is default OR it is confirmed to reset the value
                dispatch({ type: 'changeType', cellType: type, id: props.cellId });
            }
        }
    }

    return <>
        {!isFocused &&
            <>
                <div className='cellContentWrapper'
                    onClick={(ev) => {
                        ev.stopPropagation();
                        dispatch({ type: 'focus', id: props.cellId })
                    }}
                >
                    {cell.type !== 'root' &&
                        <div className='cellOptions'>
                            {cell.childIds.length === 0 &&
                                <button
                                    className='material-icons cellOptionButton'
                                    onClick = { (e) => { e.stopPropagation(); dispatch({ type: 'createEmpty', parentId: props.cellId, pos : 0, cellType: defaultCellType}) } }
                                >
                                    add
                                </button>
                            }
                            <button
                                className='material-icons cellOptionButton'
                                onClick={() => dispatch({ type: 'remove', id: props.cellId })}
                            >
                                delete
                            </button>
                        </div>
                    }
                    <PreviewStrategy {...props} />
                </div>
            </>
        }
        {isFocused &&
            <div className='cellContentWrapper editingCellWrapper'
                onClick={(ev) => {ev.stopPropagation()} }
            >
                { /* side cell */}
                <div className='cellOptions'>
                    {cell.type !== 'root' &&
                        <>
                            <button
                                className='material-icons cellOptionButton'
                                onClick={ cellTypeButtonHandlerFactory('text') }
                            >
                                article
                            </button>
                            <button
                                className='material-icons cellOptionButton'
                                onClick={ cellTypeButtonHandlerFactory('math') }
                            >
                                calculate
                            </button>
                            <button
                                className='material-icons cellOptionButton'
                                onClick={ cellTypeButtonHandlerFactory('code') }
                            >
                                code
                            </button>
                            <button
                                className='material-icons cellOptionButton'
                                onClick={ cellTypeButtonHandlerFactory('image') }
                            >
                                image
                            </button>
                        </>
                    }
                    <button
                        className='material-icons cellOptionButton'
                        onClick={() => dispatch({ type: 'blur' })}
                    >
                        close
                    </button>
                    {cell.type !== 'root' &&
                        <button
                            className='material-icons cellOptionButton'
                            onClick={() => dispatch({ type: 'remove', id: props.cellId })}
                        >
                            delete
                        </button>
                    }
                </div>

                <EditorStrategy {...props} />
            </div>
        }

        { /* render children. */}
        {(cell.type === 'root' || cell.childIds.length !== 0) &&
            <div className='cellChildrenWrapper'
                onClick={() => dispatch({ type: 'blur' }) }
            >
                {
                    cell.childIds.reduce((prev, childId, idx) => prev.concat(
                        <CellEditor {...props} cellId={childId} />,
                        <InterCell parentId={props.cellId} pos={idx + 1} />
                    ), [ <InterCell parentId={props.cellId} pos={0} /> ])
                }
            </div>
        }
    </>;
}



const emptyFlat: Flat = {
    'c0': {
        type: 'root',
        id: 'c0',
        childIds: [],
        value: ''
    }
};

interface FlatComponentProps extends CellComponentProps {
    initialFlat?: Flat;
    initialFocusId?: string;
    uploadFlat?: (flat: Flat) => void;
}

function FlatDisplayComponent(props: FlatComponentProps) {
    let { initialFlat, initialFocusId, ...others } = props;

    const [state, dispatch] = React.useReducer(reducer, makeInitialState(props.initialFlat || emptyFlat, initialFocusId));

    return ( //implement display here
        <FlatContext.Provider value={{ state, dispatch }} >
            <div className='allCellsWrapper'>
                <CellDisplay {...others} />
            </div>
        </FlatContext.Provider>
    );
}


//Editor implementation

//TODO : 에디터 자체도 다른 파일로 빼기

//attempt 2: use forked 'react-keybind'
//https://github.com/UnicornHeartClub/react-keybind
const FlatEditorComponentWithShortcut = withShortcut(
    function (props: FlatComponentProps & IWithShortcut){
        const { initialFlat, initialFocusId, shortcut, ...others } = props;

        const [state, dispatch] = React.useReducer(reducer, makeInitialState(props.initialFlat || emptyFlat, initialFocusId));

        // useMemo for hooking multiple function
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
            <div className='allCellsWrapper'>
                <CellEditor {...others}/>
            </div>
            <hr/> {/* only for css */}
            {/* <button onClick = { () => { console.log(state.flat) } }>console.log 남기기</button> */}
            <div className='buttonsWrapper'>
                { props.uploadFlat && 
                    <Button className='uploadButton' onClick = { async () => props.uploadFlat!(state.flat) }>업로드</Button>
                }
            </div>
        </FlatContext.Provider>);
    }
)


interface FlatEditorProps extends FlatComponentProps {
    // initialFlat?: Flat;
    // initialFocusId?: string;
    // uploadFlat?: (flat: Flat) => void;
    title?: string;
    setTitle?: (value: string) => void;
    author?: string;
    setAuthor?: (value: string) => void;
    upload?: (title: string, author: string, flat: Flat) => void;
}

function FlatEditorComponent(props: FlatEditorProps){
    let title = props.title ?? 'untitled';
    let setTitle = props.setTitle ?? ((value: string) => {});

    let author = props.author ?? 'unknown';
    let setAuthor = props.setAuthor ?? ((value: string) => {});

    let uploadFlat = (flat: Flat) => {};
    if (props.upload !== undefined){
        uploadFlat = (flat: Flat) => {
            props.upload!(title, author, flat);
        }
    }

    return (<ShortcutProvider ignoreTagNames={ [] }>
        <div className='cellEditorWrapper'>
            <div className='editorTextInput'>
                <div className='titleInput'>
                    <label>
                        제목
                    </label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <AuthorInput author={author} setAuthor={setAuthor} />
            </div>
            <hr/> {/* only for css */}
            <FlatEditorComponentWithShortcut {...props} uploadFlat={uploadFlat} />
        </div>
    </ShortcutProvider>);
}

export { FlatContext, FlatDisplayComponent, FlatEditorComponent };