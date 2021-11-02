import Footer from 'components/Footer';
import Header from 'components/Header';
import PageTitle from 'components/PageTitle';
import MarkdownEditor from 'components/editor/MarkdownEditor';

import { EditorBubble, RenderedBubble, useNaBubbleState } from 'components/nabubble'

import { /*getGuideCategories, getGuideSections,*/ GuidePost, GuideType, /*priorityTagsGuideType*/} from 'etc/api/guide';
import { useIsAdmin } from 'etc/api/user';
import React, {useCallback, useRef} from 'react';

import Tags from "@yaireo/tagify/dist/react.tagify";

import { FormattedMessage, useIntl } from 'react-intl';
//import { CateType, getCateDetail, getCategoryDetail, getCates, getGoryDetail, GoryType, postCate, postGory } from 'etc/api/category';
import usePromise from 'etc/usePromise';
import useSmoothValue from 'etc/useSmoothValue';
import Button from './Button';
import { TagData } from '@yaireo/tagify';

// This function can be well modified for better auto-complete support
function isStringRelated(current: string, target: string) {
    return target.includes(current);
}

/*interface CateInputProps {
    cates: CateType[] | undefined;
    cateName: string;
    setCateName: (cateName: string) => void;
    setCateIndex: (cateIndex: number | undefined) => void;
}*/

/*function CateInput({ cates, cateName, setCateName, setCateIndex }: CateInputProps) {
    let [opacity, setDeltaOpacity] = useSmoothValue(0);
    let intl = useIntl();
    
    return (
        <div className='writeForm'>
            <label> 
                { intl.formatMessage({ id: 'editor.cate' }) } 
            </label>
            <div>
                <input 
                    value={cateName} 
                    onChange={(e) => {
                        let cateName = e.target.value;
                        setCateName(cateName);

                        let cate = cates?.find((cate) => cate.name === cateName);
                        if (cate) setCateIndex(cate.index);
                        else setCateIndex(undefined);
                    }} 
                    onMouseEnter={() => setDeltaOpacity(0.1) } 
                    onMouseLeave={() => setDeltaOpacity(-0.1) }
                />
            </div>
            { opacity > 0 && cates && cates.length > 0 && (
                <div 
                    className='candidateContainer' 
                    style={{ opacity }}
                    onMouseEnter={() => setDeltaOpacity(0.1) } 
                    onMouseLeave={() => setDeltaOpacity(-0.1) }
                >
                    { cates.filter((cate) => isStringRelated(cateName, cate.name)).map((cate) => (
                        <div className='candidate' onClick={() => { setCateName(cate.name); setCateIndex(cate.index); }}> { cate.name } </div>
                    ))}
                </div>
            )}
        </div>
    )
}

interface GoryInputProps {
    gories: GoryType[] | undefined;
    goryName: string;
    setGoryName: (goryName: string) => void;
    setGoryIndex: (goryIndex: string | undefined) => void;
}

function GoryInput({ gories, goryName, setGoryName, setGoryIndex } : GoryInputProps) {
    let [opacity, setDeltaOpacity] = useSmoothValue(0);
    let intl = useIntl();

    return (
        <div className='writeForm'>
            <label>
                { intl.formatMessage({ id: 'editor.gory' }) } 
            </label>
            <div>
                <input 
                    value={goryName} 
                    onChange={(e) => {
                        let goryName = e.target.value;
                        setGoryName(goryName);

                        let gory = gories?.find((gory) => gory.name === goryName);
                        if (gory) setGoryIndex(gory.index);
                        else setGoryIndex(undefined);
                    }} 
                    onMouseEnter={() => setDeltaOpacity(0.1) } 
                    onMouseLeave={() => setDeltaOpacity(-0.1) }
                />
            </div>
            { opacity > 0 && gories && gories.length > 0 && (
                <div 
                    className='candidateContainer' 
                    style={{ opacity }}
                    onMouseEnter={() => setDeltaOpacity(0.1) } 
                    onMouseLeave={() => setDeltaOpacity(-0.1) }
                >
                    { gories.filter((gory) => isStringRelated(goryName, gory.name)).map((gory) => (
                        <div className='candidate' onClick={() => { setGoryName(gory.name); setGoryIndex(gory.index); } }> {gory.name} </div> 
                    ))}
                </div>
            )}
        </div>
    )
}*/

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

/*interface PriorityInputProps {
    priority: number;
    setPriority: (priority: number) => void;
}

function PriorityInput({ priority, setPriority }: PriorityInputProps) {
    let [opacity, setDeltaOpacity] = useSmoothValue(0);
    let intl = useIntl();

    return (
        <div className='writeForm'>
            <label>
                { intl.formatMessage({ id: 'editor.priority' }) }
            </label>
            <div>
                <input 
                    value={ priorityTags[priority] } 
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
                    { [0, 1, 2, 3, 4].map((value) => (
                        <div className='candidate' onClick={() => setPriority(value) }> {priorityTags[value]} </div> 
                    ))}
                </div>
            )}
        </div>
    )
}*/

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
    //let [cateName, setCateName] = React.useState<string>('');
    //let [goryName, setGoryName] = React.useState<string>('');
    let [authors, setAuthors] = React.useState<string[]>(initialGuide.authors ?? []);
    let [content, setContent] = React.useState<string>(initialGuide.content ?? '');
    //let [priority, setPriority] = React.useState<number>(initialGuide.priority ?? 4);
    // let [isPublic, setIsPublic] = React.useState<boolean>(initialGuide.isPublic ?? true);
    let [message, setMessage] = React.useState<string>();

    //let [cateIndex, setCateIndex] = React.useState<number | undefined>(initialGuide.cate);
    //let [goryIndex, setGoryIndex] = React.useState<string | undefined>(initialGuide.gory);

    //let [catesLoading, cates] = usePromise(getCates);
    //let [gories, setGories] = React.useState<GoryType[]>();

    let [tags, setTags] = React.useState<string[]>(initialGuide.tags ?? []);

    React.useEffect(() => {
        /*if (initialGuide?.cate) {
            getCateDetail(initialGuide.cate).then(({ name }) => {
                setCateName(name);
            })
        }
        if (initialGuide?.gory) {
            getGoryDetail(initialGuide.gory).then(({ name }) => {
                setGoryName(name);
            })
        }*/
    }, [initialGuide]);

    /*React.useEffect(() => {
        if (cateIndex !== undefined) {
            getCateDetail(cateIndex).then(({ gories }) => {
                setGories(gories);
            })
        } else {
            setGories(undefined);
        }
    }, [cateIndex]);*/

    return (<>
        <div className='writeBox guide'>
            <PageTitle style={{margin: '40px'}}> 
                <FormattedMessage id={ behavior == 'add' ? 'editor.addguide' : 'editor.updateguide' } />
            </PageTitle>
{/* 
            <div className='flexbox'>
                <CateInput cateName={cateName} setCateName={setCateName} cates={cates} setCateIndex={(x) => {setCateIndex(x); setGoryName(''); setGoryIndex(undefined); }} />
                <GoryInput goryName={goryName} setGoryName={setGoryName} gories={gories} setGoryIndex={setGoryIndex} />
                <PriorityInput priority={priority} setPriority={setPriority} />
            </div>
*/}

            { isAdmin && (
                <div className='flexbox'>
                    <AuthorsInput authors={authors} setAuthors={setAuthors} isAdmin={isAdmin} />                
                </div>
            )}

            <div className=''>
                <label>
                    <FormattedMessage id='editor.guidetitle' />
                </label>
                <input className='title' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>

            <MarkdownEditor className='' body={ content } update={ (c) => setContent(c) } />

            <div className='editorBottom'>
                <div style={{flex: 1, overflow: 'auto', fontSize: '16px', margin: '20px 20px 10px 10px'}}>
                    {/* TODO whitelist from API */}
                    <Tags onChange={useCallback((e) => {
                        let tagStrings = e.detail.tagify.value.map((element: TagData) => element.value);
                        console.log(tagStrings);
                        setTags(tagStrings);
                    }, [])} defaultValue="welcome, to, nacom"/>
                </div>
                {/* <div style={{flexGrow: 1, fontSize: '16px', lineHeight: '24px', margin: '30px 0px'}}>
                    <span className='material-icons link' onClick={() => setIsPublic(!isPublic)} style={{transform: 'translateY(6px)'}}> 
                        { isPublic ? 'check_box' : 'check_box_outline_blank'} 
                    </span>
                    <FormattedMessage id={ isPublic ? 'editor.public' : 'editor.private' } />
                </div> */}

                <Button className='submit link' onClick={
                    async () => {
                        upload(
                            // TODO add tags
                            { name, content, authors: authors.filter((s) => s.length > 0), tags: tags },
                            setMessage
                        );
                    }
                }> 
                    <FormattedMessage id='editor.savedraft' />
                </Button>
                <Button className='submit link' onClick={
                    async () => {
                        /*if (!cateName || !goryName) {
                            setMessage('카테고리를 적어주세요.');
                            return;
                        }
                        
                        let cate = cateIndex ?? (await postCate({ name: cateName, gories: [], })).index;
                        let gory = goryIndex ?? (await postGory({ name: goryName, cate, guides: [] })).index;*/
                        
                        upload(
                            { name, content, authors: authors.filter((s) => s.length > 0), tags: tags },
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