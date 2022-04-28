import Footer from 'components/Footer';
import Header from 'components/Header';
import { getFlat, hideFlat, unhideFlat, FlatItem } from 'etc/api/flat';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link, Redirect, useHistory, useParams } from 'react-router-dom';
import Loading from '../Loading';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import BubbleSidebar from 'components/BubbleSidebar';
import Button from 'components/Button';
import { Flat } from 'components/naflat/flat';
import { FlatDisplayComponent } from 'components/naflat/component';


interface Params {
    index: string;
};

function FlatPage() {
    let params = useParams<Params>();
    let history = useHistory();
    let index = React.useMemo(() => params.index, [params]);

    let [flat, setFlat] = React.useState<FlatItem>();
    let [flatLoading, _] = usePromise(() => {
        return getFlat(index).then(flat => setFlat(flat));
    }, [index]);
    let parsedFlatRef = React.useRef<Flat>({});

    React.useEffect(() => {
        let content = flat?.content;
        if (!content) return;

        parsedFlatRef.current = JSON.parse(content) as Flat
        console.log(parsedFlatRef.current);
    }, [flat]);

    let [toggleFlat, icon, confirmMesg] = flat?.hidden ? 
        [unhideFlat, 'visibility', '정말 이 글을 공개하시겠습니까?'] :
        [hideFlat, 'visibility_off', '정말 이 글을 숨기시겠습니까?'];
    

    if (flatLoading) return <Loading/>;
    return (
        <>
            <Header />
            { flat && (
                <BubbleSidebar on='post'>
                    <Button className='material-icons' onClick={async (e) => {
                        e.preventDefault();
                        if (window.confirm(confirmMesg)) {
                            await toggleFlat(index);
                            setFlat(await getFlat(index));
                        }
                    }}> {icon} </Button>
                    <Button className='material-icons' onClick={async (e) => {
                        e.preventDefault();
                        history.push('/write', {copySourceFlat: flat});
                    }}> content_copy </Button>
                </BubbleSidebar>
            )}

            <div id='content'>
                { flat && parsedFlatRef.current ? (
                    <>
                        <div className='displayText'>
                            <h1 className='title'> { flat.title } </h1>
                            <h2 className='author'> { flat.author } </h2>
                        </div>
                        <div className='cellDisplayWrapper'>
                        <FlatDisplayComponent cellId='c0' initialFlat={ parsedFlatRef.current }/>
                        </div>
                    </>
                ) : (
                    <p> 존재하지 않는 버블입니다. </p>
                )}
            </div>
            <Footer />
        </>
    );
}

export default FlatPage;