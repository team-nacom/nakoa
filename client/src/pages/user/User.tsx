import React from 'react';
import GuideGallary from "components/GuideGallary";
import Header from "components/Header";
import PageTitle from "components/PageTitle";
import { getUserProfile, UserData } from 'etc/api/user';
import usePromise from 'etc/usePromise';
import { Redirect, useParams } from 'react-router';
import Loading from 'pages/Loading';
import Tabs, { TabData } from 'components/Tabs';
import MarkdownRenderer from 'components/markdown/MarkdownRenderer';

const UserContext = React.createContext<UserData | undefined>(undefined);

function UserMain() {
    const user = React.useContext(UserContext);
    
    if (!user) return <></>;
    return (
        <div id='content'>
            <MarkdownRenderer>
                {`# 반갑습니다! \n${user.nickname}의 개인 페이지입니다.`}
            </MarkdownRenderer>
        </div>
    )
}

function UserGuides() {
    const user = React.useContext(UserContext);
    
    if (!user) return <></>;
    return (
        <div id='content'>
            <GuideGallary guides={user.guides} />
        </div>
    )
}
interface Params {
    nickname: string;
    menu?: string;
};

function User() {
    let params = useParams<Params>();
    let nickname = React.useMemo(() => params.nickname, [params]);
    let menu = React.useMemo(() => params.menu, [params]);
    
    let [userLoading, user] = usePromise(() => getUserProfile(nickname));

    let tabData: TabData[] = React.useMemo(() => [
        {
            name: '소개',
            link: `/user/${nickname}`,
            active: !menu,
        }, {
            name: '작성한 글',
            link: `/user/${nickname}/posts`,
            active: (menu === 'posts'),
        },
    ], [params]);

    if (tabData.every((tab) => !tab.active)) return <Redirect to={`/user/${nickname}`}/>
    else if (userLoading) return <Loading />;
    else if (!user) return (
        <>
            <Header />
            <div className='guideBackground' />
            <PageTitle>
                없는 사용자입니다.
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
            <Tabs data={tabData} className='userTabs' />
            <UserContext.Provider value={user}>
                { tabData[0].active && <UserMain/> }
                { tabData[1].active && <UserGuides/> }
            </UserContext.Provider>
        </>
    )
}

export default User;