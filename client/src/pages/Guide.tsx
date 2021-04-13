import GuideView from 'components/GuideView';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { getGuide, isAdmin, removeGuide } from 'etc/api';
import usePromise from 'etc/usePromise';
import React from 'react';
import { match, Redirect } from 'react-router-dom';
import Loading from './Loading';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function Guide({ match } : Props) {
    let id = Number.parseInt(match.params.id);
    let [guideLoading, guide] = usePromise(() => getGuide(id));
    let [redirectToList, setRedirectToList] = React.useState(false);
    

    if (redirectToList) return <Redirect to='/guide' />
    if (guideLoading) return <Loading/>;
    return (
        <>
            <Header />

            { isAdmin() && 
                <button className='button' onClick={async (e) => {
                    e.preventDefault();
                    if (await removeGuide(id)) {
                        setRedirectToList(true);
                    }
                }}>
                    글 지우기
                </button> 
            }

            { guide ? (
                <GuideView title={ guide.name } authors={guide.authors || ['junie']} text={guide.content} />
            ) : (
                <p>404 : 해당 가이드가 존재하지 않습니다.</p>
            )}
            <Footer />
        </>
    );
}
export default Guide;