import PageTitle from 'components/PageTitle';

import { /*getGuideCategories, getGuideSections,*/ GuidePost, GuideType, /*priorityTagsGuideType*/} from 'etc/api/guide';
import { useIsAdmin } from 'etc/api/user';
import React, {useCallback, useEffect, useRef} from 'react';

import Tags from "@yaireo/tagify/dist/react.tagify";

import { FormattedMessage, useIntl } from 'react-intl';
//import { CateType, getCateDetail, getCategoryDetail, getCates, getGoryDetail, GoryType, postCate, postGory } from 'etc/api/category';
import usePromise from 'etc/usePromise';
import useSmoothValue from 'etc/useSmoothValue';
import Button from './Button';
import { TagData } from '@yaireo/tagify';


import TextEditor from 'components/editor/TextEditor';
import { useTextEditorState } from 'components/editor/globals'; //states defined globally.

interface AuthorInputProps {
    isAdmin: boolean;
    authors: string[];
    setAuthors: (authors: string[]) => void;
}

function AuthorsInput({ isAdmin, authors, setAuthors } : AuthorInputProps) {
    let [opacity, setDeltaOpacity] = useSmoothValue(0);
    const editable = isAdmin;
    let intl = useIntl();

    return (
        <div className='writeForm'>
            <label>
                { intl.formatMessage({ id: 'editor.author' }) }
            </label>
            <div>
                <input 
                    value={ authors.join(', ') } 
                    readOnly
                    onMouseEnter={() => setDeltaOpacity(0.1) } 
                    onMouseLeave={() => setDeltaOpacity(-0.1) }
                />
            </div>
            { opacity > 0 && (
                <div 
                    className='candidateContainer' 
                    style={{ opacity }}
                    onMouseEnter={() => setDeltaOpacity(0.1) } 
                    onMouseLeave={() => setDeltaOpacity(-0.1) }
                >
                    { authors.map((value, index) => editable ? (
                        <div className='candidate' key={index}>
                            <input 
                                value={value} 
                                onChange={(e) => setAuthors(authors.slice(0, index).concat([e.target.value]).concat(authors.slice(index+1)))} 
                                onBlur={() => setDeltaOpacity(-0.1) }
                            />
                            <span 
                                className='candidateRemove material-icons' 
                                onClick={() => setAuthors(authors.slice(0, index).concat(authors.slice(index+1)))}
                            >
                                close
                            </span>
                        </div>
                    ) : (
                        <div className='candidate' key={index}>
                            <input value={value} readOnly />
                        </div>
                    ))}
                    { editable && (
                        <div className='candidate' onClick={() => setAuthors(authors.concat(['']))} style={{textAlign: 'center'}} > + </div>
                    )}
                </div>
            )}
        </div>
    )
}


interface Props {
    initialGuide?: Partial<GuidePost>,
    upload: (guide: GuidePost, 
             setMessage: (message: string) => void) 
        => void,
    behavior: 'add' | 'edit'
}


function GuideEditor({ initialGuide = {}, upload, behavior } : Props) {
    let isAdmin = useIsAdmin();

    let [name, setName] = React.useState<string>(initialGuide.name ?? '');
    let [authors, setAuthors] = React.useState<string[]>(initialGuide.authors ?? []);

    let [text, setText] = useTextEditorState('text');
    let [previewText, setPreviewText] = useTextEditorState('previewText');
    useEffect(()=>{
        setText(initialGuide.content ?? '');
        setPreviewText(initialGuide.content ?? '');
    },[]); //initialize these only once!
    
    let [message, setMessage] = React.useState<string>();

    let [tags, setTags] = React.useState<string[]>(initialGuide.tags ?? []);

    return (<>
        <div className='writeBox guide'>
            <PageTitle style={{padding: '40px'}}> 
                <FormattedMessage id={ behavior === 'add' ? 'editor.addguide' : 'editor.updateguide' } />
            </PageTitle>

            { isAdmin && (
                <div className='flexbox'>
                    <AuthorsInput authors={authors} setAuthors={setAuthors} isAdmin={isAdmin} />                
                </div>
            )}

            <div className='titleEditor'>
                <label>
                    <FormattedMessage id='editor.guidetitle' />
                </label>
                <input className='title' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>

            <TextEditor className='' body={ text } />

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
                            { name, content: text, authors: authors.filter((s) => s.length > 0), tags: tags },
                            setMessage
                        );
                    }
                }> 
                    <FormattedMessage id='editor.savedraft' />
                </Button>

                <Button className='submit link' onClick={
                    async () => {
                        upload(
                            { name, content: text, authors: authors.filter((s) => s.length > 0), tags: tags },
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

export default GuideEditor;