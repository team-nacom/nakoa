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

import { Bubble, FlatBubble, inflate, flatten } from 'components/nabubble/data';

import { useNaBubbleState, dispatchNaBubbleState as dispatch } from 'components/editor/globals'; //states defined globally.
import BubbleEditor from './editor/BubbleEditor';

interface Props {
    initialPost?: Partial<BubblePost>,
    upload: (guide: BubblePost, 
             setMessage: (message: string) => void) 
        => void,
}


function DemoBubbleEditor({ initialPost = {}, upload } : Props) {
    const [ bubble ] = useNaBubbleState('bubble');

    let [name, setName] = React.useState<string>(initialPost.name ?? '');

    let [message, setMessage] = React.useState<string>();

    let [tags, setTags] = React.useState<string[]>(initialPost.tags ?? []);

    React.useEffect(() => {
    }, [initialPost]);

    // var initBubble : Bubble = JSON.parse(initialPost.content ?? '');
    // initBubble = inflate(flatten(initBubble));
    var initBubble : Bubble | undefined = initialPost.content ? inflate(JSON.parse(initialPost.content) as FlatBubble) : undefined;

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

            <BubbleEditor body={ initBubble } />

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
                            { name, content: JSON.stringify(bubble), tags: tags },
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