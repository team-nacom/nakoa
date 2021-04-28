import Footer from 'components/Footer';
import Header from 'components/Header';
import PageTitle from 'components/PageTitle';
import MarkdownEditor from 'components/MarkdownEditor';

import { GuideType, isAdmin } from 'etc/api';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';

interface Props {
    initialGuide?: GuideType,
    upload: (guide: GuideType, 
             setMessage: (message: string) => void) 
        => void,
    author?: string,
    behavior: 'add' | 'edit'
}

function GuideEditor({ initialGuide, upload, author: _author, behavior } : Props) {
    let [name, setName] = React.useState<string>(initialGuide?.name || '');
    let [category, setCategory] = React.useState<string>(initialGuide?.category || '');
    let [section, setSection] = React.useState<string>(initialGuide?.section || '');
    let [author, setAuthor] = React.useState<string>(initialGuide?.authors.join(', ') || _author || '');
    let [content, setContent] = React.useState<string>(initialGuide?.content || '');
    let [priority, setPriority] = React.useState<number>(initialGuide?.priority || 5);
    let [message, setMessage] = React.useState<string>();
    let user = useSelector((state: RootReducer) => state.user);

    React.useEffect(() => {
        if (!isAdmin()) setAuthor(user.nickname);
    }, [user]);
    
//    let [lastModify, setLastModify] = React.useState<number>();
//    let [recentlySaved, setRecentlySaved] = React.useState<boolean>(true);

//    React.useEffect(() => {
//        setLastModify(new Date().getTime());
//    }, [name, content, priority]);

//    React.useEffect(() => {
//        if (recentlySaved) return;
//
//        postTempGuide({
//            index: 0, name, content, priority,
//        }).then(() => {
//            setRecentlySaved(true);
//        })
//
//        setTimeout(() => setRecentlySaved(false), 1000);
//    }, [lastModify]);

    return (<>
        <div className='adminBox guide'>
            <PageTitle style={{margin: '40px'}}> 
                { behavior == 'add' ? '가이드 추가' : '가이드 수정'} 
            </PageTitle>

            <div className='flexbox'>
            <div className='adminForm'>
                    <label> CATEGORY </label>
                    <div>
                        <input value={category} onChange={(e) => setCategory(e.target.value)} />
                    </div>
                </div>
                <div className='adminForm'>
                    <label> SECTION </label>
                    <div>
                        <input value={section} onChange={(e) => setSection(e.target.value)} />
                    </div>
                </div>
                <div className='adminForm'>
                    <label> 작성자 </label>
                    <div>
                        { isAdmin() 
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

            <div className='flexbox'>
            </div>

            <div className='adminForm'>
                <label> 가이드 제목 </label>
                <input className='title' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>

            <MarkdownEditor className='adminForm' body={ content } update={ (c) => setContent(c) } />

            <div style={{borderTop: '2px #E8E8E8 solid', margin: '0px', marginTop: '15px', padding: '0px 30px'}}>
                <button className='submit link' onClick={
                    () => upload(
                        { name, content, priority, category, section, authors: author.split(',').map(s => s.trim()) },
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