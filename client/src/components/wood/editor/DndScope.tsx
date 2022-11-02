import React, { memo, useCallback, useState } from 'react'

import {
    Context,
    createContext, useContextSelector, useContext
} from 'use-context-selector' // @todo : context to zustand!

import {
    useParentIds,
    useWoodAction,
    useEditorAction
} from '#/components/wood/store/EditorState'

import {
    DndContext, useDndMonitor, DragStartEvent, DragOverEvent, DragEndEvent,
    MouseSensor, TouchSensor, PointerSensor, useSensor, useSensors,
    CollisionDetection, pointerWithin
} from '@dnd-kit/core'

const detection : CollisionDetection = (args) => {
    return pointerWithin(args)
}

const OverIdContext = createContext<string | number>('')

export const useIsOver = (dndId: string) => useContextSelector(OverIdContext, overId => overId === dndId)

function _DndScope({ children }: React.PropsWithChildren){
    const parentIds = useParentIds()
    const woodAction = useWoodAction()
    // const editorAction = useEditorAction()

    // const [activeId, setActiveId] = useState<string | number>('')
    const [overId, setOverId] = useState<string | number>('')

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(PointerSensor)
    )

    // const handleDragStart = useCallback( (ev: DragStartEvent) => {
    //     const { active } = ev
    //     setActiveId(active.id)
    // }, [])

    const handleDragOver = useCallback( (ev: DragOverEvent) => {
        const { active, over } = ev
    
        if(over){
            const spl = String(over.id).split('@')
            let pid : string | undefined = spl[0] ?? ''
            while(pid){
                if(pid === active.id) break
                pid = parentIds[pid]
            }
            if(pid === undefined){
                setOverId(over.id)
            }
        } else{
            setOverId('')
        }
    }, [parentIds])
    
    const handleDragEnd = useCallback( (ev: DragEndEvent) => {
        const { active, over } = ev
    
        if(over){
            // const targetId = (active.data as any).id
            // const destParentId = (over.data as any).parentId
            // const destPos = (over.data as any).idx

            const targetId = String(active.id)
            const spl = String(over.id).split('@')
            let pid : string | undefined = spl[0] ?? ''
            while(pid){
                if(pid === active.id) break
                pid = parentIds[pid]
            }
            if(pid === undefined){
                woodAction.move(
                    targetId,
                    spl[0] ?? '', // destParentId
                    Number(spl[1]) // destPos
                )
            }
        }
        setOverId('')
    }, [parentIds])

    return <DndContext sensors={ sensors }
        onDragOver={ handleDragOver }
        onDragEnd={ handleDragEnd }
        collisionDetection={ detection }
    >
        <OverIdContext.Provider value={ overId }>
            { children }
        </OverIdContext.Provider>
    </DndContext>
}
export const DndScope = memo(_DndScope)