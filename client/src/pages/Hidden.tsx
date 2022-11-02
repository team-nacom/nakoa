import { useEffect, useState, useCallback, useMemo } from 'react'

import {
    CellData, StructData, RenderData,

    useEditorInit, useRootId, useCellData, useStructData
} from '#/components/wood/store/EditorState'

import { cellData as PfCellData, wood as PfWood } from '#/components/wood/util/pfaffian'

import { EditorCore } from '#/components/wood/editor/Editor'

import Header from '#/components/Header'
import Footer from '#/components/Footer'

function Hidden() {
    const [initCellData, initRootId, initStructData] : [CellData?, string?, StructData?] = [ PfCellData, PfWood.rootId, PfWood.structData ]

    // initialize editor state.
    // may need a single provider for this? see https://github.com/pmndrs/zustand#react-context
    const init = useEditorInit()
    useEffect(() => {
        init(initCellData, initRootId, initStructData)
    }, [])

    // subscribe for state variables.
    const [cellData, rootId, structData] = [useCellData(), useRootId(), useStructData()]

    const upload = useCallback(()=>{
        console.log(cellData, structData)
    }, [cellData, structData])

    return (
        <>
            <Header />
            <div id='content'>
                <EditorCore upload={ upload } />
            </div>
            <Footer />
        </>
    );
}

export default Hidden;