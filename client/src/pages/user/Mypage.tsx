import Footer from 'components/Footer';
import GuideSidebar from 'components/GuideSidebar';
import Header from 'components/Header';
//import { CateType, getCateDetail, getCates, getGoryDetail, GoryType } from 'etc/api/category';
import { getMyPage, useIsLoggedIn } from 'etc/api/user';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link } from 'react-router-dom';
import Loading from '../Loading';
import queryString from 'query-string';
import { useContext } from 'react';
import GuideGallary from 'components/GuideGallary';
import PageTitle from 'components/PageTitle';

interface Props {
    location: Location;
}

function MyPage({ location } : Props) {

    let [userLoading, user] = usePromise(() => getMyPage());

    if (user == null) return <></>;
    return (
        <>
            <Header />
            <div className='guideBackground' /> 
            <PageTitle>
                { `${user.nickname}님이 작성한 글`}
            </PageTitle>
            <GuideGallary guides={user.guides} />
        </>
    )
}

export default MyPage;