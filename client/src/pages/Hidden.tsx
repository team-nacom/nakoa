import { useEffect, useState, useCallback, useMemo } from 'react'

import {
    useEditorInit as useCellEditorInit
} from '#/components/wood/store/EditorState'

import {
    useClassicEditorInit
} from '#/components/classic-editor/EditorState'

import { cellData as PfCellData, wood as PfWood } from '#/components/wood/util/pfaffian'
import { pfaffian as PfText } from '#/components/classic-editor/pfaffian'

import { Editor } from '#/components/editor/Editor'

function Hidden() {
    // initialize editor state.
    // may need a single provider for this? see https://github.com/pmndrs/zustand#react-context
    const cellInit = useCellEditorInit()
    const classicInit = useClassicEditorInit()
    useEffect(() => {
        cellInit(PfCellData, PfWood.rootId, PfWood.structData)
        classicInit(PfText)
    }, [])

    return <Editor />;
}

export default Hidden;