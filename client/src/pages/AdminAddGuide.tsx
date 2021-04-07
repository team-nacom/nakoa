import Footer from 'components/Footer';
import Header from 'components/Header';
import PageTitle from 'components/PageTitle';
import MarkdownEditor from 'components/MarkdownEditor';

import { postGuide } from 'etc/api';
import React from 'react';
import { Redirect } from 'react-router';

function AdminAddGuide() {
    let [name, setName] = React.useState<string>('');
    let [content, setContent] = React.useState<string>('');
    let [priority, setPriority] = React.useState<number>(5);
    let [message, setMessage] = React.useState<string>();
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
        if (!name || !content || !priority ) {
            setMessage('모든 항목을 채워주세요.');
            return;
        }

        postGuide({index: 0, name, content, priority}).then((success) => {
            if (success) setMessage('업로드에 성공했습니다!');
            else setMessage('업로드에 실패했습니다...');
        })
    }

    // if (redirectToPost) return <Redirect to={`/guide/${index}`} />
    return (<>
        <Header/>
        <div className='adminBox guide'>
            <PageTitle style={{margin: '40px'}}> 가이드 추가 </PageTitle>

            <div className='flexbox'>
                <div className='adminForm'>
                    <label> 중요도 </label>
                    <div>
                        <button className={'button ' + (priority === 5 ? 'active' : 'inactive')} onClick={(e) => setPriority(5)}>Essential</button>
                        <button className={'button ' + (priority === 4 ? 'active' : 'inactive')} onClick={(e) => setPriority(4)}>Recommendable</button>
                        <button className={'button ' + (priority === 3 ? 'active' : 'inactive')} onClick={(e) => setPriority(3)}>Readable</button>
                        <button className={'button ' + (priority === 2 ? 'active' : 'inactive')} onClick={(e) => setPriority(2)}>Optional</button>
                        <button className={'button ' + (priority === 1 ? 'active' : 'inactive')} onClick={(e) => setPriority(1)}>Draft</button>
                    </div>
                </div>
            </div>

            <div className='adminForm'>
                <label> 가이드 제목 </label>
                <input value={name} onChange={(e) => setName(e.target.value)}/>
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