import Footer from "components/Footer";
import GuideSidebar from "components/GuideSidebar";
import Header from "components/Header";
import PageTitle from "components/PageTitle";
import { searchGuides } from "etc/api/guide";
import { useIsLoggedIn } from "etc/api/user";
import usePromise from "etc/usePromise";
import Loading from "pages/Loading";
import React from "react";
import { Link, useParams } from "react-router-dom";
import GuideGallary from "../../components/GuideGallary";



interface Params {
    tag: string;
};

function GuideSearchList() {
    let isLoggedIn = useIsLoggedIn();
    
    let params = useParams<Params>();
    let tag = React.useMemo(() => params.tag, [params]);
    let [guidesLoading, guides] = usePromise(() => searchGuides(tag));
    
    if (guidesLoading) return <Loading/>;
    else return (
        <>
            <Header/>
            <div className='guideBackground' /> 
            <GuideSidebar on='list'>
                { isLoggedIn && (
                    <span>
                        <Link to={'/guide/write'}>
                            <button className='roundButton material-icons'> 
                                create
                            </button>
                        </Link>
                    </span>
                )}
            </GuideSidebar>
            <div id='content'>
                <PageTitle>
                    #{tag} 
                </PageTitle>
                <GuideGallary guides={guides || []} />
            </div>
            <Footer/>
        </>
    );
}

export default GuideSearchList;