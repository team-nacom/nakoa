import Footer from 'components/Footer';
import Header from 'components/Header';

import { GuideType, isAdmin, postGuide } from 'etc/api';
import React from 'react';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import GuideEditor from 'components/GuideEditor';

function AdminAddGuide() {
    let user = useSelector((state: RootReducer) => state.user);
    let [redirectTo, setRedirectTo] = React.useState<string>();

    let upload = (guide: GuideType, setMessage: (message: string) => void) => {
        if (!guide.name || !guide.content || !guide.priority || !guide.category || !guide.section || guide.authors.length < 1) {
            setMessage('모든 항목을 채워주세요.');
            return;
        }

        postGuide(guide).then(({success, index}) => {
            if (success) {
                setMessage('업로드에 성공했습니다!');
                setRedirectTo(`/guide/${index}`);
            }
            else setMessage('업로드에 실패했습니다...');
        })
    }

    if (redirectTo) return <Redirect to={redirectTo} />
    return (
        <>
            <Header/>
            <GuideEditor upload={upload} author={isAdmin() ? undefined : user.nickname} behavior='add' />
            <Footer/>
        </>
    )
}


export default AdminAddGuide;