import React, { useState, useRef, useEffect, Component } from 'react';
import { useTranslation } from 'react-i18next';

import { useDropzone } from 'react-dropzone';
import { useMediaQuery } from 'react-responsive';

// import Markdown from '#/components/markdown-legacy/MarkdownRenderer'
import Markdown from '#/components/markdown/Markdown';
// import { readBuilderProgram } from 'typescript';

// import Manual from './MarkdownManual';
import Manual from './MarkdownManual';
import { useClassicEditorAction, useClassicEditorContext } from './EditorState';

import { insertText, pasteHandler, imgUploadHelper, fileUploadHelper } from './handlers'

const MemoizedMarkdown = React.memo(Markdown);

const usePrevious = <T extends unknown>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => { ref.current = value; });
    return ref.current;
};

function EditorArea(props : React.TextareaHTMLAttributes<HTMLTextAreaElement> & { textareaRef: React.RefObject<HTMLTextAreaElement> } ){
    let { i18n } = useTranslation('translation');

    return(
        <textarea
            {...props}
            placeholder={ i18n.t('editor.placeholder') ?? undefined }
        />
        // className={ (props.className || '') + ' editorArea' }
    )
}

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

interface ClassicEditorBodyProps extends React.HTMLAttributes<HTMLTextAreaElement>{
    update?: (c : string) => void //can we do this w/o callback?
}

export function EditorCore({ update, ...other } : ClassicEditorBodyProps) {
    const {
        text, previewText
    } = useClassicEditorContext(state => state) //should be initialized in the top component.
    const { setText, setPreviewText } = useClassicEditorAction();

    const [activeIndex,setActiveIndex] = useState(1 as 1 | 2);
    const [manualVisible,setManualVisible] = useState(false);
    const [autoRender,setAutoRender] = useState(true);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { i18n } = useTranslation('translation');

    const preview = () => { setPreviewText(text) }

    let collapse = useMediaQuery({ query: `(max-width:768px)` }) || false;
    const prevCollapse = usePrevious(collapse);
    useEffect(()=>{
        if(prevCollapse && !collapse){
            preview();
        }
    }, [collapse])

    const innerUpdate = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        e.stopPropagation();

        //can we prevent double rendering??
        setText(e.target.value);
        if(!collapse && autoRender){
            setPreviewText(e.target.value);
        }
    }

    const uploadErrorHandler = (e: unknown) => {
        alert( i18n.t('editor.uploadFailed') );
    }

    //resizing
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

    return (<div className='classicEditorWrapper'>
        <div className={ `active${ activeIndex }`+(collapse?' collapse':'') } style={{margin: 0}}>
            <div>
                <PanelMenu className='panelMenu1' label={ i18n.t('editor.edit') ?? '' } callback = { () => setActiveIndex(1) }>
                    {/* <button className='showManualBtn' onClick={ () => setManualVisible(true) }>
                        <span className="material-icons">help_outline</span>
                    </button> */}
                </PanelMenu>
                <PanelMenu className='panelMenu2' label={ i18n.t('editor.preview') ?? '' } callback = { () => {setActiveIndex(2);preview()} }> 
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
                        textareaRef={ textareaRef }
                        className={ `${other.className || ''} editorArea` } 
                        onChange={ innerUpdate }
                        onPaste={ pasteHandler }
                        value = { text }
                    />
                </Panel>
                <Panel className='panel2'>
                    <PreviewArea className='previewArea'>
                        <MemoizedMarkdown /* usePriority useTOC openDetails */
                            // mathMacroObj={ {} }
                        >
                            { previewText }
                        </MemoizedMarkdown>
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
                <FileDropzone handleDrop={ (files) => imgUploadHelper(files[0], textareaRef.current || undefined, uploadErrorHandler) } message={ i18n.t('editor.attachImages') ?? '' } />
                <FileDropzone handleDrop={ (files) => fileUploadHelper(files[0], textareaRef.current || undefined, uploadErrorHandler) } message={ i18n.t('editor.attachFiles') ?? '' } />
            </div>
        </div>
        {/* <Manual visible={manualVisible} setVisible={setManualVisible} /> */}
    </div>);
}