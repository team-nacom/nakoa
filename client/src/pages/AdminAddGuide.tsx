import Footer from 'components/Footer';
import Header from 'components/Header';
import PageTitle from 'components/PageTitle';
import MarkdownEditor from 'components/MarkdownEditor';

import { isAdmin, postGuide } from 'etc/api';
import React from 'react';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';

function AdminAddGuide() {
    let [name, setName] = React.useState<string>('');
    let [category, setCategory] = React.useState<string>('');
    let [section, setSection] = React.useState<string>('');
    let [author, setAuthor] = React.useState<string>('');
    let [content, setContent] = React.useState<string>('');
    let [priority, setPriority] = React.useState<number>(5);
    let [message, setMessage] = React.useState<string>();
    let [redirectIndex, setRedirectIndex] = React.useState<number>();
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

    let upload = () => {
        if (!name || !content || !priority || !category || !section || !author) {
            setMessage('모든 항목을 채워주세요.');
            return;
        }

        let authors = author.split(',').map(s => s.trim());

        postGuide({name, content, priority, category, section, authors}).then(({success, index}) => {
            if (success) {
                setMessage('업로드에 성공했습니다!');
                setRedirectIndex(index);
            }
            else setMessage('업로드에 실패했습니다...');
        })
    }

    if (redirectIndex) return <Redirect to={`/guide/${redirectIndex}`} />
    return (<>
        <Header/>
        <div className='adminBox guide'>
            <PageTitle style={{margin: '40px'}}> 가이드 추가 </PageTitle>

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

            <MarkdownEditor className='adminForm' body='' update={ (c) => setContent(c) } />

            <div style={{borderTop: '2px #E8E8E8 solid', margin: '0px', marginTop: '15px', padding: '0px 30px'}}>

                <button className='submit link' onClick={upload}> 게시하기 </button>
            </div>
            {message}
        </div>

        <Footer/>
    </>)
}


export default AdminAddGuide;