import React, { useState, useRef, useMemo, useEffect, memo, PropsWithChildren } from 'react'

import {
    createContext, useContextSelector, useContext
} from 'use-context-selector'

import { HtmlPortalNode, createHtmlPortalNode, InPortal, OutPortal } from 'react-reverse-portal'

import isEqual from 'react-fast-compare'

import {
    useParentIds, useStructData,
    useSingleCellChildren,
    useSingleCellHideChildren,
} from '#/components/cell-editor/store/EditorState'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

type PortalNodeMap = Map<string, HtmlPortalNode>

/**
 * Keeping the entries of `prev`, create portal nodes and attach if an id in `ids` is absent.
 * When an id of `prev` doesn't appear in `ids`, the entry is removed.
 * @param prev previous record of `HtmlPortalNode`.
 * @param ids new id array
 * @returns the result record which have `ids` as key.
 */
function provideNodes(prev: PortalNodeMap, ids: string[]): PortalNodeMap {
    const next = new Map(Array.from(prev.entries()).filter( ([k]) => (ids.indexOf(k) !== -1) ))
    ids.forEach((id) => {
        if(!next.has(id)){
            next.set(id, createHtmlPortalNode())
        }
    })
    return next
}

// Contexts for Portal
const PortalNodeContext = createContext< PortalNodeMap >(new Map())

// some dummy values
const VoidWrapper = ({children}: PropsWithChildren) => <>{children}</>
const VoidComponent = () => <></>

/////////////////////////////
//// CellPortalScopeWith ////
/////////////////////////////

export interface CellIndicatorProps{
    id: string
}

/**
 * portal node provider.
 * @param CellIndicator the cell renderer with {id, cell} specified, component with wrappers.
 * 
 */
export function CellPortalScopeWith(
    CellIndicator: React.ComponentType<CellIndicatorProps>,
){
    interface CellInPortalProps{
        id: string
        node: any // can we do typing?
    }

    const CellInPortal = memo(({ id, node }: CellInPortalProps)=>{
        return <InPortal node = {node}>
            <CellIndicator id = { id } />
        </InPortal>
    })

    function _CellPortalScope({ children }: PropsWithChildren){
        const parentIds = useParentIds() // parentIds will only change when struct is changed
        const ids = Object.keys(parentIds)

        // const structData = useStructData()
        // const ids = Object.keys(structData)
    
        const [nodes, setNodes] = useState<PortalNodeMap>(new Map())
    
        // recalculate nodes with array comparison
        const idsHolder = useRef<string[]>(ids)
        if(!isEqual(ids, idsHolder.current)){
            idsHolder.current = ids
        }
        useEffect(()=>{
            setNodes(nodes => provideNodes(nodes, idsHolder.current))
        }, [idsHolder.current])

        // const InPortals = idsHolder.current.map( (id) => {
        //     const node = nodes.get(id)
        //     if(node === undefined) return null
        //     return <CellInPortal key = {id} id = {id} node = {node} />
        // } )

        return (
            // @todo: can we get rid of this nasty provider pattern? (using zustand)
            <PortalNodeContext.Provider value = { nodes }>
                {
                    idsHolder.current.map( (id) => {
                        const node = nodes.get(id)
                        if(node === undefined) return null
                        return <CellInPortal key = {id} id = {id} node = {node} />
                    } )
                    // InPortals
                }
                { children /* OUTPORTAL HERE */ }
            </PortalNodeContext.Provider>
        )
    }

    return memo(_CellPortalScope)
}

/////////////////////////////
////// CellPortalWith ///////
/////////////////////////////

const usePortalNode = (id: string) => useContextSelector(PortalNodeContext, map => map.get(id))

export interface InterCellProps{
    parentId: string
    idx: number
    depth?: number
    over?: boolean
}
export type ChildrenWrapperProps = PropsWithChildren<{
    hide?: boolean
}>
export interface CellPortalProps{
    id: string,
    depth?: number
}
/**
 * given InterCell, gives tree-structured outPortal component declared by `structData`
 * @param InterCell component with `InterCellProps` props which should be placed between sibling cells. e.g. add cell button.
 */
export function CellPortalWith(
    InterCell : React.ComponentType<InterCellProps> = VoidComponent,
    ChildrenWrapper: React.ComponentType<ChildrenWrapperProps> = VoidWrapper,
){
    const CellPortal = memo(function _CellPortal({ id, depth }: CellPortalProps){
        const node = usePortalNode(id)
        const childIds = useSingleCellChildren(id)
        const hide = useSingleCellHideChildren(id)

        const nextDepth = (depth ?? 0) + 1
        
        if(node === undefined) return null
        
        return <>
            <OutPortal node = { node } />
            {childIds !== undefined &&
                <ChildrenWrapper hide={hide}>
                    {
                        childIds.reduce( (prev: any[], childId, idx) => {
                            prev.push(
                                <CellPortalDraggable key = { 'cell-' + childId }
                                    id = { childId }
                                    depth = { nextDepth }
                                />
                            )
                            prev.push(
                                <InterCell key = { 'inter-' + id + '-' + (idx + 1) }
                                    parentId = { id } idx = { idx + 1 }
                                    depth = { nextDepth }
                                />
                            )
                            return prev
                        }, [
                            <InterCell key = { 'inter-' + id + '-0' }
                                parentId = { id } idx = { 0 }
                                depth = { nextDepth }
                            /> // 0th element
                        ])
                    }
                </ChildrenWrapper>
            }
        </>
    })

    const CellPortalDraggable = memo(function _CellPortalDraggable({ id, depth }: CellPortalProps){
        //draggable settings
        const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, data: { id } }) // TODO: seems like this hook 
        const style : React.CSSProperties = useMemo(() => ({
            transform: CSS.Translate.toString(transform),
            position: 'relative',
            zIndex: transform !== null ? 3 : 2, // should be higher than interCell
            opacity: transform !== null ? 0.8 : undefined,
        }), [transform])

        return <div ref={ setNodeRef } style={style}>

            { /* TODO : move dnd into separate component */ }
            <div  {...listeners} {...attributes}
                className={ 'cellHandle' }
            />

            <CellPortal id = { id } depth = { depth } />

        </div>
    })

    return [CellPortal, CellPortalDraggable]
}