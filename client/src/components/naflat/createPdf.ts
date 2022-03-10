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

  const loadFont = async (pdf: jsPDF, fontPath: string, fontName: string, fontStyle: string = 'normal', fontWeight?: number) => {
    const fontResponse = await fetch(process.env.PUBLIC_URL + '/fonts/' + fontPath);
    if (fontResponse.status !== 200) {
      throw new Error('Failed getting font');
    }

    const fontBlob = await fontResponse.blob();
    const fontFile = await toBase64(fontBlob);
    pdf.addFileToVFS(fontPath, fontFile);
    pdf.addFont(fontPath, fontName, fontStyle, fontWeight);
    pdf.setFont(fontName);
  }

  await Promise.all([
    loadFont(pdf, 'SeoulNamsan.ttf', 'SeoulNamsan', 'normal'),
    loadFont(pdf, 'KaTeX_Main-Regular.ttf', 'KaTeX_Main', 'normal', 400),
    loadFont(pdf, 'KaTeX_Math-Italic.ttf', 'KaTeX_Math', 'italic', 400),
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