import React, { useState, useRef, Component } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';

import { useMediaQuery } from 'react-responsive';

import MarkdownRenderer from './markdown/MarkdownRenderer';
// import { readBuilderProgram } from 'typescript';

import { fileUpload, imgUpload } from '../etc/FileUpload'

function MarkdownArea(props : React.TextareaHTMLAttributes<HTMLTextAreaElement>){
    return(
        <textarea {...props} placeholder='Markdown 및 LaTeX 수식 입력 가능' />
        // className={ (props.className || '') + ' markdownArea' }
    )
}
function PreviewArea(props : React.HTMLAttributes<HTMLDivElement>){
    return(
        <div {...props} />
        // className={ (props.className || '') + ' previewArea' }
    )
}

interface PanelProps extends React.HTMLAttributes<HTMLElement>{
    collapse: boolean;
    activeIndex: number | string;
    index: number | string;
}

function Panel({children, collapse, activeIndex, index, ...other} : PanelProps){
    return(
        <div style={ {
            float: 'left',
            width: collapse? '100%' : '50%',
            display: (collapse && activeIndex !== index) ? 'none' : 'flex'
        } }>
            { children }
        </div>
    )
}

interface PanelMenuProps extends React.HTMLAttributes<HTMLElement>{
    collapse: boolean;
    activeIndex: number | string;
    index: number | string;
    callback: (newActiveIndex : number | string) => void;
}

function PanelMenu({children, collapse, activeIndex, index, callback, ...other} : PanelMenuProps){
    return(
        <>
            <div className = 'panelMenuWrapper' style={ {
                float: 'left',
                width: collapse? 'auto' : '50%',
            } }>
                <button
                className = { 'panelMenu' + ((collapse && activeIndex === index) ? ' selected' : '') }
                onClick = { (e)=> { callback(index) } }
                disabled = { !collapse }>
                    { children }
                </button>
            </div>
        </>
    )
}

interface FileDropzoneProps {
    handleDrop: (acceptedFiles: File[]) => void;
    message?: string;
};

function FileDropzone({ handleDrop, message } : FileDropzoneProps) {
    const onDrop = React.useCallback(handleDrop, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  
    return (
      <button {...getRootProps()}>
        <input {...getInputProps()} />
        { message }
      </button>
    )
  }

interface EditorProps extends React.HTMLAttributes<HTMLTextAreaElement>{
    body?: string;
    collapse?: boolean;
    update?: (c : string) => void //can we do this w/o callback?
}

function MarkdownEditor({ body, collapse, update, ...other } : EditorProps) {
    const [value,setValue] = useState(body || '');
    const [activeIndex,setActiveIndex] = useState(1 as number | string);
    let _collapse = useMediaQuery({ query: `(max-width:768px)` }) || collapse || false;
    // collapse priority: mobile true > argument > default false(i.e. parallel)

    const insertText = (text : string) => {
        const isSuccess = document.execCommand('insertText', false, text);

        if(!isSuccess){
            const mdArea = document.getElementsByTagName('textarea')[0] as HTMLTextAreaElement;

            if(!mdArea) return;

            // source: https://kubyshkin.name/posts/insert-text-into-textarea-at-cursor-position/
            const st = mdArea.selectionStart;
            const ed = mdArea.selectionEnd;

            mdArea.setRangeText(text, st, ed);
            mdArea.selectionStart = mdArea.selectionEnd = st + text.length;

            // notify to event listeners
            const e = document.createEvent('UIEvent');
            e.initEvent('input',true,false);
            mdArea.dispatchEvent(e);
        }
    }

    const innerUpdate = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        e.stopPropagation();

        //can we prevent double rendering??
        setValue(e.target.value);
        if(update){
            update(e.target.value);
        }
    }

    const pasteHandler = async (e : React.ClipboardEvent<HTMLTextAreaElement>) => {
    handler : {
        let text = e.clipboardData.getData('text/plain');
        if(text){
            insertText(text);
            break handler;
        }

        // images
        for(const item of e.clipboardData.items){
            if(item.type.indexOf('image') === 0){ //image detected
                const blob = item.getAsFile();
                if(blob == null) continue;

                try{
                    const imgUrl = await imgUpload(blob);
                    insertText(`\n![](${ imgUrl })\n`);
                } catch (error){
                    //img uploading error handler
                    alert('이미지 업로드에 실패했습니다.');
                }

                break handler;
            }
        }
    }
        e.preventDefault();
        e.stopPropagation();
    }

    const imgUploadHandler = async (file: File) => {
        try{
            const imgUrl = await imgUpload(file);
            insertText(`\n![](${ imgUrl })\n`);
        } catch (error){
            // img uploading error handler
            alert('이미지 업로드에 실패했습니다.');
        }

        return;
    }

    const fileUploadHandler = async (file: File) => {
        try{
            const fileUrl = await fileUpload(file);
            insertText(`[💾 ${ file.name }](${ fileUrl })`);
        } catch (error){
            // file uploading error handler
            alert('파일 업로드에 실패했습니다.');
        }

        return;
    }

    return (
        <div style={{margin: 0}}>
            <PanelMenu collapse = { _collapse } activeIndex={ activeIndex } index={1} callback = { setActiveIndex }>편집</PanelMenu>
            <PanelMenu collapse = { _collapse } activeIndex={ activeIndex } index={2} callback = { setActiveIndex }>미리보기</PanelMenu>
            <Panel collapse = { _collapse } activeIndex={ activeIndex } index={1} >
                <MarkdownArea
                    {...other}
                    className={ `${other.className || ''} markdownArea` } 
                    onChange={ innerUpdate }
                    onPaste={ pasteHandler }
                    value = { value }
                />
            </Panel>
            <Panel collapse = { _collapse } style={ { float: 'right'} } activeIndex={ activeIndex } index={2}>
                <PreviewArea className='previewArea markdown'>
                    <MarkdownRenderer>
                        { value }
                    </MarkdownRenderer>
                </PreviewArea>
            </Panel>
            <div style={ {clear:'both'} }></div>

            <FileDropzone handleDrop={ (files) => imgUploadHandler(files[0]) } message='이미지 첨부하기' />
            <FileDropzone handleDrop={ (files) => fileUploadHandler(files[0]) } message='파일 첨부하기' />

        </div>
    );
}

export default MarkdownEditor;