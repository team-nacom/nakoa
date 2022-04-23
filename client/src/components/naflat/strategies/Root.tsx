import React, { useEffect, useState } from 'react';

import { TCell } from '../cell';
import { FlatContext } from '../state';
import { CellComponentProps, CellRenderStrategy } from '../componentTypes';


import { handleChangeFactory } from './helpers/handlers';

import katex from 'katex';
import TeX from '@matejmazur/react-katex';

import SingletonTextArea from './helpers/singletonTextArea';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';

// Root cell value type
interface RootCellValue{
    mathMacro: string
}

function DisplayRootCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'root'>;

    return (
        <></> // 뭐 넣지??
    );
}


function PreviewRootCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'root'>;
    
    let { mathMacro } = cell.value;

    return (
        <div className='rootCell'>
            <table className='rootCellSettings'>
                <tr>
                    <td>설정 편집</td>
                    <td></td>
                </tr>
                <tr>
                    <td>수식 매크로</td>
                    <td>
                        <code>
                            { mathMacro }
                        </code>
                    </td>
                </tr>
            </table>
        </div>
    );
}


function EditorRootCell(props: CellComponentProps) {
    const { state, dispatch } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'root'>;

    let { mathMacro } = cell.value;

    let [mathMacroText, setMathMacro] = useState(mathMacro);

    if (props.funcRef){
        props.funcRef.current = () => {
            dispatch({
                type: 'update',
                id: props.cellId,
                value: {
                    mathMacro: mathMacroText
                } as RootCellValue
            });

            let macroPass = {};
            katex.renderToString(mathMacroText,{
                throwOnError: false,
                globalGroup: true,
                macros : macroPass
            }); //render once and discard the result!

            dispatch({
                type: 'updateMacro',
                mathMacroObj: macroPass
            });
        }
    }

    return <div className='editorRootCellWrapper'>
        <table className='rootCellSettings'>
            <tr>
                <td>설정 편집</td>
            </tr>
            <tr>
                <td>수식 매크로</td>
                <td>
                    <SingletonTextArea
                        className='editorRootCellTextArea editorCell'
                        initialSelectionStart={ state.cursorStart }
                        initialSelectionEnd={ state.cursorEnd }
                        value={ mathMacroText }
                        onChange={(ev)=>{ setMathMacro(ev.target.value) }}
                    />
                </td>
            </tr>
        </table>
    </div>
}


const RootCellStrategy: CellRenderStrategy = {
    'display': DisplayRootCell,
    'preview': PreviewRootCell,
    'editor': EditorRootCell
}

export default RootCellStrategy;