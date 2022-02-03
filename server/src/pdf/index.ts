import Router from 'koa-router';
import PDFDocument from 'pdfkit';
const router = new Router();

router.post('/', async (ctx) => {
  const doc = new PDFDocument();
  const filenameArg: string = ctx.request.body.filename;
  const filename = encodeURIComponent(filenameArg) + '.pdf';

  const content = ctx.request.body.content;
  let end: (value: void | PromiseLike<void>) => void;

  let buffers: Buffer[] = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    let pdfData = Buffer.concat(buffers);
    ctx.set({
      'Content-length': `${Buffer.byteLength(pdfData)}`,
      'Content-type': 'application/pdf',
      'Content-disposition': `attachment; filename="${filename}"`,
    });
    ctx.body = pdfData;
    end();
  });


  doc.text(content, 50, 50);
  doc.end();

  await new Promise<void>((resolve) => {
    end = resolve;
  });
});

export default router;
