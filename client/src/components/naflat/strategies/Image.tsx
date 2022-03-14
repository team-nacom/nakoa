import React from 'react';

import { CellComponentProps, CellRenderStrategy, FlatContext } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';
import SingletonTextArea from './helpers/singletonTextArea';

import { fileUpload, imgUpload } from 'etc/FileUpload';
import { FileDropzone } from './helpers/FileDropzone';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';

// Image cell value type
interface ImageCellValue{
    src: string, //default value ''
    caption: string
}

function DisplayImageCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let { src, caption } = cell.value as ImageCellValue;

    const label = state.renderInfo.label;
    var perrefMap : Record<string,string> = {};
    for(var keyId in label){
        perrefMap[keyId] = label[keyId].custom || label[keyId].autoType.join('.');
    }

    return (
        <>
            <img className='imgCell' src={ src } alt=''
                onError = { (ev) =>{
                    if(ev.currentTarget.src !== '/altImg.png'){
                        ev.currentTarget.src = '/altImg.png';
                    }
                } }
            />
            <MarkdownRenderer
                inlineRenderClassName='imgCellCaption'
                inlineRenderPrefix=''
                mathMacros = { state.renderInfo.macros.math }
                perrefMap = { perrefMap }
            >
                { caption }
            </MarkdownRenderer>
        </>
    );
}


function PreviewImageCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let { src, caption } = cell.value as ImageCellValue;

    const label = state.renderInfo.label;
    var perrefMap : Record<string,string> = {};
    for(var keyId in label){
        perrefMap[keyId] = label[keyId].custom || label[keyId].autoType.join('.');
    }

    return (
        <>
            <img className='imgCell' src={ src } alt=''
                onError = { (ev) =>{
                    ev.preventDefault();
                    if(ev.currentTarget.src !== '/altImg.png'){
                        ev.currentTarget.src = '/altImg.png';
                    }
                } }
            />
            <MarkdownRenderer
                inlineRenderClassName='imgCellCaption'
                inlineRenderPrefix=''
                mathMacros = { state.renderInfo.macros.math }
                perrefMap = { perrefMap }
            >
                { caption }
            </MarkdownRenderer>
        </>
    );
}


function EditorImageCell(props: CellComponentProps){
    const { state, dispatch } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let { src, caption } = cell.value as ImageCellValue;

    return (
        <>
            <FileDropzone
                handleDrop={ async (files) =>{
                    // fileUploadHelper(
                    //     dispatch, props.cellId, files[0],
                    //     state.flat[props.cellId].value as string,
                    //     undefined, undefined,
                    //     str => str,
                    //     () => { console.log('파일 업로드 실패') }
                    // )
                    try{
                        src = await imgUpload(files[0]);
                        dispatch({
                            type: 'update', id: props.cellId,
                            value: { src, caption }
                        });
                    }
                    catch(err){
                        console.log('이미지 업로드 실패')
                    }

                } }
            >
                <img src={ src } alt=''
                    onError = { (ev) =>{
                        ev.preventDefault();
                        if(ev.currentTarget.src !== '/altImg.png'){
                            ev.currentTarget.src = '/altImg.png';
                        }
                    } }
                />
                { '이미지 드랍 혹은 클릭해서 업로드' }
            </FileDropzone>
            <input
                style={ props.style as any }
                className=''
                onChange={
                    handleChangeFactory(
                        dispatch,
                        props.cellId,
                        (str)=>({src, caption: str})
                    )
                }
                value={ caption }
            />
        </>
    );
}


const ImageCellStrategy : CellRenderStrategy = {
    'display': DisplayImageCell,
    'preview': PreviewImageCell,
    'editor' : EditorImageCell
}

export default ImageCellStrategy;