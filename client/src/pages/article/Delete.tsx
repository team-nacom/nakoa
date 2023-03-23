import { useEffect, useState, useMemo, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import { Article, removeLocalArticle } from '#/api/article';

import Loading from '../Loading';
import usePromise from '#/misc/usePromise';

function Delete() {
    let params = useParams<{ index: string }>();
    let index = params.index;

    // todo : should authenticate this!

    const [loading] = usePromise(() => removeLocalArticle(index), [index]);

    if(loading) return <Loading />;
    return <Redirect to={'/article/list'} />;
}

export default Delete;