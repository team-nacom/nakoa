import React, { useState, useRef, useEffect, Component } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMediaQuery } from 'react-responsive';

import { FormattedMessage, useIntl } from 'react-intl';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';
// import { readBuilderProgram } from 'typescript';

import Manual from './MarkdownManual';
import { useTextEditorState } from './globals';

import { insertText, pasteHandler, imgUploadHelper, fileUploadHelper } from './handlers';

const usePrevious = <T extends unknown>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => { ref.current = value; });
    return ref.current;
};

function EditorArea(props : React.TextareaHTMLAttributes<HTMLTextAreaElement> & { textareaRef: React.RefObject<HTMLTextAreaElement> } ){
    let intl = useIntl();

    return(
        <textarea
            {...props}
            placeholder={ intl.formatMessage({id: 'editor.placeholder'}) }
        />
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

function TextEditor({ body, ...other } : EditorProps) {
    const [text,setText] = useTextEditorState('text'); //should be initialized in the top component.
    const [previewText,setPreviewText] = useTextEditorState('previewText');
    //should be initialized in the top component.

    const [activeIndex,setActiveIndex] = useState(1 as 1 | 2);
    const [manualVisible,setManualVisible] = useState(false);
    const [autoRender,setAutoRender] = useState(true);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const intl = useIntl();

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
        alert( intl.formatMessage({id: 'editor.uploadFailed'}));
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
                        textareaRef={ textareaRef }
                        className={ `${other.className || ''} editorArea` } 
                        onChange={ innerUpdate }
                        onPaste={ pasteHandler }
                        value = { text }
                    />
                </Panel>
                <Panel className='panel2'>
                    <PreviewArea className='previewArea'>
                        <MemoizedRenderer usePriority useTOC openDetails>
                            { previewText }
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
                <FileDropzone handleDrop={ (files) => imgUploadHelper(files[0], textareaRef.current || undefined, uploadErrorHandler) } message={ intl.formatMessage({id: 'editor.attachImages'}) } />
                <FileDropzone handleDrop={ (files) => fileUploadHelper(files[0], textareaRef.current || undefined, uploadErrorHandler) } message={ intl.formatMessage({id: 'editor.attachFiles'}) } />
            </div>
        </div>
        <Manual visible={manualVisible} setVisible={setManualVisible} />
    </>);
}

export default TextEditor;