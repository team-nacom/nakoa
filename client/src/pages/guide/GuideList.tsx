import Footer from "components/Footer";
import GuideSidebar from "components/GuideSidebar";
import Header from "components/Header";
import PageTitle from "components/PageTitle";
import { getGuides } from "etc/api/guide";
import usePromise from "etc/usePromise";
import Loading from "pages/Loading";
import { Link } from "react-router-dom";
import GuideGallary from "../../components/GuideGallary";


function GuideList() {
    
    let [guidesLoading, guides] = usePromise(getGuides);
    
    if (guidesLoading) return <Loading/>;
    else return (
        <>
            <Header/>
            <div className='guideBackground' /> 
            <GuideSidebar on='list'>
                <span>
                    <Link to={'/guide/write'}>
                        <button className='roundButton material-icons'> 
                            create
                        </button>
                    </Link>
                </span>
            </GuideSidebar>
            <div id='content'>
                <PageTitle>
                    모든 글 보기
                </PageTitle>
                <GuideGallary guides={guides || []} />
            </div>
            <Footer/>
        </>
    );
}

export default GuideList;