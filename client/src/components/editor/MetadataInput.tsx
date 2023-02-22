import { memo, useEffect, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { Metadata, useMetadataState, useMetadataAction } from './MetadataState'

export function MetadataInput(){
    const { title, author } = useMetadataState();
    const { setTitle, setAuthor } = useMetadataAction();

    return (
        <div className='metadataInput'>
            <div className='titleInput'>
                <label>제목</label>
                <input className='title'
                    value={ title }
                    onChange={ (ev)=>{
                        setTitle(ev.target.value)
                    } }
                />
            </div>
            <div className='authorInput'>
                <label>작성자</label>
                <input className='author'
                    value={ author }
                    onChange={ (ev)=>{
                        setAuthor(ev.target.value)
                    } }
                />
            </div>
        </div>
    )
}

// export const MetadataInput = memo(_MetadataInput, isEqual);