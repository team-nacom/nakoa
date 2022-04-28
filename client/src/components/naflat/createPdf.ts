import jsPDF from 'jspdf';

// Actually, other fonts in node_modules/katex/dist/fonts
// may be needed on another functions.

const toBase64 = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = () => {
    const result = reader.result;

    if (typeof result !== 'string') {
      throw new Error('Font file reader returned non-string');
    }

    const prefix = 'data:font/ttf;base64,';
    if (!result.startsWith(prefix)) {
      throw new Error('Font file reader returned malformed string');
    }

    resolve(result.slice(prefix.length));
  }
  reader.onerror = error => reject(error);
});


async function createPdf(element: HTMLElement, fileName: string) {
  const pdf = new jsPDF('p', 'pt', 'a4');

  const loadFont = async (pdf: jsPDF, fontFileName: string, fontName: string, fontStyle: string = 'normal', fontWeight?: number) => {
    const fontResponse = await fetch(process.env.PUBLIC_URL + '/fonts/' + fontFileName);
    if (fontResponse.status !== 200) {
      throw new Error('Failed getting font');
    }

    const fontBlob = await fontResponse.blob();
    const fontFile = await toBase64(fontBlob);
    pdf.addFileToVFS(fontFileName, fontFile);
    pdf.addFont(fontFileName, fontName, fontStyle, fontWeight);
    pdf.setFont(fontName);
  }

  await Promise.all([
    loadFont(pdf, 'Pretendard.ttf', 'Pretendard', 'normal'),
    loadFont(pdf, 'KaTeX_AMS-Regular.ttf', 'KaTeX_AMS', 'normal', 400),
    loadFont(pdf, 'KaTeX_Caligraphic-Regular.ttf', 'KaTeX_Caligraphic', 'normal', 400),
    loadFont(pdf, 'KaTeX_Caligraphic-Bold.ttf', 'KaTeX_Caligraphic', 'normal', 700),
    loadFont(pdf, 'KaTeX_Fraktur-Regular.ttf', 'KaTeX_Fraktur', 'normal', 400),
    loadFont(pdf, 'KaTeX_Fraktur-Bold.ttf', 'KaTeX_Fraktur', 'normal', 700),
    loadFont(pdf, 'KaTeX_Main-Regular.ttf', 'KaTeX_Main', 'normal', 400),
    loadFont(pdf, 'KaTeX_Main-Bold.ttf', 'KaTeX_Main', 'normal', 700),
    loadFont(pdf, 'KaTeX_Main-Italic.ttf', 'KaTeX_Main', 'italic', 400),
    loadFont(pdf, 'KaTeX_Main-BoldItalic.ttf', 'KaTeX_Main', 'italic', 700),
    loadFont(pdf, 'KaTeX_Math-Italic.ttf', 'KaTeX_Math', 'italic', 400),
    loadFont(pdf, 'KaTeX_Math-BoldItalic.ttf', 'KaTeX_Math', 'italic', 700),
    loadFont(pdf, 'KaTeX_SansSerif-Regular.ttf', 'KaTeX_SansSerif', 'normal', 400),
    loadFont(pdf, 'KaTeX_SansSerif-Bold.ttf', 'KaTeX_SansSerif', 'normal', 700),
    loadFont(pdf, 'KaTeX_SansSerif-Italic.ttf', 'KaTeX_SansSerif', 'italic', 400),
    loadFont(pdf, 'KaTeX_Script-Regular.ttf', 'KaTeX_Script', 'normal', 400),
    loadFont(pdf, 'KaTeX_Size1-Regular.ttf', 'KaTeX_Size1', 'normal', 400),
    loadFont(pdf, 'KaTeX_Size2-Regular.ttf', 'KaTeX_Size2', 'normal', 400),
    loadFont(pdf, 'KaTeX_Size3-Regular.ttf', 'KaTeX_Size3', 'normal', 400),
    loadFont(pdf, 'KaTeX_Size4-Regular.ttf', 'KaTeX_Size4', 'normal', 400),
    loadFont(pdf, 'KaTeX_Typewriter-Regular.ttf', 'KaTeX_Typewriter', 'normal', 400),
    // You might need to load more fonts in public/fonts ...
    // Uploading the fonts in CDN rather than the public folder of the project may be helpful
  ])

  await pdf.html(element, {
    margin: 10,
    width: 575,
    windowWidth: 900,
    autoPaging: true
  });

  pdf.save(fileName);
}

export default createPdf;