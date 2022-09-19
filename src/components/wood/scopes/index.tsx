import React, { useContext, createContext, useState, ReactPropTypes, PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';

import { WoodStruct, WoodStructScope, useWoodStructScope } from './WoodStruct'
import { CellData, CellDataScope, useCellDataScope, useDispatchCellDataScope } from './CellData'
import { RenderInfo, RenderInfoScope, useRenderInfoScope } from './RenderInfo'

type WoodScopeProps = PropsWithChildren<{
    woodStructInit?: WoodStruct,
    cellDataInit?: CellData,
    renderInfoInit?: RenderInfo
}>

export function WoodScope(props: WoodScopeProps){
    return (
        <WoodStructScope init={ props.woodStructInit }>
            <CellDataScope init={ props.cellDataInit }>
                <RenderInfoScope init={ props.renderInfoInit }>
                    { props.children }
                </RenderInfoScope>
            </CellDataScope>
        </WoodStructScope>
    )
}

export {
    WoodStructScope,
    CellDataScope,
    RenderInfoScope
}

export {
    useWoodStructScope,
    useCellDataScope, useDispatchCellDataScope,
    useRenderInfoScope,
}

export type {
    WoodStruct,
    CellData,
    RenderInfo
}