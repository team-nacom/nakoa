import Footer from 'components/Footer';
import Header from 'components/Header';

import { GuidePost, postGuide } from 'etc/api/guide';
import { useIsAdmin } from 'etc/api/user';
import React from 'react';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import queryString from 'query-string';
import GuideEditor from 'components/GuideEditor';

interface Query {
    cate?: string;
    gory?: string;
}

interface Props {
    location: Location;
}


function GuideWrite({ location } : Props) {
    let user = useSelector((state: RootReducer) => state.user);
    let [redirectTo, setRedirectTo] = React.useState<string>();
    let isAdmin = useIsAdmin();

//    let rawQuery = location.search;
//    let parsedQuery = queryString.parse(rawQuery);
//    let query: Query = {
//        cate: parsedQuery.cate?.toString(),
//        gory: parsedQuery.gory?.toString(),
//    };
    
    let upload = (guide: GuidePost, setMessage: (message: string) => void) => {
        if (!guide.name || !guide.content || guide.authors.length < 1) {
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

    let initialGuide: Partial<GuidePost> = {
        //cate: query.cate ? Number.parseInt(query.cate) : undefined,
        //gory: query.gory,
        authors: isAdmin ? undefined : [user.nickname],
    };

    if (redirectTo) return <Redirect to={redirectTo} />
    return (
        <>
            <Header/>
            <GuideEditor initialGuide={initialGuide} upload={upload} behavior='add' />
            <Footer/>
        </>
    )
}


export default GuideWrite;