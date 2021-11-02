import React, { useState, useRef, useEffect, Component } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMediaQuery } from 'react-responsive';

import { FormattedMessage, useIntl } from 'react-intl';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';
// import { readBuilderProgram } from 'typescript';

import Manual from './MarkdownManual';
import { useTextEditorState, useNaBubbleState, dispatchNaBubbleState as dispatch } from './globals';
import { EditorRootBubble, PreviewRootBubble, RenderedRootBubble } from 'components/nabubble';

import { insertText, pasteHandler, imgUploadHelper, fileUploadHelper } from './handlers';

const usePrevious = <T extends unknown>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => { ref.current = value; });
    return ref.current;
};

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

function BubbleEditor({ body, ...other } : EditorProps) {
    const [activeIndex,setActiveIndex] = useState(1 as 1 | 2);
    const [manualVisible,setManualVisible] = useState(false);
    const [autoRender,setAutoRender] = useState(true);

    const intl = useIntl();

    const preview = () => { dispatch({ type: 'preview' }); console.log('fire!!') }

    let collapse = useMediaQuery({ query: `(max-width:768px)` }) || false;
    const prevCollapse = usePrevious(collapse);
    useEffect(()=>{
        if(prevCollapse && !collapse) preview();
    }, [collapse])

    // const innerUpdate = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     //can we prevent double rendering??
    //     setText(e.target.value);
    //     if(!collapse && autoRender){
    //         setPreviewText(e.target.value);
    //     }
    // }

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
                        setAutoRender(!autoRender);
                        if(!autoRender) dispatch({ type: 'previewFreeze' });
                        else preview();
                    } } >
                        <span className="material-icons">{autoRender ? "sync" : "sync_disabled"}</span>
                    </button>
                </PanelMenu>
                <div style={ {clear:'both'} } />
            </div>
            <div className='panelWrapper' style={ {height: height} }>
                <Panel className='panel1'>
                    <div className='editorArea'>
                        <EditorRootBubble
                            {...other}
                            // onChange={ innerUpdate }
                            onPaste={ pasteHandler }
                        />
                    </div>
                </Panel>
                <Panel className='panel2'>
                    <div className='previewArea'>
                        {/* <PreviewRootBubble /> */}
                        <RenderedRootBubble />
                    </div>
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
                <FileDropzone handleDrop={ (files) => imgUploadHelper(files[0], document.activeElement as HTMLTextAreaElement || document.getElementsByTagName('textarea')[0] || undefined, uploadErrorHandler) } message={ intl.formatMessage({id: 'editor.attachImages'}) } />
                <FileDropzone handleDrop={ (files) => fileUploadHelper(files[0], document.activeElement as HTMLTextAreaElement || document.getElementsByTagName('textarea')[0] || undefined, uploadErrorHandler) } message={ intl.formatMessage({id: 'editor.attachFiles'}) } />
            </div>
            { /* can we memoize last active element?? */ }
        </div>
        <Manual visible={manualVisible} setVisible={setManualVisible} />
    </>);
}

export default BubbleEditor;