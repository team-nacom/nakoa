import { useState, useCallback, useEffect } from 'react'

import {
    WoodScope,
    useWoodStructScope, WoodStructScope, WoodStruct,
    useCellDataScope, CellDataScope, CellData,
    useRenderInfoScope, RenderInfoScope, RenderInfo
} from '#/components/wood/scopes'

import {
    MemoizedCellRenderer, cellTypeStr,
    RenderMode
} from '#/components/wood/cell'

import { PortalScope, CellOutPortal } from './ReversePortal'

const rootId = 'c0'

function toWoodStruct(childIds: {[id: string]: string[]}){
    return { rootId, childIds }
}

const struct0 = toWoodStruct({
    [rootId]: ['c1', 'c2', 'c3'],
    'c1': [],
    'c2': [],
    'c3': []
})
const struct1 = toWoodStruct({
    [rootId]: ['c3', 'c1'],
    'c1': ['c2'],
    'c2': [],
    'c3': []
})
const struct2 = toWoodStruct({
    [rootId]: ['c2'],
    'c1': [],
    'c2': ['c1', 'c3'],
    'c3': []
})

const data : CellData = {
    [rootId]: {
        [cellTypeStr]: 'text',
        id: rootId,
        value: ''
    },
    'c1': {
        [cellTypeStr]: 'code',
        id: 'c1',
        value: 'print(\'Hello, World!\')'
    },
    'c2': {
        [cellTypeStr]: 'math',
        id: 'c2',
        value: 'a^2+b^2=c^2'
    },
    'c3': {
        [cellTypeStr]: 'text',
        id: 'c3',
        value: 'wwwwww'
    }
}


function DummyButton(){
    const [ cnt, setCnt ] = useState(0)
    const { setWoodStruct } = useWoodStructScope()

    const clickHandler = () => {
        switch(cnt % 3){
            case 0: setWoodStruct(struct1); break;
            case 1: setWoodStruct(struct2); break;
            case 2: setWoodStruct(struct0); break;
        }

        setCnt(cnt => cnt + 1)
    }

    return (
        <button onClick = { clickHandler }>
            Click!
        </button>
    )
}


interface DummyCellProps{
    id: string
}
function DummyCell({ id } : DummyCellProps){
    const { woodStruct } = useWoodStructScope()
    const cellData = useCellDataScope()

    const childIds = woodStruct.childIds[id]
    const cell = cellData[id]
    if(!childIds || !cell){
        return <>
            <div style={ {paddingLeft: '20px'} }>
                cell {id} Not Found!
            </div>
        </>
    }

    return <>
        <MemoizedCellRenderer key = { id }
            cell = { cell }
            mode = { RenderMode.EDITOR }
        />
    </>
}


export function DummyEditor(){
    return (
        <WoodScope
            woodStructInit = { struct0 }
            cellDataInit = { data }
        >
            <PortalScope
                CellIndicator={ DummyCell }
            >
                <CellOutPortal id= { rootId } />
            </PortalScope>
            <DummyButton />
        </WoodScope>
    )
}