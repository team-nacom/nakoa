import React, { useState, useRef, useEffect, Component } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';

import { useMediaQuery } from 'react-responsive';

import MarkdownRenderer from './markdown/MarkdownRenderer';
// import { readBuilderProgram } from 'typescript';
import MarkdownManual from './MarkdownManual';

import { fileUpload, imgUpload } from '../etc/FileUpload'

import { FormattedMessage, useIntl } from 'react-intl';

const usePrevious = <T extends unknown>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

function EditorArea(props : React.TextareaHTMLAttributes<HTMLTextAreaElement>){
    let intl = useIntl(); //IS THIS OK???

    return(
        <textarea {...props} placeholder={ intl.formatMessage({id: 'editor.placeholder'}) } />
        // className={ (props.className || '') + ' editorArea' }
    )
}

const MemoizedRenderer = React.memo(MarkdownRenderer);
function PreviewArea({...props} : React.HTMLAttributes<HTMLDivElement>){
    return(
        <div {...props} />
    )
}



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
    label: string;
}

function PanelMenu({children, label, callback, ...other} : PanelMenuProps){
    return(
        <div className={ other.className } onClick = { (e) => callback() }>
            <label>{ label }</label>
            { children }
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
    const [previewValue,setPreviewValue] = useState(body || '');
    const [activeIndex,setActiveIndex] = useState(1 as 1 | 2);
    const [manualVisible,setManualVisible] = useState(false);
    const [autoRender,setAutoRender] = useState(true);

    const intl = useIntl();

    const preview = () => { setPreviewValue(value) }

    let collapse = useMediaQuery({ query: `(max-width:768px)` }) || false;
    const prevCollapse = usePrevious(collapse);
    useEffect(()=>{
        if(prevCollapse && !collapse){
            preview();
        }
    }, [collapse])


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

    const valueUpdate = (v : string) => {
        setValue(v);
        if(update){
            update(v);
        }
    }

    const innerUpdate = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        e.stopPropagation();

        //can we prevent double rendering??
        valueUpdate(e.target.value);
        if(!collapse && autoRender){
            setPreviewValue(e.target.value);
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
            alert( intl.formatMessage({id: 'editor.uploadFailed'}) );
        }

        return;
    }

    const fileUploadHandler = async (file: File) => {
        try{
            const fileUrl = await fileUpload(file);
            insertText(`[💾 ${ file.name }](${ fileUrl })`);
        } catch (error){
            // file uploading error handler
            alert( intl.formatMessage({id: 'editor.uploadFailed'}) );
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

    return (<>
        <div className={ `active${ activeIndex }`+(collapse?' collapse':'') } style={{margin: 0}}>
            <div>
                <PanelMenu className='panelMenu1' label={ intl.formatMessage({id: 'editor.edit'}) } callback = { () => setActiveIndex(1) }>
                    <button className='showManualBtn' onClick={ () => setManualVisible(true) }>
                        <span className="material-icons">help_outline</span>
                    </button>
                </PanelMenu>
                <PanelMenu className='panelMenu2' label={ intl.formatMessage({id: 'editor.preview'}) } callback = { () => {setActiveIndex(2);preview()} }> 
                    <button className={ 'autoRenderBtn'+(autoRender?' autoRenderActive':'') } onClick={ (e) =>{
                        setAutoRender(!autoRender);preview()
                    } } >
                        <span className="material-icons">{autoRender ? "sync" : "sync_disabled"}</span>
                    </button>
                </PanelMenu>
                <div style={ {clear:'both'} } />
            </div>
            <div className='panelWrapper' style={ {height: height} }>
                <Panel className='panel1'>
                    <EditorArea
                        {...other}
                        className={ `${other.className || ''} editorArea` } 
                        onChange={ innerUpdate }
                        onPaste={ pasteHandler }
                        value = { value }
                    />
                </Panel>
                <Panel className='panel2'>
                    <PreviewArea className='previewArea'>
                        <MemoizedRenderer>
                            { previewValue }
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
                <FileDropzone handleDrop={ (files) => imgUploadHandler(files[0]) } message={ intl.formatMessage({id: 'editor.attachImages'}) } />
                <FileDropzone handleDrop={ (files) => fileUploadHandler(files[0]) } message={ intl.formatMessage({id: 'editor.attachFiles'}) } />
            </div>
        </div>
        <MarkdownManual visible={manualVisible} setVisible={setManualVisible} />
    </>);
}

export default MarkdownEditor;