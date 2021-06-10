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

function useDynamicValue(defaultValue = 0, maxValue = 1, minValue = 0) {
    let [value, setValue] = React.useState<number>(defaultValue);
    let [deltaValue, setDeltaValue] = React.useState<number>(0);

    React.useEffect(() => {
        if (deltaValue !== 0) {
            let nextValue = value + deltaValue;
            if (nextValue >= maxValue) {
                setDeltaValue(0);
                nextValue = maxValue;
            }
            if (nextValue <= minValue) {
                setDeltaValue(0);
                nextValue = minValue;
            }
            setTimeout(() => setValue(nextValue), 25);
        }
    }, [value, deltaValue]);

    return [value, setDeltaValue] as [number, React.Dispatch<React.SetStateAction<number>>];
}

interface CategoryInputProps {
    category: string;
    setCategory: (category: string) => void;
}

function CategoryInput({ category, setCategory }: CategoryInputProps) {
    let [candidates, setCandidates] = React.useState<string[]>([]);
    let [candidateOpacity, setDeltaCandidateOpacity] = useDynamicValue(0);

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
                    onFocus={() => setDeltaCandidateOpacity(0.1) } 
                    onBlur={() => setDeltaCandidateOpacity(-0.1) }
                />
            </div>
            { candidateOpacity > 0 && candidates.length > 0 && (
                <div 
                    className='candidateContainer' 
                    style={{opacity: candidateOpacity }}
                >
                    { candidates.filter((s) => isStringRelated(category, s)).map((value) => (
                        <div className='candidate' onClick={() => setCategory(value)}> {value} </div>
                    ))}
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
    let [candidateOpacity, setDeltaCandidateOpacity] = useDynamicValue(0);

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
                        setDeltaCandidateOpacity(0.1);
                        if (category !== loadedCategory) {
                            setLoadedCategory(category);
                        }
                    }} 
                    onBlur={() => setDeltaCandidateOpacity(-0.1) }
                />
            </div>
            { candidateOpacity > 0 && candidates.length > 0 && (
                <div 
                    className='candidateContainer' 
                    style={{ opacity: candidateOpacity }}
                >
                    { candidates.filter((s) => isStringRelated(section, s)).map((value) => (
                        <div className='candidate' onClick={() => setSection(value) }> {value} </div> 
                    ))}
                </div>
            )}
        </div>
    )
}

interface AuthorInputProps {
    isAdmin: boolean;
    author: string;
    setAuthor: (author: string) => void;
}

function AuthorInput({ isAdmin, author, setAuthor } : AuthorInputProps) {
    return (
        <div className='adminForm'>
            <label> 작성자 </label>
            <div>
                { isAdmin
                    ? <input value={author} onChange={(e) => setAuthor(e.target.value)} />
                    : <input value={author} readOnly />
                }
            </div>
        </div>
    )
}

interface PriorityInputProps {
    priority: number;
    setPriority: (priority: number) => void;
}

function PriorityInput({ priority, setPriority }: PriorityInputProps) {
    const candidates = ['Draft', 'Optional', 'Readable', 'Recommendable', 'Essential'];
    let [candidateOpacity, setDeltaCandidateOpacity] = useDynamicValue(0);

    return (
        <div className='adminForm'>
            <label> 중요도 </label>
            <div>
                <input 
                    value={ candidates[priority] } 
                    readOnly
                    onFocus={() => setDeltaCandidateOpacity(0.1) } 
                    onBlur={() => setDeltaCandidateOpacity(-0.1) }
                />
            </div>
            { candidateOpacity > 0 && (
                <div 
                    className='candidateContainer' 
                    style={{ opacity: candidateOpacity }}
                >
                    { candidates.map((value, index) => (
                        <div className='candidate' onClick={() => setPriority(index) }> {value} </div> 
                    ))}
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
                <SectionInput section={section} setSection={setSection} category={category} />
                <AuthorInput author={author} setAuthor={setAuthor} isAdmin={isAdmin} />
                <PriorityInput priority={priority} setPriority={setPriority} />
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