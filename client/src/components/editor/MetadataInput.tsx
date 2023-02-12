import { memo, useEffect, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { Metadata, useMetadataState, useMetadataInit } from './MetadataState'

export function MetadataInput(){
    // const init = useCallback(useMetadataInit(),[]);

    // useEffect(()=>{
    //     init( metadata );
    // }, [init, metadata]);

    const { title, author, setTitle, setAuthor } = useMetadataState();

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