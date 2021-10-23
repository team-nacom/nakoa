import React from 'react';
import GuideGallary from "components/GuideGallary";
import Header from "components/Header";
import PageTitle from "components/PageTitle";
import { getUserProfile } from 'etc/api/user';
import usePromise from 'etc/usePromise';
import { useParams } from 'react-router';
import Loading from 'pages/Loading';


interface Params {
    nickname: string;
};

function User() {
    let params = useParams<Params>();
    let nickname = params.nickname;

    let [userLoading, user] = usePromise(() => getUserProfile(nickname));

    if (userLoading) return <Loading />;
    else if (!user) return (
        <>
            <Header />
            <div className='guideBackground' />
            <PageTitle>
                찾는 사용자가 없습니다.
            </PageTitle>
        </>
    );
    else return (
        <>
            <Header />
            <div className='guideBackground' />
            <div className='userTop'>
                <div className='nickname'>
                    { user.nickname }
                </div>
            </div>
            <GuideGallary guides={user.guides} />
        </>
    )
}

export default User;