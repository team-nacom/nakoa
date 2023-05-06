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
import { resolveUrlWithMap, attachmentIndexToUrl } from '#/api/file-local';
import { useFileMapDataAction, useFileMapState } from '#/components/editor/FileMapState';
import usePromise from '#/misc/usePromise';

function useObjectURLState(){
    const [str, setStr] = useState<string | undefined>();
    const changeStr = (newStr: string) => {
        setStr(oldStr => {
            if(oldStr?.startsWith('blob:')){
                URL.revokeObjectURL(oldStr);
            }
            return newStr;
        })
    }
    return [str, changeStr] as const;
}

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

// interface ImageProps{
//     src: string,
//     caption: string,
// }
// function Image(props: ImageProps){
//     const { map } = useFileMapState();

//     return (
//         <Resizable lockAspectRatio
//             enable={ { top: false, right: false, bottom:false, left: false } }
//             bounds='parent'
//         >
//             <img className='imageCellImage'
//                 style={ { objectFit: 'contain' } }
//                 src={ props.src }
//                 // width={ props.width } // width as pixel.
//                 alt={ props.caption }
//                 onError = { async (ev) =>{
//                     let fallbackSrc = await resolveUrlWithMap(imageCellDefault.src, map);
//                     if(ev.currentTarget.src !== fallbackSrc){
//                         ev.currentTarget.src = fallbackSrc; // setting this will trigger reload
//                     }
//                 } }
//             />
//         </Resizable>
//     );
// }


function ImageCellViewer({ mode, cell } : CellTypeRendererProps<ImageCell>){
    const { mathMacroObj, label, labelTypewise, publicIndex } = useRenderData();
    const { map } = useFileMapState();

    const [resolvedSrc, setResolvedSrc] = useObjectURLState();
    useEffect(()=>{
        resolveUrlWithMap(cell.src, map, publicIndex, true).then(setResolvedSrc);
    }, [cell.src]);

    return (
        <div className='editorImageCellWrapper'>
            {/* <Image {...cell} /> */}
            {resolvedSrc !== undefined &&
                <img className='imageCellImage'
                    style={ { objectFit: 'contain' } }
                    src={ resolvedSrc }
                    width={ cell.width } // width as pixel.
                    alt={ cell.caption }
                    onLoad = { (ev) => {
                        if(resolvedSrc.startsWith('blob:')){
                            URL.revokeObjectURL(resolvedSrc);
                        }
                    } }
                    onError = { async (ev) =>{
                        setResolvedSrc(await resolveUrlWithMap('', map, undefined, true));
                    }}
                />
            }
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
    const { map } = useFileMapState();
    const { addFile } = useFileMapDataAction();

    const [aspectRatio, setAspectRatio] = useState(1); // height / width

    const [resolvedSrc, setResolvedSrc] = useObjectURLState();
    useEffect(()=>{
        resolveUrlWithMap(cell.src, map).then(setResolvedSrc);
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
        addFile(files[0], files[0].name, true, async path => {
            const url = attachmentIndexToUrl(path);
            const change: Partial<ImageCellField> = {
                src: url
            };
            editorAction.update(cell.id, change);
        });
    }, [cell.id]);

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
                                if(resolvedSrc?.startsWith('blob:')){
                                    URL.revokeObjectURL(resolvedSrc);
                                }
                                if(cell.width === undefined){
                                    setWidth( ev.currentTarget.naturalWidth );
                                }
                                setAspectRatio(
                                    ev.currentTarget.naturalHeight / ev.currentTarget.naturalWidth
                                );
                            } }
                            onError = { async (ev) =>{
                                setResolvedSrc(await resolveUrlWithMap('', map));
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