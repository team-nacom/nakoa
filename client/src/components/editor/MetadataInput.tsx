import { memo } from 'react';

interface MetadataInputProps{
    title: string,
    setTitle: (title: string) => any,
    author: string,
    setAuthor: (author: string) => any
}

function _MetadataInput({title, setTitle, author, setAuthor}: MetadataInputProps){
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
export const MetadataInput = memo(_MetadataInput)