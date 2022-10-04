import React, { useState, createContext, useContext, useRef, PropsWithChildren, useEffect } from 'react'

import { HtmlPortalNode, createHtmlPortalNode, InPortal, OutPortal } from 'react-reverse-portal'

import isEqual from 'react-fast-compare'

import {
    CellIndicatorProps
} from '#/components/wood/cell'

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

interface PortalScopeProps{
    CellIndicator: (props: CellIndicatorProps) => JSX.Element | null
}

/**
 * portal node provider.
 * TODO: CellPortalScope receives CellIndicator passed as props, but below CellOutPortal is defined as HOL. unify the convention?
 */
export function CellPortalScope({ CellIndicator, children }: PropsWithChildren<PortalScopeProps>){
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
            <div>
                {
                    idsHolder.current.map( (id) => {
                        if(nodes[id] === undefined) return null
                        return <InPortal key = {id} node = {nodes[id]}>
                            <CellIndicator id = { id } />
                        </InPortal>
                    } )
                }
                { children /* OUTPORTAL HERE */ }
            </div>
        </PortalNodeContext.Provider>
    )
}

export interface InterCellProps{
    parentId: string
    idx: number
    depth?: number
}
/**
 * given InterCell, gives tree-structured outPortal component declared by `structData`
 * @param InterCell component with `InterCellProps` props which should be placed between sibling cells. e.g. add cell button.
 */
export function CellPortalWithInterCell(InterCell? : (props: InterCellProps) => JSX.Element){
    return function CellPortal({ id, depth }: CellIndicatorProps){
        const portalNodes = useContext(PortalNodeContext)
        const structData = useStructData()
        
        const childIds = structData[id] || []

        const nextDepth = (depth || 0) + 1

        if(portalNodes[id] === undefined) return null
        
        return <div>
            <OutPortal node = { portalNodes[id] } />
            <div style={ {paddingLeft: '20px'} }>
                {
                    childIds.map( (childId, idx) => (
                        <>
                            { InterCell && <InterCell parentId = { id } idx = { idx } depth = { nextDepth } /> }
                            <CellPortal key = { childId } id = { childId } depth = { nextDepth } />
                        </>
                    ) )
                }
                { InterCell && <InterCell parentId = { id } idx = { childIds.length } depth = { nextDepth } /> }
            </div>
        </div>
    }
}