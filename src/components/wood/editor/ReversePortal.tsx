import React, { useState, createContext, useContext, useRef, PropsWithChildren, useEffect } from 'react'

import { HtmlPortalNode, createHtmlPortalNode, InPortal, OutPortal } from 'react-reverse-portal'

import isEqual from 'react-fast-compare'

import {
    CellIndicatorProps
} from '#/components/wood/cell'

import {
    WoodScope,
    useWoodStructScope, WoodStructScope, WoodStruct,
    useCellDataScope, CellDataScope, CellData,
    useRenderInfoScope, RenderInfoScope, RenderInfo
} from '#/components/wood/scopes'

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
    CellIndicator: (props: CellIndicatorProps) => JSX.Element
}

/**
 * portal node provider.
 */
export function PortalScope({ CellIndicator, children }: PropsWithChildren<PortalScopeProps>){
    const cellData = useCellDataScope()
    const ids = Object.keys(cellData)

    const [nodes, setNodes] = useState<PortalNodeRecord>(
        provideNodes({}, ids)
        // ['c0','c1','c2','c3']
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
        <PortalNodeContext.Provider
            value = { nodes }
        >
            <div>
            {
                idsHolder.current.map( (id) => (
                    <InPortal key = {id} node = {nodes[id]}>
                        <CellIndicator id = { id } />
                    </InPortal>
                 ) )
            }
            { children /* OUTPORTAL HERE */ }
            </div>
        </PortalNodeContext.Provider>
    )
}

/**
 * gives tree-structured outPortal component declared by `woodStruct`
 * @param props.id cell id.
 */
export function CellOutPortal({ id }: CellIndicatorProps){
    const portalNodes = useContext(PortalNodeContext)
    const { woodStruct } = useWoodStructScope()
    
    const childIds = woodStruct.childIds[id] || []

    return <div>
        <OutPortal node = { portalNodes[id] } />
        <div style={ {paddingLeft: '20px'} }>
            {
                childIds.map( childId => (
                    <CellOutPortal key = { childId } id = { childId } />
                ) )
            }
        </div>
    </div>
}