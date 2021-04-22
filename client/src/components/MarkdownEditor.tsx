import React, { useState, useRef, useEffect, Component } from 'react';
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

const MemoizedRenderer = React.memo(MarkdownRenderer);

interface PanelProps extends React.HTMLAttributes<HTMLElement>{}

function Panel({children, ...other} : PanelProps){
    return(
        <div className={ other.className }>
            { children }
        </div>
    )
}

interface PanelMenuProps extends React.HTMLAttributes<HTMLElement>{
    callback: () => void;
}

function PanelMenu({children, callback, ...other} : PanelMenuProps){
    return(
        <div className={ other.className } onClick = { (e) => callback() }>
            <label>
                { children }
            </label>
        </div>
    );
}

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

interface EditorProps extends React.HTMLAttributes<HTMLTextAreaElement>{
    body?: string;
    update?: (c : string) => void //can we do this w/o callback?
}

function MarkdownEditor({ body, update, ...other } : EditorProps) {
    const [value,setValue] = useState(body || '');
    const [activeIndex,setActiveIndex] = useState(1 as 1 | 2);
    let collapse = useMediaQuery({ query: `(max-width:768px)` }) || false;

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

                imgUploadHandler(blob);
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

    const [height,setHeight] = useState(400);
    const [y,setY] = useState(0);
    const [drag,setDrag] = useState(false);
    const resizeMouseMove = (e : MouseEvent) => {
        if(!drag) return;

        const dy = e.clientY - y;
        setY(e.clientY);
        setHeight( Math.min(Math.max(300,height + dy),800) );

        e.stopPropagation();
        e.preventDefault();
    }
    const resizeMouseUp = (e : MouseEvent) => {
        setDrag(false);
        document.body.style.removeProperty('cursor');

        e.stopPropagation();
        e.preventDefault();
    }
    const resizeMouseDown = (e : React.MouseEvent) => {
        setDrag(true);
        document.body.style.cursor = 'ns-resize';
        
        setY(e.clientY);

        e.stopPropagation();
        e.preventDefault();
    }

    useEffect(() => {
        if(drag){
            document.addEventListener('mousemove',resizeMouseMove);
            document.addEventListener('mouseup',resizeMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove',resizeMouseMove);
            document.removeEventListener('mouseup',resizeMouseUp);
        }
    },[drag]);
    // });

    return (
        <div className={ `active${ activeIndex }`+(collapse?' collapse':'') } style={{margin: 0}}>
            <div>
                <PanelMenu className='panelMenu1' callback = { () => setActiveIndex(1) }> 편집 </PanelMenu>
                <PanelMenu className='panelMenu2' callback = { () => setActiveIndex(2) }> 미리보기 </PanelMenu>
                <div style={ {clear:'both'} } />
            </div>
            <div className='panelWrapper' style={ {height: height} }>
                <Panel className='panel1'>
                    <MarkdownArea
                        {...other}
                        className={ `${other.className || ''} markdownArea` } 
                        onChange={ innerUpdate }
                        onPaste={ pasteHandler }
                        value = { value }
                    />
                </Panel>
                <Panel className='panel2'>
                    <PreviewArea className='previewArea markdown'>
                        <MemoizedRenderer>
                            { value }
                        </MemoizedRenderer>
                    </PreviewArea>
                </Panel>
                <div
                    className='resizer'
                    style={ {
                        clear:'both',
                        width: '100%',
                        height:'10px',
                        cursor: 'ns-resize'
                    } }
                    onMouseDown={ resizeMouseDown }
                />
            </div>
            

            <div className='dropzone'>
                <FileDropzone handleDrop={ (files) => imgUploadHandler(files[0]) } message='이미지 첨부하기' />
                <FileDropzone handleDrop={ (files) => fileUploadHandler(files[0]) } message='파일 첨부하기' />
            </div>

        </div>
    );
}

export default MarkdownEditor;