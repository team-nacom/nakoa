import React, { useState, createContext, useContext, useRef, memo, PropsWithChildren, useEffect } from 'react'

import { HtmlPortalNode, createHtmlPortalNode, InPortal, OutPortal } from 'react-reverse-portal'

import isEqual from 'react-fast-compare'

import {
    useParentIds, useStructData,
    useSingleCellChildren,
    useSingleCellHideChildren,
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

    return function CellPortalScope({ children }: PropsWithChildren){
        const parentIds = useParentIds() // parentIds will only change when struct is changed
        const ids = Object.keys(parentIds)

        // const structData = useStructData()
        // const ids = Object.keys(structData)
    
        const [nodes, setNodes] = useState<PortalNodeRecord>({})
    
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
                        return <CellInPortal key = {id} id = {id} node = {nodes[id]} />
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
        const portalNodes = useContext(PortalNodeContext)
        const childIds = useSingleCellChildren(id)
        const hide = useSingleCellHideChildren(id)

        const nextDepth = (depth || 0) + 1

        if(portalNodes[id] === undefined) return null
        
        return <div>
            <OutPortal node = { portalNodes[id] } />
            {childIds !== undefined &&
                <ChildrenWrapper hide={hide}>
                    {
                        childIds.reduce( (prev: any[], childId, idx) => {
                            prev.push(
                                <CellPortal key = { 'cell-' + childId }
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
        </div>
    })
    return CellPortal
}