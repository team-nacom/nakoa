import React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';

import { TCell } from '../cell';
import { FlatContext } from '../state';
import { CellComponentProps, CellRenderStrategy } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';
import SingletonTextArea from './helpers/singletonTextArea';

function DisplayCodeCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId] as TCell<'code'> ;
    let { language, contents } = cell.value;

    return (
        <>
            <summary className='codeCellPreview'>
                코드 { language }
            </summary>
            {/* <pre className='codeCell renderedCodeCell'>
                <code>{contents}</code>
            </pre> */}
            <SyntaxHighlighter className='codeCell renderedCodeCell'
                language = { language }
            >
                { contents }
            </SyntaxHighlighter>
        </>
    );
}


function PreviewCodeCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'code'>;

    let { language, contents } = cell.value;

    return (
        <>
            <summary className='codeCellPreview'>
                코드 { language }
            </summary>
            {/* <pre className='codeCell renderedCodeCell'>
                <code>{contents}</code>
            </pre> */}
            <SyntaxHighlighter className='codeCell renderedCodeCell'
                language = { language }
            >
                { contents }
            </SyntaxHighlighter>
        </>
    );
}


function EditorCodeCell(props: CellComponentProps){
    const { state, dispatch } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'code'>;

    let { language, contents } = cell.value;

    return (
        <>
            <input
                style={ props.style as any }
                className='codeCellCaptionForm'
                onChange={
                    handleChangeFactory(
                        dispatch,
                        props.cellId,
                        (str)=>({language: str, contents})
                    )
                }
                value={ language }
            />
            <SingletonTextArea
                name={'cell' + props.cellId}
                className='editorCodeCell editorCell'
                onChange={
                    handleChangeFactory(
                        dispatch,
                        props.cellId,
                        (str)=>({language, contents: str})
                    )
                }
                value={ contents }
            />
        </>
    );
}


const CodeCellStrategy : CellRenderStrategy = {
    'display': DisplayCodeCell,
    'preview': PreviewCodeCell,
    'editor' : EditorCodeCell
}

export default CodeCellStrategy;