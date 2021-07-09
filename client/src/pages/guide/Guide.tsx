import GuideView from 'components/GuideView';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { getGuide, removeGuide } from 'etc/api/guide';
import { useIsAdmin } from 'etc/api/user';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link, match, Redirect } from 'react-router-dom';
import Loading from '../Loading';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';

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
    let user = useSelector((state: RootReducer) => state.user);
    let isAdmin = useIsAdmin();

    if (redirectToList) return <Redirect to='/guide' />
    if (guideLoading) return <Loading/>;
    return (
        <>
            <Header />

            <div className='flexbox'>
                { isAdmin && 
                    <button className='button' onClick={async (e) => {
                        e.preventDefault();
                        if (window.confirm('정말 삭제하시겠습니까?') && await removeGuide(id)) {
                            setRedirectToList(true);
                        }
                    }}>
                        글 지우기
                    </button> 
                }

                { (isAdmin || (user.loggedIn && guide && guide.authors.filter(x => x === user.nickname).length > 0)) && 
                    <span>
                        <Link to={`/guide/${id}/edit`}>
                            <button className='button'>
                                수정하기
                            </button> 
                        </Link>
                    </span>
                }
            </div>

            { guide ? (
                <GuideView guide={guide} />
            ) : (
                <p> 존재하지 않는 가이드입니다. </p>
            )}
            <Footer />
        </>
    );
}
export default Guide;