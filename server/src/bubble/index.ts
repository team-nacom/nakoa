import Router from 'koa-router';
import Bubble from '../models/bubble';
const router = new Router();


// Post a guide (manual)
router.post('/', async (ctx) => {
    const content = ctx.request.body;
    const contentString = JSON.stringify(content);

    const bubble = new Bubble({content: contentString});
    await bubble.save();
    ctx.body = bubble;
});

router.get('/', async (ctx) => {
    const query = Bubble.find({})
        .sort({ createDate: -1 })
        .select('index content createDate');

    await query.lean().
    catch(err => ctx.throw(500, err)).
    then(docs => ctx.body = docs);
});

router.delete('/:index', async (ctx) => {
    const index: string = ctx.params.index;
    ctx.body = await Bubble.findOneAndDelete({index: index}).exec();
})

export default router;