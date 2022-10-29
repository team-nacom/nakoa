import { useEffect, useState, useMemo } from 'react'

import {
    CombinedStateContext, CombinedDispatchContext,
    useCombinedReducer, useCombinedDispatch,
} from '#/components/wood/states'

import { cellData as PfCellData, wood as PfWood } from '#/components/wood/util/pfaffian'
import { wood2state, state2wood } from '#/components/wood/util/convert'

import { EditorCore } from '#/components/wood/editor/Editor'

import Header from '#/components/Header'
import Footer from '#/components/Footer'

function Hidden() {
    const initState = useMemo(() => wood2state(PfWood, PfCellData), [])
    const [state, dispatch] = useCombinedReducer(initState)

    return (
        <>
            <Header />
            <div id='content'>
                <CombinedStateContext.Provider value={ state }>
                    <CombinedDispatchContext.Provider value={ dispatch }>
                        <EditorCore />
                    </CombinedDispatchContext.Provider>
                </CombinedStateContext.Provider>
            </div>
            <Footer />
        </>
    );
}

export default Hidden;