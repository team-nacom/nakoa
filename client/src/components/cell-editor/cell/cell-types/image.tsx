import React, { useCallback, useEffect, useState } from 'react';

import { Rnd } from 'react-rnd';
import { Resizable } from 're-resizable';

import { BasicCell } from '#common/BasicCell';
import { RenderMode, Renderer, CellTypeRendererProps } from '../types-render';

import {
    useRenderData,
    useCellEditorAction,
} from '#/components/cell-editor/editor/EditorState';

import { FileDropzone } from '#/components/helpers/FileDropzone';

import Markdown from '#/components/markdown/Markdown'
import { postImage, resolveImageUrl } from '#/api/file';

// export const imageCellName = 'image'
export interface ImageCellField{
    caption: string,
    src: string,
    width: number,
    // height?: number,
}

export const imageCellDefault: ImageCellField = {
    caption: '',
    src: '', // this should be resolved into fallback url (via `resolveImageUrl`)
    width: 160,
    // height: 160,
};
type ImageCell = BasicCell<ImageCellField,'image'> // only used in this file

// renderers

interface ImageProps{
    src: string,
    caption: string,
}
function Image(props: ImageProps){
    return (
        <Resizable lockAspectRatio
            enable={ { top: false, right: false, bottom:false, left: false } }
            bounds='parent'
        >
            <img className='imageCellImage'
                style={ { objectFit: 'contain' } }
                src={ props.src }
                // width={ props.width } // width as pixel.
                alt={ props.caption }
                onError = { async (ev) =>{
                    let fallbackSrc = await resolveImageUrl(imageCellDefault.src);
                    if(ev.currentTarget.src !== fallbackSrc){
                        ev.currentTarget.src = fallbackSrc; // setting this will trigger reload
                    }
                } }
            />
        </Resizable>
    );
}


function ImageCellViewer({ mode, cell } : CellTypeRendererProps<ImageCell>){
    const { mathMacroObj, label, labelTypewise } = useRenderData();

    const [resolvedSrc, setResolvedSrc] = useState<string | undefined>();
    useEffect(()=>{
        resolveImageUrl(cell.src).then(setResolvedSrc);
    }, [cell.src]);

    return (
        <div className='editorImageCellWrapper'>
            {/* <Image {...cell} /> */}
            <img className='imageCellImage'
                style={ { objectFit: 'contain' } }
                src={ resolvedSrc }
                width={ cell.width } // width as pixel.
                alt={ cell.caption }
                onError = { async (ev) =>{
                    setResolvedSrc(await resolveImageUrl(''));
                }}
            />
            <Markdown
                mathMacroObj={ mathMacroObj }
                perrefMap={ labelTypewise }
            >
                { cell.caption }
            </Markdown>
        </div>
    )
}



function ImageCellEditor({ cell }: Omit<CellTypeRendererProps<ImageCell>,'mode'>){
    // const {} = useRenderData()
    const editorAction = useCellEditorAction();

    const [aspectRatio, setAspectRatio] = useState(1); // height / width

    const [resolvedSrc, setResolvedSrc] = useState<string | undefined>();
    useEffect(()=>{
        resolveImageUrl(cell.src).then(setResolvedSrc);
    }, [cell.src]);

    const setWidth = useCallback((width: number) => {
        let change: Partial<ImageCellField> = { width };
        editorAction.update(cell.id, change);
    }, [cell.id]);

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        let change: Partial<ImageCellField> = {
            caption: ev.target.value
        };
        editorAction.update(cell.id, change);
    }, [cell.id])

    const uploadHandler: (files: File[]) => void | Promise<void> = useCallback(async (files) => {
        try{
            let { url } = await postImage(files[0]);
            let change: Partial<ImageCellField> = {
                src: url
            };
            editorAction.update(cell.id, change);
        }
        catch(err){
            console.log('이미지 업로드 실패');
        }
    }, [cell.id])

    return (
        <div className='editorImageCellWrapper'>
            <FileDropzone
                handleDrop={ uploadHandler }
                accept = 'image/*'
            >
                {cell.src !== imageCellDefault.src &&
                    <Resizable lockAspectRatio
                        style={ {margin:'auto'} }
                        minWidth={32} maxWidth={1080}
                        size={ { width: cell.width, height: cell.width * aspectRatio } }
                        enable={ { bottom: true, bottomLeft: true, bottomRight: true, left: true, right: true } }
                        bounds='parent'
                        onResizeStop={ (e, dir, ref, d) => {
                            setWidth(cell.width + d.width);
                        } }
                    >
                        <img className='imageCellImage'
                            style={ { width: '100%', height: '100%' } }
                            src={ resolvedSrc }
                            alt={ cell.caption }
                            onLoad={ (ev) => {
                                if(cell.width === undefined ){
                                    setWidth( ev.currentTarget.naturalWidth );
                                }
                                setAspectRatio(
                                    ev.currentTarget.naturalHeight / ev.currentTarget.naturalWidth
                                );
                            } }
                            onError = { async (ev) =>{
                                setResolvedSrc(await resolveImageUrl(''));
                            } }
                        />
                    </Resizable>
                }
                <p>{ '이미지 드랍 혹은 클릭해서 업로드' }</p>
            </FileDropzone>

            <input autoFocus
                className='editorImageCellInput'
                value={ cell.caption }
                onChange={ changeHandler }
            />
        </div>
    )
}


export function ImageCellRenderer({ mode, cell }: CellTypeRendererProps<ImageCell>){
    if(mode !== RenderMode.EDITOR){
        return <ImageCellViewer mode={ mode } cell={ cell } />
    }

    return <ImageCellEditor cell={ cell } />
}