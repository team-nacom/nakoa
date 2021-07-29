import Footer from 'components/Footer';
import Header from 'components/Header';
import PageTitle from 'components/PageTitle';
import MarkdownEditor from 'components/MarkdownEditor';

import { getGuideCategories, getGuideSections, GuideType, priorityTags } from 'etc/api/guide';
import { useIsAdmin } from 'etc/api/user';
import React from 'react';

import { FormattedMessage } from 'react-intl';

// This function can be well modified for better auto-complete support
function isStringRelated(current: string, target: string) {
    return target.includes(current);
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
        <div className='writeForm'>
            <label> CATEGORY </label>
            <div>
                <input 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    onMouseEnter={() => setDeltaCandidateOpacity(0.1) } 
                    onMouseLeave={() => setDeltaCandidateOpacity(-0.1) }
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
        <div className='writeForm'>
            <label> SECTION </label>
            <div>
                <input 
                    value={section} 
                    onChange={(e) => setSection(e.target.value)} 
                    onMouseEnter={() => {
                        setDeltaCandidateOpacity(0.1);
                        if (category !== loadedCategory) {
                            setLoadedCategory(category);
                        }
                    }} 
                    onMouseLeave={() => setDeltaCandidateOpacity(-0.1) }
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
    authors: string[];
    setAuthors: (authors: string[]) => void;
}

function AuthorsInput({ isAdmin, authors, setAuthors } : AuthorInputProps) {
    let [authorsOpacity, setDeltaAuthorsOpacity] = useDynamicValue(0);
    const editable = isAdmin;

    return (
        <div className='writeForm'>
            <label>
                <FormattedMessage id='editor.author' />
            </label>
            <div>
                <input 
                    value={ authors.join(', ') } 
                    readOnly
                    onMouseEnter={() => setDeltaAuthorsOpacity(0.1) } 
                    onMouseLeave={() => setDeltaAuthorsOpacity(-0.1) }
                />
            </div>
            { authorsOpacity > 0 && (
                <div 
                    className='candidateContainer' 
                    style={{ opacity: authorsOpacity }}
                    onMouseEnter={() => setDeltaAuthorsOpacity(0.1) } 
                    onMouseLeave={() => setDeltaAuthorsOpacity(-0.1) }
                >
                    { authors.map((value, index) => editable ? (
                        <div className='candidate'>
                            <input 
                                value={value} 
                                onChange={(e) => setAuthors(authors.map((s) => (s === value) ? e.target.value.replace(',', '') : s ))} 
                                onBlur={() => setDeltaAuthorsOpacity(-0.1) }
                            />
                            <span 
                                className='candidateRemove material-icons' 
                                onClick={() => setAuthors(authors.slice(0, index).concat(authors.slice(index+1)))}
                            >
                                close
                            </span>
                        </div>
                    ) : (
                        <div className='candidate'>
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

interface PriorityInputProps {
    priority: number;
    setPriority: (priority: number) => void;
}

function PriorityInput({ priority, setPriority }: PriorityInputProps) {
    // const candidates = ['Draft', 'Optional', 'Readable', 'Recommendable', 'Essential', 'Draft'];
    let [candidateOpacity, setDeltaCandidateOpacity] = useDynamicValue(0);

    return (
        <div className='writeForm'>
            <label>
                <FormattedMessage id='editor.priority' />
            </label>
            <div>
                <input 
                    value={ priorityTags[priority] } 
                    readOnly
                    onMouseEnter={() => setDeltaCandidateOpacity(0.1) } 
                    onMouseLeave={() => setDeltaCandidateOpacity(-0.1) }
                />
            </div>
            { candidateOpacity > 0 && (
                <div 
                    className='candidateContainer' 
                    style={{ opacity: candidateOpacity }}
                    onMouseEnter={() => setDeltaCandidateOpacity(0.1) } 
                    onMouseLeave={() => setDeltaCandidateOpacity(-0.1) }
                >
                    { [0, 1, 2, 3, 4].map((value) => (
                        <div className='candidate' onClick={() => setPriority(value) }> {priorityTags[value]} </div> 
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


function GuideEditor({ initialGuide, upload, author: initialAuthor, behavior } : Props) {
    let isAdmin = useIsAdmin();

    let [name, setName] = React.useState<string>(initialGuide?.name ?? '');
    let [category, setCategory] = React.useState<string>(initialGuide?.category ?? '');
    let [section, setSection] = React.useState<string>(initialGuide?.section ?? '');
    let [authors, setAuthors] = React.useState<string[]>(initialGuide?.authors ?? (initialAuthor ? [ initialAuthor ] : []));
    let [content, setContent] = React.useState<string>(initialGuide?.content ?? '');
    let [priority, setPriority] = React.useState<number>(initialGuide?.priority ?? 4);
    let [isPublic, setIsPublic] = React.useState<boolean>(initialGuide?.isPublic ?? true);
    let [message, setMessage] = React.useState<string>();

    return (<>
        <div className='writeBox guide'>
            <PageTitle style={{margin: '40px'}}> 
                <FormattedMessage id={ behavior == 'add' ? 'editor.addguide' : 'editor.updateguide' } />
            </PageTitle>

            <div className='flexbox'>
                <CategoryInput category={category} setCategory={setCategory} />
                <SectionInput section={section} setSection={setSection} category={category} />
                <AuthorsInput authors={authors} setAuthors={setAuthors} isAdmin={isAdmin} />
                <PriorityInput priority={priority} setPriority={setPriority} />
            </div>

            <div className=''>
                <label>
                    <FormattedMessage id='editor.guidetitle' />
                </label>
                <input className='title' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>

            <MarkdownEditor className='' body={ content } update={ (c) => setContent(c) } />

            <div className='editorBottom'>
                <div style={{flexGrow: 1, fontSize: '16px', lineHeight: '24px', margin: '30px 0px'}}>
                    <span className='material-icons link' onClick={() => setIsPublic(!isPublic)} style={{transform: 'translateY(6px)'}}> 
                        { isPublic ? 'check_box' : 'check_box_outline_blank'} 
                    </span>
                    <FormattedMessage id={ isPublic ? 'editor.public' : 'editor.private' } />
                </div>

                <button className='submit link' onClick={
                    () => upload(
                        { name, content, priority, category, section, authors: authors.filter((s) => s.length > 0), isPublic },
                        setMessage
                    )
                }> 
                    <FormattedMessage id='editor.confirm' />
                </button>
            </div>
            {message}
        </div>
    </>)
}


export default GuideEditor;