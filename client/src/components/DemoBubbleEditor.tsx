import PageTitle from 'components/PageTitle';

import { BubblePost, postBubble } from 'etc/api/bubble';
import React, {useCallback, useEffect, useRef} from 'react';
import Tags from "@yaireo/tagify/dist/react.tagify";
import { FormattedMessage, useIntl } from 'react-intl';
import Button from './Button';
import { TagData } from '@yaireo/tagify';

import { useTextEditorState } from 'components/editor/globals'; //states defined globally.
import BubbleEditor from './editor/BubbleEditor';
import { useNaBubbleState, dispatchNaBubbleState as dispatch } from './editor/globals';
import { inflate, Bubble } from './nabubble/data';

interface Props {
    initialBubble?: Partial<BubblePost>,
    upload: (guide: BubblePost, 
             setMessage: (message: string) => void) 
        => void,
    behavior: 'add' | 'edit'
}


function DemoBubbleEditor({ initialBubble = {}, upload, behavior } : Props) {
    let [name, setName] = React.useState<string>(initialBubble.name ?? '');
    let [ bubble ] = useNaBubbleState('bubble');

    let [message, setMessage] = React.useState<string>();

    let [tags, setTags] = React.useState<string[]>(initialBubble.tags ?? []);

    React.useEffect(() => {
    }, [initialBubble]);

    return (<>
        <div className='writeBox guide'>
            <PageTitle style={{padding: '40px'}}> 
                {behavior === 'edit' ? '버블 편집' : '버블 추가'}
            </PageTitle>

            <div className='titleEditor'>
                <label>
                    버블 제목
                </label>
                <input className='title' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>

            <BubbleEditor/>

            <div className='editorBottom'>
                <div style={{flex: 1, overflow: 'auto', fontSize: '16px', margin: '20px 20px 10px 10px'}}>
                    {/* TODO whitelist from API */}
                    <Tags onChange={useCallback((e: CustomEvent<Tagify.ChangeEventData<TagData>>) => {
                        const tags = e.detail.tagify.value.map((element: TagData) => element.value);
                        setTags(tags);
                    }, [])} defaultValue={tags.join(', ')}/>
                </div>

                <Button className='submit link' onClick={
                    async () => {
                        upload(
                            { name, content: JSON.stringify(inflate(bubble)), tags: tags },
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