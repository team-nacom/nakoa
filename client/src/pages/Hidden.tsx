import { useEffect, useState, useCallback, useMemo } from 'react'

import {
    CellData, StructData, RenderData,

    useEditorInit as useCellEditorInit, useRootId, useCellData, useStructData
} from '#/components/wood/store/EditorState'

import {
    useClassicEditorInit
} from '#/components/classic-editor/EditorState'

import { cellData as PfCellData, wood as PfWood } from '#/components/wood/util/pfaffian'
import { pfaffian as PfText } from '#/components/classic-editor/pfaffian'

import { Editor } from '#/components/editor/Editor'

import Header from '#/components/Header'
import Footer from '#/components/Footer'

function Hidden() {
    // initialize editor state.
    // may need a single provider for this? see https://github.com/pmndrs/zustand#react-context
    const cellInit = useCellEditorInit()
    const classicInit = useClassicEditorInit()
    useEffect(() => {
        cellInit(PfCellData, PfWood.rootId, PfWood.structData)
        classicInit(PfText)
    }, [])

    return (
        <>
            <Header />
            <div id='content'>
                <Editor />
            </div>
            <Footer />
        </>
    );
}

export default Hidden;