import React from 'react';

import { TCell } from '../cell';
import { FlatContext } from '../state';
import { CellComponentProps, CellRenderStrategy } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';
import SingletonTextArea from './helpers/singletonTextArea';

import { fileUpload, imgUpload } from 'etc/FileUpload';
import { FileDropzone } from './helpers/FileDropzone';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';

function DisplayImageCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'image'>;

    let { src, width, caption } = cell.value;

    const label = state.typedLabel;

    return (
        <div className='imageCell'>
            <img className='imageCellImage'
                src={ src }
                width={ width } // width as pixel.
                alt=''
                onError = { (ev) =>{
                    if(ev.currentTarget.src !== '/altImg.png'){
                        ev.currentTarget.src = '/altImg.png';
                    }
                } }
            />
            <MarkdownRenderer
                inlineRenderClassName='imageCellCaption'
                inlineRenderPrefix=''
                mathMacroObj = { state.mathMacroObj }
                perrefMap = { label }
            >
                { caption }
            </MarkdownRenderer>
        </div>
    );
}


function PreviewImageCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'image'>;

    let { src, width, caption } = cell.value;

    const label = state.typedLabel;

    return (
        <div className='imageCell'>
            <img className='imageCellImage'
                src={ src }
                width={ width } //width as pixel
                alt=''
                onError = { (ev) =>{
                    ev.preventDefault();
                    if(ev.currentTarget.src !== '/altImg.png'){
                        ev.currentTarget.src = '/altImg.png';
                    }
                } }
            />
            <MarkdownRenderer
                inlineRenderClassName='imageCellCaption'
                inlineRenderPrefix=''
                mathMacroObj = { state.mathMacroObj }
                perrefMap = { label }
            >
                { caption }
            </MarkdownRenderer>
        </div>
    );
}


function EditorImageCell(props: CellComponentProps){
    const { state, dispatch } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'image'>;

    let { src, width, caption } = cell.value;

    return (
        <div className='imageCell'>
            {src !== '/altImg.png' &&
                <input type='range' className='imageCellSlider'
                    min = { 32 }
                    max = { 720 }
                    value={ width }
                    onChange={
                        handleChangeFactory(
                            dispatch,
                            props.cellId,
                            (str) => ({src, width: Number(str), caption})
                        )
                    }
                />
            }
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
                            value: { src, width, caption }
                        });
                    }
                    catch(err){
                        console.log('이미지 업로드 실패')
                    }

                } }
            >
                <img className='imageCellImage'
                    src={ src }
                    width={ width } //width as pixel
                    alt=''
                    onError = { (ev) =>{
                        ev.preventDefault();
                        if(ev.currentTarget.src !== '/altImg.png'){
                            ev.currentTarget.src = '/altImg.png';
                        }
                    } }
                />
                <p> { '이미지 드랍 혹은 클릭해서 업로드' } </p>
            </FileDropzone>
            <input
                className='imageCellCaptionForm'
                onChange={
                    handleChangeFactory(
                        dispatch,
                        props.cellId,
                        (str)=>({src, width, caption: str})
                    )
                }
                value={ caption }
            />
        </div>
    );
}


const ImageCellStrategy : CellRenderStrategy = {
    'display': DisplayImageCell,
    'preview': PreviewImageCell,
    'editor' : EditorImageCell
}

export default ImageCellStrategy;