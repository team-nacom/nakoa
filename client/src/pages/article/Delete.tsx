import { useEffect, useState, useMemo, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import { IdxType, toIdx, Article, removeArticle } from '#/api/article';

import Loading from '../Loading';
import usePromise from '#/misc/usePromise';

function Delete() {
    let params = useParams<{ index: string }>();
    let index: IdxType = useMemo(() => toIdx(params.index), [params]);

    // todo : should authenticate this!

    const [loading] = usePromise(() => removeArticle(index), [index]);

    if(loading) return <Loading />;
    return <Redirect to={'/'} />;
}

export default Delete;