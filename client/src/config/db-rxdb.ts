/// This code file is deprecated. use `db-idb.ts` instead.



// see https://github.com/pubkey/rxdb/blob/master/examples/react/src/Database.jsx

import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';

const articleSchema = {
    title: 'nacom article schema',
    version: 0,
    primaryKey: 'localIndex', // this is local schema
    type: 'object',
    properties: {
        localIndex: {
            type: 'string',
            maxLength: 32 // arbitrary number here
            // for unpublished drafts, localIndex will indicate its mode - either '&classic' or '&cell'. Here, '&' is an unused letter of our base64 encoding.
        },
        publicIndex: {
            type: 'string'
        },
        metadata: {
            type: 'object',
            properties: {
                title: {
                    type: 'string'
                },
                author: {
                    type: 'string'
                },
                tags: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                visibility: {
                    type: 'number'
                },
            }
        },
        createDate: {
            type: 'string',
            format: 'date-time'
        },
        updateDate: {
            type: 'string',
            format: 'date-time'
        },
        mode: {
            type: 'number',
            enum: ['classic', 'cell']
        },
        text: {
            type: 'string',
        },
        content: {
            type: 'object',
        }
    },
    required: ['localIndex'],
    indexes: ['localIndex', 'publicIndex', 'createDate'], //on drafts we don't need createDate index though
};

async function _create(){
    const db = await createRxDatabase({
        name: 'nacom',
        storage: getRxStorageDexie()  
    });

    // create collections
    // todo: we have to handle mongodb-like manipulation AND mongoose ORM manipulation on BE. Better integrate them. 
    // possible client-side mongoose -- mquery (no types though!)
    const { articles: Article, drafts: Draft } = await db.addCollections({
        articles: {
            schema: articleSchema
        },
        drafts: {
            schema: articleSchema
        },
    });

    return {
        db,
        Article,
        Draft
    };
}

let promise: ReturnType<typeof _create> | undefined = undefined;

export default function get() /* : ReturnType<typeof _create> */
{
    if(!promise){
        promise = _create();
    }
    return promise;
}