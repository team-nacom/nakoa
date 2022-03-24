import React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';

import { CellComponentProps, CellRenderStrategy, FlatContext } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';
import SingletonTextArea from './helpers/singletonTextArea';

// Code cell value type
interface CodeCellValue{
    language: string,
    contents: string
}

function DisplayCodeCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let { language, contents } = cell.value as CodeCellValue;

    return (
        <div className='codeCell'>
            <summary className='codeCellLabel'>
                코드
            </summary>
            <SyntaxHighlighter className='codeCellPreview'
                language = { language }
            >
                { contents }
            </SyntaxHighlighter>
        </div>
    );
}


function PreviewCodeCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let { language, contents } = cell.value as CodeCellValue;

    return (
        <div className='codeCell'>
            <summary className='codeCellLabel'>
                코드
            </summary>
            <SyntaxHighlighter className='codeCellPreview'
                language = { language }
            >
                { contents }
            </SyntaxHighlighter>
        </div>
    );
}


function EditorCodeCell(props: CellComponentProps){
    const { state, dispatch } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let { language, contents } = cell.value as CodeCellValue;

    return (
        <div className='editorCodeCellWrapper'>
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
        </div>
    );
}


const CodeCellStrategy : CellRenderStrategy = {
    'display': DisplayCodeCell,
    'preview': PreviewCodeCell,
    'editor' : EditorCodeCell
}

export default CodeCellStrategy;