import Footer from 'components/Footer';
import Header from 'components/Header';
import PageTitle from 'components/PageTitle';
import MarkdownEditor from 'components/MarkdownEditor';

import { getGuideCategories, getGuideSections, GuideType, useIsAdmin } from 'etc/api';
import React from 'react';
import usePromise from 'etc/usePromise';

// This function can be well modified for better auto-complete support
function isStringRelated(current: string, target: string) {
    return target.startsWith(current);
}

interface CategoryInputProps {
    category: string;
    setCategory: (category: string) => void;
}

function CategoryInput({ category, setCategory }: CategoryInputProps) {
    let [candidates, setCandidates] = React.useState<string[]>([]);
    let [nowFocus, setNowFocus] = React.useState<boolean>(false);

    React.useEffect(() => {
        getGuideCategories().then((categories) => {
            setCandidates(categories);
        });
    }, []);

    return (
        <div className='adminForm'>
            <label> CATEGORY </label>
            <div>
                <input 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    onFocus={() => setNowFocus(true)} 
                    onBlur={() => setNowFocus(false)}
                />
            </div>
            { nowFocus && candidates.length > 0 && (
                <div className='candidateContainer'>
                    { candidates.filter((s) => isStringRelated(category, s)).map((value) => <div className='candidate'> {value} </div> )}
                </div>
            )}
        </div>
    )
}

interface SectionInputProps {
    category: string;
    section: string;
    setSection: (section: string) => void;
}

function SectionInput({ category, section, setSection } : SectionInputProps) {
    let [candidates, setCandidates] = React.useState<string[]>([]);
    let [loadedCategory, setLoadedCategory] = React.useState<string>('');
    let [nowFocus, setNowFocus] = React.useState<boolean>(false);

    React.useEffect(() => {
        getGuideSections(loadedCategory).then((sections) => {
            setCandidates(sections);
        })
    }, [loadedCategory]);

    return (
        <div className='adminForm'>
            <label> SECTION </label>
            <div>
                <input 
                    value={section} 
                    onChange={(e) => setSection(e.target.value)} 
                    onFocus={() => {
                        setNowFocus(true);
                        if (category !== loadedCategory) {
                            setLoadedCategory(category);
                        }
                    }} 
                    onBlur={() => setNowFocus(false)}
                />
            </div>
            { nowFocus && candidates.length > 0 && (
                <div className='candidateContainer'>
                    { candidates.filter((s) => isStringRelated(section, s)).map((value) => <div className='candidate'> {value} </div> )}
                </div>
            )}
        </div>
    )
}

interface Props {
    initialGuide?: GuideType,
    upload: (guide: GuideType, 
             setMessage: (message: string) => void) 
        => void,
    author?: string,
    behavior: 'add' | 'edit'
}


function GuideEditor({ initialGuide, upload, author: _author, behavior } : Props) {
    let isAdmin = useIsAdmin();

    let [name, setName] = React.useState<string>(initialGuide?.name ?? '');
    let [category, setCategory] = React.useState<string>(initialGuide?.category ?? '');
    let [section, setSection] = React.useState<string>(initialGuide?.section ?? '');
    let [author, setAuthor] = React.useState<string>(initialGuide?.authors.join(', ') ?? _author ?? '');
    let [content, setContent] = React.useState<string>(initialGuide?.content ?? '');
    let [priority, setPriority] = React.useState<number>(initialGuide?.priority ?? 4);
    let [isPublic, setIsPublic] = React.useState<boolean>(initialGuide?.isPublic ?? true);
    let [message, setMessage] = React.useState<string>();

    return (<>
        <div className='adminBox guide'>
            <PageTitle style={{margin: '40px'}}> 
                { behavior == 'add' ? '가이드 추가' : '가이드 수정'} 
            </PageTitle>

            <div className='flexbox'>
                <CategoryInput category={category} setCategory={setCategory} />
                <SectionInput category={category} section={section} setSection={setSection} />
                <div className='adminForm'>
                    <label> 작성자 </label>
                    <div>
                        { isAdmin
                            ? <input value={author} onChange={(e) => setAuthor(e.target.value)} />
                            : <input value={author} readOnly />
                        }
                    </div>
                </div>
                <div className='adminForm'>
                    <label> 중요도 </label>
                    <div>
                        <select onChange={(e) => setPriority(Number.parseInt(e.target.value))}>
                            { ['Draft', 'Optional', 'Readable', 'Recommendable', 'Essential'].map((s, i) => (
                                <option value={i}> {s} </option>
                            )) }
                        </select>
                    </div>
                </div>
            </div>

            <div className=''>
                <label> 가이드 제목 </label>
                <input className='title' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>

            <MarkdownEditor className='' body={ content } update={ (c) => setContent(c) } />

            <div className='editorBottom'>
                <div style={{flexGrow: 1, fontSize: '16px', lineHeight: '24px', margin: '30px 0px'}}>
                    <span className='material-icons link' onClick={() => setIsPublic(!isPublic)} style={{transform: 'translateY(6px)'}}> 
                        { isPublic ? 'check_box' : 'check_box_outline_blank'} 
                    </span>
                    <span> { isPublic ? '공개' : '비공개' } </span>
                </div>

                <button className='submit link' onClick={
                    () => upload(
                        { name, content, priority, category, section, authors: author.split(',').map(s => s.trim()), isPublic },
                        setMessage
                    )
                }> 
                    { behavior == 'add' ? '게시하기' : '수정하기' }
                </button>
            </div>
            {message}
        </div>
    </>)
}


export default GuideEditor;