import React, { useState, useRef, useEffect, useCallback, Component } from 'react';
import { useTranslation } from 'react-i18next';

import { useMediaQuery } from 'react-responsive';

// import Markdown from '#/components/markdown-legacy/MarkdownRenderer'
import Markdown from '#/components/markdown/Markdown';

// import Manual from './MarkdownManual';
import { useClassicEditorAction, useClassicEditorContext } from './EditorState';

import { FileInput } from '../editor/FileInput';
import { attachmentIndexToUrl } from '#/api/file-local';
import { useFileMapDataAction, useFileMapState } from '../editor/FileMapState';

function insertText(text: string, elem? : HTMLTextAreaElement){
    if(!elem) return;

    // source: https://kubyshkin.name/posts/insert-text-into-textarea-at-cursor-position/
    const st = elem.selectionStart;
    const ed = elem.selectionEnd;

    elem.setRangeText(text, st, ed);
    elem.selectionStart = elem.selectionEnd = st + text.length;

    // notify to event listeners
    const e = new Event('change', {"bubbles": true, "cancelable": false});
    elem.dispatchEvent(e);
}

const MemoizedMarkdown = React.memo(Markdown);

const usePrevious = <T extends unknown>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => { ref.current = value; });
    return ref.current;
};

// function EditorArea({ textareaRef, ...props } : React.TextareaHTMLAttributes<HTMLTextAreaElement> & { textareaRef: React.RefObject<HTMLTextAreaElement> } ){
//     let { i18n } = useTranslation('translation');

//     return(
//         <textarea ref={ textareaRef }
//             {...props}
//             placeholder={ i18n.t('editor.placeholder') ?? undefined }
//         />
//         // className={ (props.className || '') + ' editorArea' }
//     )
// }

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

// editor core

interface ClassicEditorBodyProps extends React.HTMLAttributes<HTMLTextAreaElement>{
    // update?: (c : string) => void
    localIndex?: string;
}

export function EditorCore({ localIndex, ...other } : ClassicEditorBodyProps) {
    const {
        text, previewText
    } = useClassicEditorContext(state => state) //should be initialized in the top component.
    const { setText, setPreviewText } = useClassicEditorAction();

    const { map } = useFileMapState();
    const { addFile, removeFile } = useFileMapDataAction();

    const [activeIndex,setActiveIndex] = useState(1 as 1 | 2);
    // const [manualVisible,setManualVisible] = useState(false);
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
    }, [collapse]);

    const keydownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') { // set tab key to insert two whitespaces
            e.preventDefault();
            insertText('  ', textareaRef.current ?? undefined);
        }
    }

    const changeHandler = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        e.stopPropagation();

        //can we prevent double rendering??
        setText(e.target.value);
        if(!collapse && autoRender){
            setPreviewText(e.target.value);
        }
    }
    
    const pasteHandler = async (e : React.ClipboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        e.stopPropagation();
    
        const elem = e.currentTarget;
    
        // text
        let text = e.clipboardData.getData('text/plain');
        if(text){
            insertText(text, elem);
            return;
        }
    
        // images
        const items = e.clipboardData.items
        for(var i = 0; i < items.length; ++i){
            if(items[i].type.startsWith('image/')){ //image detected
                const blob = items[i].getAsFile();
                if(blob == null) continue;

                addFile(blob, undefined, async path => {
                    insertText(`\n![](${ await attachmentIndexToUrl(path) })\n`, elem);
                });
                return;
            }
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
                    <textarea ref={ textareaRef }
                        {...other}
                        className={ `${other.className ?? ''} editorArea` } 
                        placeholder={ i18n.t('editor.placeholder') ?? undefined }
                        onKeyDown={ keydownHandler }
                        onPaste={ pasteHandler }
                        onChange={ changeHandler }
                        value = { text }
                    />
                    {/* <EditorArea
                        {...other}
                        textareaRef={ textareaRef }
                        className={ `${other.className ?? ''} editorArea` } 
                        onChange={ innerUpdate }
                        onPaste={ pasteHandler }
                        value = { text }
                    /> */}
                </Panel>
                <Panel className='panel2'>
                    <PreviewArea className='previewArea'>
                        <MemoizedMarkdown /* usePriority useTOC openDetails */
                            // mathMacroObj={ {} }
                            fileMap = { map }
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

            <FileInput
                imgUploadHandler={async (file, path) => {
                    insertText(`\n![](${ await attachmentIndexToUrl(path) })\n`, textareaRef.current ?? undefined);
                }}
                fileUploadHandler={async (file, path) => {
                    insertText(`[💾 ${ file.name }](${ await attachmentIndexToUrl(path) })`, textareaRef.current ?? undefined);
                }} //todo
            />
        </div>
        {/* <Manual visible={manualVisible} setVisible={setManualVisible} /> */}
    </div>);
}