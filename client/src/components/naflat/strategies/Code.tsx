import React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';

import { TCell } from '../cell';
import { FlatContext } from '../state';
import { CellComponentProps, CellRenderStrategy } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';
import SingletonTextArea from './helpers/singletonTextArea';

function DisplayCodeCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId] as TCell<'code'>;
    let { language, contents } = cell.value;

    return (
        <div className='codeCell'>
            <summary className='codeCellLabel'>
                코드
            </summary>
            <SyntaxHighlighter className='codeCellPreview'
                language={language}
            >
                {contents}
            </SyntaxHighlighter>
        </div>
    );
}


function PreviewCodeCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'code'>;

    let { language, contents } = cell.value;

    return (
        <div className='codeCell'>
            <summary className='codeCellLabel'>
                코드
            </summary>
            <SyntaxHighlighter className='codeCellPreview'
                language={language}
            >
                {contents}
            </SyntaxHighlighter>
        </div>
    );
}


function EditorCodeCell(props: CellComponentProps) {
    const { state, dispatch } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'code'>;

    let { language, contents } = cell.value;

    return (
        <div className='editorCodeCellWrapper'>
            <input
                className='codeCellCaptionForm'
                onChange={
                    handleChangeFactory(
                        dispatch,
                        props.cellId,
                        (str) => ({ language: str, contents })
                    )
                }
                value={language}
            />
            <SingletonTextArea
                name={'cell' + props.cellId}
                className='editorCodeCell editorCell'
                onChange={
                    handleChangeFactory(
                        dispatch,
                        props.cellId,
                        (str) => ({ language, contents: str })
                    )
                }
                value={contents}
            />
        </div>
    );
}


const CodeCellStrategy: CellRenderStrategy = {
    'display': DisplayCodeCell,
    'preview': PreviewCodeCell,
    'editor': EditorCodeCell
}

export default CodeCellStrategy;