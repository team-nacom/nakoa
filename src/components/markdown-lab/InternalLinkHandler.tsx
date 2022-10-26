import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

const InternalLinkHandler : Plugin = () => {
    const internalLinkHandler : Transformer = (tree, file) => {
        const root = tree as Parent;

        visit(root, 'link', (node: any) => {
            node.data = node.data || {}
            if(typeof node.url === 'string' && node.url.startsWith('guide:')){
                var idStr = node.url.slice('guide:'.length)

                var id = Number(idStr);
                if(!isNaN(id) && id > 0){
                    node.type = 'intLink';
                    node.for = 'guide';
                    node.target = id;
                }
                else{
                    node.url = '#';
                }
            }
        })
    }

    return internalLinkHandler;
}

export default InternalLinkHandler;