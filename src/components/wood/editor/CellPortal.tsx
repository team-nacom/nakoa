import React, { useState, createContext, useContext, useRef, PropsWithChildren, useEffect } from 'react'

import { HtmlPortalNode, createHtmlPortalNode, InPortal, OutPortal } from 'react-reverse-portal'

import isEqual from 'react-fast-compare'

import {
    useStructData,
    useCellData,
    useRenderData,
} from '#/components/wood/states'

type PortalNodeRecord = Record<string, HtmlPortalNode>

/**
 * Keeping the entries of `prev`, create portal nodes and attach if an id in `ids` is absent.
 * When an id of `prev` doesn't appear in `ids`, the entry is removed.
 * @param prev previous record of `HtmlPortalNode`.
 * @param ids new id array
 * @returns the result record which have `ids` as key.
 */
function provideNodes(prev: PortalNodeRecord, ids: string[]): PortalNodeRecord {
    const intermed = Object.fromEntries(Object.entries(prev).filter(([k]) => (ids.indexOf(k) !== -1)  ))

    const next = ids.reduce( (acc, id)=>{
        if(!acc[id]){
            return { ...acc, [id] : createHtmlPortalNode() }
        }
        return acc
    }, intermed)

    return next
}

// Contexts for Portal
const PortalNodeContext = createContext< PortalNodeRecord >({})

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
    CellIndicator: (props: CellIndicatorProps) => JSX.Element | null,
){
    return function CellPortalScope({ children }: PropsWithChildren){
        const structData = useStructData()
        const ids = Object.keys(structData)
    
        const [nodes, setNodes] = useState<PortalNodeRecord>(
            provideNodes({}, ids)
        )
    
        // recalculate nodes with array comparison
        const idsHolder = useRef<string[]>(ids)
        if(!isEqual(ids, idsHolder.current)){
            idsHolder.current = ids
        }
        useEffect(()=>{
            setNodes(nodes => provideNodes(nodes, idsHolder.current))
        },[idsHolder.current])
    
        return (
            <PortalNodeContext.Provider value = { nodes }>
                {
                    idsHolder.current.map( (id) => {
                        if(nodes[id] === undefined) return null
                        return <InPortal key = {id} node = {nodes[id]}>
                            <CellIndicator id = { id } />
                        </InPortal> //TODO
                    } )
                }
                { children /* OUTPORTAL HERE */ }
            </PortalNodeContext.Provider>
        )
    }
}

/////////////////////////////
////// CellPortalWith ///////
/////////////////////////////

export interface InterCellProps{
    parentId: string
    idx: number
    depth?: number
}
export interface CellPortalProps{
    id: string,
    depth?: number
}
/**
 * given InterCell, gives tree-structured outPortal component declared by `structData`
 * @param InterCell component with `InterCellProps` props which should be placed between sibling cells. e.g. add cell button.
 */
export function CellPortalWith(
    InterCell : (props: InterCellProps) => JSX.Element = VoidComponent,
    ChildrenWrapper: (props: PropsWithChildren) => JSX.Element = VoidWrapper,
){
    return function CellPortal({ id, depth }: CellPortalProps){
        const portalNodes = useContext(PortalNodeContext)
        const structData = useStructData()
        
        const childIds = structData[id] || []
        const nextDepth = (depth || 0) + 1

        if(portalNodes[id] === undefined) return null
        
        return <div>
            <OutPortal node = { portalNodes[id] } />
            <ChildrenWrapper>
                {
                    childIds.map( (childId, idx) => (
                        <>
                            { InterCell && <InterCell key = { 'inter-' + id + '-' + idx } parentId = { id } idx = { idx } depth = { nextDepth } /> }
                            <CellPortal key = { 'cell-' + childId } id = { childId } depth = { nextDepth } /> 
                        </> //TODO
                    ) )
                }
                { InterCell && <InterCell key = { 'inter-' + id + '-' + childIds.length } parentId = { id } idx = { childIds.length } depth = { nextDepth } /> }
            </ChildrenWrapper>
        </div>
    }
}