import { memo, useEffect } from 'react';
import { Metadata, useMetadataState, useMetadataInit } from './MetadataState'

export function MetadataInput(metadata: Partial<Metadata>){
    const init = useMetadataInit();

    useEffect(()=>{
        init( metadata );
    }, [metadata]);

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