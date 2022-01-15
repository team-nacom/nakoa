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
import { inflate, Bubble } from './nabubble/bubble';
import AuthorInput from './AuthorInput';

interface Props {
    initialBubble?: Partial<BubblePost>,
    upload: (guide: BubblePost, 
             setMessage: (message: string) => void) 
        => void,
}

function DemoBubbleEditor({ initialBubble = {}, upload } : Props) {
    let [title, setTitle] = React.useState<string>(initialBubble.title ?? '');
    let [author, setAuthor] = React.useState<string>(initialBubble.author ?? '');
    let [ flat ] = useNaBubbleState('flat');

    let [message, setMessage] = React.useState<string>();

    let [tags, setTags] = React.useState<string[]>(initialBubble.tags ?? []);

    React.useEffect(() => {
    }, [initialBubble]);

    return (<>
        <div className='writeBox guide'>
            <PageTitle style={{padding: '40px'}}>
                글 작성하기
            </PageTitle>

            <div className='titleEditor'>
                <label>
                    제목
                </label>
                <input className='title' value={title} onChange={(e) => setTitle(e.target.value)}/>
            </div>

            <div className='flexbox'>
                <AuthorInput author={author} setAuthor={setAuthor} />                
            </div>

            <BubbleEditor/>

            <div className='editorBottom'>
                <div style={{flex: 1, overflow: 'auto', fontSize: '16px', margin: '20px 20px 10px 10px'}}>
                    <Tags onChange={useCallback((e: CustomEvent<Tagify.ChangeEventData<TagData>>) => {
                        const tags = e.detail.tagify.value.map((element: TagData) => element.value);
                        setTags(tags);
                    }, [])} defaultValue={tags.join(', ')}/>
                </div>

                <Button className='submit link' onClick={
                    async () => {
                        upload(
                            { title: title, author: author, content: JSON.stringify(inflate(flat)), tags: tags },
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