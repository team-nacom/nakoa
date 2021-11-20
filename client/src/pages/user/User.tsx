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
import { RootReducer } from 'store';
import { useSelector } from 'react-redux';
import GuideView from 'components/GuideView';
import GuideSidebar from 'components/GuideSidebar';
import { Link } from 'react-router-dom';

const UserContext = React.createContext<UserData | undefined>(undefined);

function UserMain() {
    const user = React.useContext(UserContext);
    console.log(user);

    let currentUser = useSelector((state: RootReducer) => state.user);
    let isEditable = user?.nickname === currentUser.nickname
    
    if (!user) return <></>;
    else if (user.profile === undefined){
        return (
            <>
            <div id='content'>
                <MarkdownRenderer>
                    {`# 반갑습니다! \n${user.nickname}의 개인 페이지입니다.`}
                </MarkdownRenderer>
            </div>
            <GuideSidebar on='list'>
                { isEditable && (
                    <span>
                        <Link to={'/guide/write?profile=true'}>
                            <button className='roundButton material-icons'> 
                                create
                            </button>
                        </Link>
                    </span>
                )}
            </GuideSidebar>
            </>
        )
    }
    else return (
        <>
            <div id='content'>
                <MarkdownRenderer useTOC={false}>
                    {user.profile.content}
                </MarkdownRenderer>
            </div>

            <GuideSidebar on='list'>
                { isEditable && (
                    <span>
                        <Link to={`/guide/${user.profile.index}/edit`}>
                            <button className='roundButton material-icons'> 
                                create
                            </button>
                        </Link>
                    </span>
                )}
            </GuideSidebar>
        </>
    )
}
interface userGuideParams {
    isPublic: Boolean;
};

function UserGuides(props: userGuideParams) {
    const user = React.useContext(UserContext);
    
    if (!user) return <></>;
    return (
        <div id='content'>
            <GuideGallary guides={user.guides.filter(guide => guide.isPublic === props.isPublic)} />
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
    let currentUser = useSelector((state: RootReducer) => state.user);

    let tabData: TabData[] = React.useMemo(() => [
        {
            name: '소개',
            link: `/user/${nickname}`,
            active: !menu,
        }, {
            name: '작성한 글',
            link: `/user/${nickname}/posts`,
            active: (menu === 'posts'),
        },{
            name: '작성 중인 글',
            link: `/user/${nickname}/incompletePosts`,
            active: (menu === 'incompletePosts'),
        },
    ], [params]);

    if (tabData.every((tab) => !tab.active)) return <Redirect to={`/user/${nickname}`}/>
    else if (userLoading) return <Loading />;
    else if (!user) return (
        <>
            <Header />
            <div className='guideBackground' />
            <div id='content'>
                <PageTitle>
                    없는 사용자입니다.
                </PageTitle>
            </div>
        </>
    );
    else{
        if(currentUser?.nickname !== user.nickname){
            tabData = tabData.slice(0,2);
        }
        return (
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
                { tabData[1].active && <UserGuides isPublic={true}/> }
                { tabData.length > 2 && tabData[2].active && <UserGuides isPublic={false}/> }
            </UserContext.Provider>
        </>
    )
    }
}

export default User;