import { useState, memo } from 'react';

import ClassicEditorBody from './EditorBody'

import Button from '#/components/Button'

interface MetadataInputProps{
    title: string,
    setTitle: (title: string) => any,
    author: string,
    setAuthor: (author: string) => any
}

function _MetadataInput({title, setTitle, author, setAuthor}: MetadataInputProps){
    return (
        <>
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
        </>
    )
}
const MetadataInput = memo(_MetadataInput)

interface EditorCoreProps{
    upload?: () => any
}

export function ClassicEditorCore({ upload }: EditorCoreProps){
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');

    return (
        <div className='cellEditorWrapper'>
            <div className='editorTextInput'>
                <MetadataInput {...{title, setTitle, author, setAuthor}} />
            </div>

            <hr />
            <div className='allCellsWrapper'>
                <ClassicEditorBody />
            </div>
            <hr />

            <div className='buttonsWrapper'>
                <Button className='uploadButton' onClick = { upload }>
                    업로드(console.log)
                </Button>
            </div>
        </div>
    )
}