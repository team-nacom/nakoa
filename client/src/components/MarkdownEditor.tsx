import React, { useState, useRef, Component } from 'react';
import styled from 'styled-components';

import { useMediaQuery } from 'react-responsive';

import MarkdownRenderer from './markdown/MarkdownRenderer';
// import { readBuilderProgram } from 'typescript';

import { upload } from '../etc/FileUpload'

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

interface EditorProps extends React.HTMLAttributes<HTMLTextAreaElement>{
    body?: string;
    collapse?: boolean;
    update: (c : string) => void //can we do this w/o callback?
}

function MarkdownEditor({ body, collapse, update, ...other } : EditorProps) {
    const fileElem = useRef<HTMLInputElement>(null);

    const [value,setValue] = useState(body || '');
    const [activeIndex,setActiveIndex] = useState(1 as number | string);
    let _collapse = useMediaQuery({ query: `(max-width:768px)` }) || collapse || false;
    // collapse priority: mobile true > argument > default false(i.e. parallel)

    const innerUpdate = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        update(e.target.value);
    }

    const pasteHandler = (e : React.ClipboardEvent<HTMLTextAreaElement>) => {
    handler : {
        let text = e.clipboardData.getData('text/plain');
        if(text){
            document.execCommand('insertText',false,text);
            break handler;
        }

        // images
        for(const item of e.clipboardData.items){
            if(item.type.indexOf('image') === 0){ //image detected
                const blob = item.getAsFile();
                if(blob == null) break;

                // inline image insertion
                const reader = new FileReader();
                reader.onload = (e2) =>{
                    var res = e2.target!.result;
                    if(typeof res === 'string'){
                        document.execCommand('insertText',false,`![](${res})`);
                    }
                }
                reader.readAsDataURL(blob);
                // WARNING : DO NOT PASTE IMG >100px. MUST be altered to server upload.

                break handler;
            }
        }
    }
        e.preventDefault();
    }

    const uploader = async () => {
        if(fileElem.current!.files == null) return false;

        const file = fileElem.current!.files[0];

        try{
            const fileUrl = await upload(file);
            document.execCommand('insertText',false,`\n![](${ fileUrl })\n\n`);
        } catch (error){
            // file uploading error handler
            console.log('파일 업로드에 실패했습니다.')
        } finally {
            fileElem.current!.value = '';
        }

        return false;
    }

    return (
        <>
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
                <PreviewArea className='blog previewArea'>
                    <MarkdownRenderer style={ {padding: '4px'} } source={ value } />
                </PreviewArea>
            </Panel>
            <div style={ {clear:'both'} }></div>

            <label htmlFor='fileUpload'> 이미지 첨부 </label>
            <input type='file' id='fileUpload' name='fileUpload' ref={ fileElem } />
            <button type='submit' onClick={ uploader } >업로드</button>
        </>
    );
}

export default MarkdownEditor;