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
    tags: bubbleObj.tags,
  });
  await bubble.save();
  ctx.body = bubble;
});

router.get('/', async (ctx) => {
  const query = Bubble.find({})
    .sort({ createDate: -1 })
    .select('name index content tags createDate');

  await query.lean()
    .catch((err) => ctx.throw(500, err))
    .then((docs) => { ctx.body = docs; });
});

router.get('/:index', async (ctx) => {
  const { index } = ctx.params;
  ctx.body = await Bubble.findOne({ index }).exec();
});

router.delete('/:index', async (ctx) => {
  const { index } = ctx.params;
  ctx.body = await Bubble.findOneAndDelete({ index }).exec();
});

router.put('/:index', async (ctx) => {
  const bubbleObj = ctx.request.body;
  const contentString = JSON.stringify(bubbleObj.content);
  const { index } = ctx.params;

  try {
    await Bubble.findOneAndUpdate({ index }, {
      $set: {
        name: bubbleObj.name,
        content: contentString,
        tags: bubbleObj.tags,
      },
    }).exec();
    ctx.body = 'Success';
  } catch (e) {
    ctx.throw(400, 'Error while updating bubble');
  }
});

export default router;
