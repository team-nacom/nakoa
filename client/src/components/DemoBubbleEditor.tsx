import PageTitle from 'components/PageTitle';

import { BubblePost, postBubble } from 'etc/api/bubble';
import { useIsAdmin } from 'etc/api/user';
import React, {useCallback, useEffect, useRef} from 'react';

import Tags from "@yaireo/tagify/dist/react.tagify";

import { FormattedMessage, useIntl } from 'react-intl';
import usePromise from 'etc/usePromise';
import useSmoothValue from 'etc/useSmoothValue';
import Button from './Button';
import { TagData } from '@yaireo/tagify';


import { useTextEditorState } from 'components/editor/globals'; //states defined globally.
import BubbleEditor from './editor/BubbleEditor';

interface Props {
    initialBubble?: Partial<BubblePost>,
    upload: (guide: BubblePost, 
             setMessage: (message: string) => void) 
        => void,
}


function DemoBubbleEditor({ initialBubble = {}, upload } : Props) {
    let [name, setName] = React.useState<string>(initialBubble.name ?? '');

    let [text, setText] = useTextEditorState('text');
    let [previewText, setPreviewText] = useTextEditorState('previewText');
    useEffect(()=>{
        setText(initialBubble.content ?? '');
        setPreviewText(initialBubble.content ?? '');
    },[]); //initialize these only once!

    let [message, setMessage] = React.useState<string>();

    let [tags, setTags] = React.useState<string[]>(initialBubble.tags ?? []);

    React.useEffect(() => {
    }, [initialBubble]);

    return (<>
        <div className='writeBox guide'>
            <PageTitle style={{margin: '40px'}}> 
                버블 추가
            </PageTitle>

            <div className=''>
                <label>
                    버블 제목
                </label>
                <input className='title' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>

            <BubbleEditor/>

            <div className='editorBottom'>
                <div style={{flex: 1, overflow: 'auto', fontSize: '16px', margin: '20px 20px 10px 10px'}}>
                    {/* TODO whitelist from API */}
                    <Tags onChange={useCallback((e) => {
                        let tagStrings = e.detail.tagify.value.map((element: TagData) => element.value);
                        setTags(tagStrings);
                    }, [])} defaultValue="welcome, to, nacom"/>
                </div>

                <Button className='submit link' onClick={
                    async () => {
                        upload(
                            { name, content: text, tags: tags },
                            setMessage
                        );
                    }
                }> 
                    <FormattedMessage id='editor.confirm' />
                </Button>
            </div>
            {message}
        </div>
    </>)
}


export default DemoBubbleEditor;