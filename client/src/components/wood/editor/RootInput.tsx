import { memo } from 'react'

import {
    useWoodAction,
    useMetaData, useRootId
} from '#/components/wood/store/EditorState'

function _RootInput(){
    const rootId = useRootId()
    const metadata = useMetaData()
    const woodAction = useWoodAction()
    
    if(metadata === undefined){
        return <></>
    }

    return (
        <>
            <div className='titleInput'>
                <label>제목</label>
                <input className='title'
                    value={ metadata.title }
                    onChange={ (ev)=>{
                        woodAction.update(rootId, {
                            title: ev.target.value
                        })
                    } }
                />
            </div>
            <div className='authorInput'>
                <label>작성자</label>
                <input className='author'
                    value={ metadata.author }
                    onChange={ (ev)=>{
                        woodAction.update(rootId, {
                            author: ev.target.value
                        })
                    } }
                />
            </div>
        </>
    )
}
export const RootInput = memo(_RootInput)