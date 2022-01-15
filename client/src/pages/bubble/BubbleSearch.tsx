import Footer from "components/Footer";
import BubbleSidebar from 'components/BubbleSidebar';
import Header from "components/Header";
import PageTitle from "components/PageTitle";
import React from 'react';
import { Link, withRouter } from "react-router-dom";
import AuthorInput from '../../components/AuthorInput';

function BubbleSearch(props: any) {
    // TODO Local cached author name
    let [author, setAuthor] = React.useState<string>('');
    let targetUrl = `/list/${author}`;
    return (
        <>
            <Header/>
            <div className='guideBackground' /> 
            <BubbleSidebar on='list'>
                <span>
                    <Link to={'/write'}>
                        <button className='roundButton material-icons'> 
                            create
                        </button>
                    </Link>
                </span>
            </BubbleSidebar>
            <div id='content'>
                <PageTitle>
                    글쓴이로 글 검색
                </PageTitle>

                <div className='writeBox guide'>
                    <form onSubmit={() => {props.history.push(targetUrl)}}>
                        <div className='flexbox'>
                            <AuthorInput author={author} setAuthor={setAuthor} />
                            <input type="submit" style={{display: 'none'}} />
                        </div>

                        <div className='editorBottom'>
                            <Link to={targetUrl} className='submit link'> 검색 </Link>
                        </div>
                    </form>
                </div>
            </div>

            <Footer/>
        </>
    );
}

export default withRouter(BubbleSearch);