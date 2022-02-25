import React from 'react';
import { CellComponentProps, CellRenderStrategy, FlatContext } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';

import katex from 'katex';
import TeX from '@matejmazur/react-katex';

import SingletonTextArea from './helpers/singletonTextArea';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';
const MemoizedRenderer = React.memo(MarkdownRenderer);

// Root cell value type
interface RootCellValue{
    mathMacro: string
}

function DisplayRootCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];

    return (
        <></> // 뭐 넣지??
    );
}


function PreviewRootCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let value = cell.value as RootCellValue;
    let macroText = value.mathMacro;

    return (
        <div className='rootCell'>
            설정 편집
            <label>수식 매크로 정의</label>
            <code>
                { macroText }
            </code>
        </div> // 뭐 넣지?? 제목 같은 거 전부 여기다 넣는 편이 좋을수도?
    );
}


function EditorRootCell(props: CellComponentProps) {
    const { state, dispatch } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let value = cell.value as RootCellValue;
    let macroText = value.mathMacro;


    return <div className='editorRootCellWrapper'>
        설정 편집
        <label>수식 매크로 정의</label>
        <SingletonTextArea
            initialSelectionStart={ state.cursorStart }
            initialSelectionEnd={ state.cursorEnd }
            onChange={(ev)=>{
                dispatch({
                    type: 'update',
                    id: props.cellId,
                    value: {
                        mathMacro: ev.target.value
                    } as RootCellValue
                });

                let macroPass = {};
                katex.renderToString(ev.target.value,{
                    throwOnError: false,
                    globalGroup: true,
                    macros : macroPass
                }); //render once and discard the result!

                console.log(macroPass);

                dispatch({
                    type: 'updateMacro',
                    mathMacro: macroPass
                });
            }}
            value={ macroText }
        />
    </div>
}


const RootCellStrategy: CellRenderStrategy = {
    'display': DisplayRootCell,
    'preview': PreviewRootCell,
    'editor': EditorRootCell
}

export default RootCellStrategy;