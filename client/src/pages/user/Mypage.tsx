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

interface Props {
    location: Location;
}

function MyPage({ location } : Props) {

    let [userLoading, user] = usePromise(() => getMyPage())
    if (user == null) return <></>;

    return (
    <div>
        <p>[닉네임]{user.nickname}</p>
        {user.guides.map((guide) => (
            <div className='guideListItem'>
                <Link to={`/guide/${guide.index}`}>
                    [제목]
                    <span className='title'> { guide.name } </span>
                    [내용]
                    <span className='content'> { guide.content.substring(0,30) } </span>
                </Link> 
                [글쓴이]
                <span className='author'> { guide.authors[0] } </span>
            </div>
        ))}
    </div>
    );
}

export default MyPage;