import { memo } from 'react'

import {
    useCombinedDispatch, useMetaData, useRootId
} from '#/components/wood/states'

function _MetadataInput(){
    const rootId = useRootId()
    const metadata = useMetaData()
    const dispatch = useCombinedDispatch()

    return (
        <>
            <div className='titleInput'>
                <label>제목</label>
                <input className='title'
                    value={ metadata.title }
                    onChange={ (ev)=>{
                        dispatch({
                            type: 'update',
                            id: rootId,
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
                        dispatch({
                            type: 'update',
                            id: rootId,
                            author: ev.target.value
                        })
                    } }
                />
            </div>
        </>
    )
}
export const MetadataInput = memo(_MetadataInput)