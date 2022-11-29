import React, { useEffect, useRef } from 'react';

import { CellFrom } from '../types-common';
import { RenderMode, Renderer, CellTypeRendererProps } from '../types-render';

import {
    useRenderData,
    useWoodAction,
} from '#/components/wood/store/EditorState'


import { fabric } from 'fabric'

// export const canvasCellName = 'canvas'
export interface CanvasCellField{
    canvasJSON: Object
}
export const canvasCellDefault: CanvasCellField = {
    canvasJSON: {}
}
type CanvasCell = CellFrom<CanvasCellField,'canvas'> // only used in this file

// renderers

function CanvasCellViewer({ mode, cell } : CellTypeRendererProps<CanvasCell>){
    const canvasId = `canvas-${cell.id}`
    const canvasRef = useRef<fabric.StaticCanvas>()

    useEffect(()=>{
        if(canvasRef.current) return

        canvasRef.current = new fabric.StaticCanvas(canvasId, {
            backgroundColor: '#A0A0A0'
        })
        canvasRef.current.loadFromJSON(cell.canvasJSON, ()=>{})
    }, [canvasId, cell.canvasJSON])

    return (
        <div className='canvasCell'>
            <canvas id={ canvasId } width={ 800 } height={ 400 } />
        </div>
    )
}



function CanvasCellEditor({ cell }: Omit<CellTypeRendererProps<CanvasCell>,'mode'>){
    const woodAction = useWoodAction()

    const canvasId = `canvas-${cell.id}`
    const canvasRef = useRef<fabric.Canvas>()

    useEffect(()=>{
        if(canvasRef.current) return

        canvasRef.current = new fabric.Canvas(canvasId, {
            isDrawingMode: true,
            backgroundColor: '#A0A0A0'
        })
        canvasRef.current.loadFromJSON(cell.canvasJSON, ()=>{})

        canvasRef.current.freeDrawingBrush.width = 5
        canvasRef.current.freeDrawingBrush.color = '#0000FF'

        canvasRef.current.on('mouse:up', ()=>{
            woodAction.update(cell.id, {
                canvasJSON: canvasRef.current?.toObject() ?? {}
            } as Partial<CanvasCellField>)
        })
    }, [canvasId, cell.canvasJSON])

    return (
        <div className='canvasCell'>
            <canvas id={ canvasId } width={ 800 } height={ 400 } />
        </div>
    )
}


export function CanvasCellRenderer({ mode, cell }: CellTypeRendererProps<CanvasCell>){
    if(mode !== RenderMode.EDITOR){
        return <CanvasCellViewer mode={ mode } cell={ cell } />
    }

    return <CanvasCellEditor cell={ cell } />
}