import Footer from 'components/Footer';
import Header from 'components/Header';
import PageTitle from 'components/PageTitle';
import MarkdownEditor from 'components/MarkdownEditor';

import { postGuide, postTempGuide } from 'etc/api';
import React from 'react';
import { Redirect } from 'react-router';

function AdminAddGuide() {
    let [index, setIndex] = React.useState<number>(1);
    let [name, setName] = React.useState<string>('');
    let [content, setContent] = React.useState<string>('');
    let [priority, setPriority] = React.useState<number>(1);
    let [message, setMessage] = React.useState<string>();
    let [lastModify, setLastModify] = React.useState<number>();
    let [recentlySaved, setRecentlySaved] = React.useState<boolean>(true);
    let [redirectToPost, setRedirectToPost] = React.useState(false);

    React.useEffect(() => {
        setLastModify(new Date().getTime());
    }, [index, name, content, priority]);

    React.useEffect(() => {
        if (recentlySaved) return;

        postTempGuide({
            index, name, content, priority,
        }).then(() => {
            setRecentlySaved(true);
        })

        setTimeout(() => setRecentlySaved(false), 1000);
    }, [index, name, content, priority]);

    if (redirectToPost) return <Redirect to={`/guide/${index}`} />
    return (<>
        <Header/>
        <div className='adminBox guide'>
            <PageTitle> 가이드 추가 </PageTitle>
{/*
            <div className='adminLabel'> 가이드 번호 </div>
            <input type='number' className='adminForm' value={index} onChange={(e) => setIndex(Number.parseInt(e.target.value))}/>
*/}

            <div className='adminLabel'> 가이드 제목 </div>
            <input className='adminForm' value={name} onChange={(e) => setName(e.target.value)}/>

            <div className='adminLabel'> 중요도 </div>
            <div>
                <button className={'button adminForm ' + (priority === 5 ? 'active' : 'inactive')} onClick={(e) => setPriority(5)}>Essential</button>
                <button className={'button adminForm ' + (priority === 4 ? 'active' : 'inactive')} onClick={(e) => setPriority(4)}>Recommendable</button>
                <button className={'button adminForm ' + (priority === 3 ? 'active' : 'inactive')} onClick={(e) => setPriority(3)}>Readable</button>
                <button className={'button adminForm ' + (priority === 2 ? 'active' : 'inactive')} onClick={(e) => setPriority(2)}>Optional</button>
                <button className={'button adminForm ' + (priority === 1 ? 'active' : 'inactive')} onClick={(e) => setPriority(1)}>Draft</button>
            </div>

            <MarkdownEditor className='adminForm' body='' update={ (c) => setContent(c) } />

            <button className='button' onClick={() => {
                if (!index || !name || !content || !priority ) {
                    setMessage('모든 항목을 채워주세요.');
                    return;
                }

                postGuide({index, name, content, priority}).then((success) => {
                    if (success) {
                        setMessage('업로드에 성공했습니다!');
                        setRedirectToPost(true);
                    }
                    else setMessage('업로드에 실패했습니다...');
                }).catch((e) => {
                    setMessage(`업로드에 문제가 생겼습니다...: ${e}`);
                });
            }}> 추가하기 </button>
            {message}
        </div>

        <Footer/>
    </>)
}


export default AdminAddGuide;