import React, { useEffect } from 'react';

import { CellComponentProps, CellRenderStrategy, FlatContext } from '../componentTypes';

import { handleChangeFactory, handlePasteFactory } from './helpers/handlers';
import SingletonTextArea from './helpers/singletonTextArea';

import { useDropzone } from 'react-dropzone';
import {
    imgUploadHelperFactory,
    fileUploadHelperFactory
} from './helpers/handlers';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';
const MemoizedRenderer = React.memo(MarkdownRenderer);

function DisplayTextCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <div className='textCell renderedTextCell'
            style={ props.style }
        >
            <MemoizedRenderer>
                {contents}
            </MemoizedRenderer>
        </div>
    );
}


function PreviewTextCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <div className='textCell renderedTextCell'
            style={ props.style }
        >
            <MemoizedRenderer openDetails>
                {contents}
            </MemoizedRenderer>
        </div>
    );
}


function EditorTextCell(props: CellComponentProps){
    const { state, dispatch } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    //reset cursor after render.
    useEffect(()=>{
        return ()=>{
            dispatch({ type: 'resetCursor' });
        }
    }, []);

    if(typeof contents !== 'string') return <></>;

    return (
        <>
            <SingletonTextArea
                initialSelectionStart={ state.cursorStart }
                initialSelectionEnd={ state.cursorEnd }
                style={ props.style as any }
                name={'cell' + props.cellId}
                className='editorTextCell editorCell'
                onChange={handleChangeFactory(props.cellId,dispatch)}
                onPaste={handlePasteFactory(props.cellId,dispatch)}
                value={contents}
            />
            <div className='dropzone'>
                <FileDropzone
                    handleDrop={ (files) => imgUploadHelperFactory(props.cellId, dispatch)(files[0], -1, -1, () => { console.log('이미지 업로드 실패') }) }
                    message={ '이미지 업로드' }
                />
                <FileDropzone
                    handleDrop={ (files) => fileUploadHelperFactory(props.cellId, dispatch)(files[0], -1, -1, () => { console.log('파일 업로드 실패') }) }
                    message={ '파일 업로드' }
                />
            </div>
        </>
    );
}

//TODO : dropzone은 별개 파일로 빼기

interface FileDropzoneProps {
    handleDrop: (acceptedFiles: File[]) => void;
    message?: string;
};

function FileDropzone({ handleDrop, message } : FileDropzoneProps) {
    const onDrop = React.useCallback(handleDrop, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  
    return (
        <>
            <label {...getRootProps()}>{ message }</label>
            <input {...getInputProps()} />
        </>
    )
}


const TextCellStrategy : CellRenderStrategy = {
    'display': DisplayTextCell,
    'preview': PreviewTextCell,
    'editor' : EditorTextCell
}

export default TextCellStrategy;