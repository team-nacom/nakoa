import { openDB, DBSchema } from 'idb';


import type { ClassicArticle, BasicCellArticle } from '#common/Article';
import type { Cell } from "#/components/cell-editor/cell";

import type { Article } from '#/components/cell-editor/types';

interface NacomDB extends DBSchema {
    drafts: {
        key: string, // primary key localIndex
        value: Article,
        indexes: {
            'localIndex': string,
        }
    },
    articles: {
        key: string, // primary key localIndex
        value: Article,
        indexes: {
            'localIndex': string,
            'publicIndex': string, // secondary keys
        },
    },
    files: {
        key: [string, string],
        value: {
            localIndex: string,
            attachmentIndex: string,
            file: File,
        },
        indexes: {
            'localIndex': string,
            'attachmentIndex': string,
        },
    }
}


async function _create(){
    const db = await openDB<NacomDB>('nacom-db', /* version: */ 2, {
        upgrade: (db, oldVersion) => {
            // versions are linear, hence fall-through; no breaks inside switch
            switch(oldVersion){
            case 0:
                const DraftStore = db.createObjectStore('drafts', { keyPath: 'localIndex' });
                DraftStore.createIndex('localIndex', 'localIndex');

                const ArticleStore = db.createObjectStore('articles', { keyPath: 'localIndex' });
                ArticleStore.createIndex('localIndex', 'localIndex');
                ArticleStore.createIndex('publicIndex', 'publicIndex');

                // store.createIndex(indexName, keyPath)
            case 1:
                const FileStore = db.createObjectStore('files', {
                    keyPath: ['localIndex', 'attachmentIndex']
                });
                FileStore.createIndex('localIndex', 'localIndex'); // article index.
                FileStore.createIndex('attachmentIndex', 'attachmentIndex');
            }
        },
    })

    return db;
}

let promise: ReturnType<typeof _create> | undefined = undefined;

export default function getDB() /* : ReturnType<typeof _create> */
{
    if(!promise){
        promise = _create();
    }
    return promise;
}