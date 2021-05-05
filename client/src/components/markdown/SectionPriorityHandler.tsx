import React, { Children } from 'react';

import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';

const SectionPriorityHandler : Plugin = () => {
    const sectionPriorityHandler : Transformer = (tree, file) => {
        const root = tree as Parent;
        const marker = '+ ';

        for(const node of root.children){
            if(node.type === 'paragraph'
            && 'children' in node
            && Array.isArray(node.children)
            && node.children[0].type === 'text'){
                const str = node.children[0].value as string;
                const h = str.indexOf(marker)
                
                if(h !== -1 && [undefined,'#','##','###','####','#####','######'].indexOf(str.slice(0,h)) !== -1 ){ //indexOf result should be equal to h
                    node.children[0].value = str.slice(h + marker.length).trimStart();
                    node.type = 'heading';
                    node.depth = h;
                    node.data = {
                        unnumbered: true
                    }
                }
            }
        }
    }

    return sectionPriorityHandler;
}

export default SectionPriorityHandler;