import Router from 'koa-router';
import Bubble from '../models/bubble';
const router = new Router();


// Post a guide (manual)
router.post('/', async (ctx) => {
    const bubbleObj = ctx.request.body;
    const contentString = JSON.stringify(bubbleObj.content);

    const bubble = new Bubble({
        name: bubbleObj.name,
        content: contentString,
        tags: bubbleObj.tags
    });
    await bubble.save();
    ctx.body = bubble;
});

router.get('/', async (ctx) => {
    const query = Bubble.find({})
        .sort({ createDate: -1 })
        .select('name index content tags createDate');

    await query.lean()
        .catch(err => ctx.throw(500, err))
        .then(docs => ctx.body = docs);
});

router.get('/:index', async (ctx) => {
    const index: string = ctx.params.index;
    ctx.body = await Bubble.findOne({index: index}).exec();
})

router.delete('/:index', async (ctx) => {
    const index: string = ctx.params.index;
    ctx.body = await Bubble.findOneAndDelete({index: index}).exec();
})

export default router;