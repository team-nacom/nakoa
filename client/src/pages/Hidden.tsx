import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { FlatComponent } from 'components/naflat/component';
import jsPDF from 'jspdf';
import axios from 'axios';

const toBase64 = (blob: Blob) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
        const result = reader.result;

        if (typeof result !== 'string') {
            console.log(result);
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

function Hidden() {
    // hidden bubble test page

    const createPdf = async () => {
        const pdf = new jsPDF('p', 'pt', 'a4');
        const fontResponse = await fetch(process.env.PUBLIC_URL + '/SeoulNamsan.ttf');
        if (fontResponse.status !== 200) {
            throw new Error('Failed getting font');
        }
        const fontBlob = await fontResponse.blob();
        const fontFile = await toBase64(fontBlob);
        pdf.addFileToVFS('SeoulNamsan.ttf', fontFile);
        pdf.addFont('SeoulNamsan.ttf', 'SeoulNamsan', 'normal');
        pdf.setFont('SeoulNamsan');
        const pdfElement = document.getElementById('pdf-wrapper');
        if (!pdfElement) {
            throw new Error('Element to export does not exists');
        }
        await pdf.html(pdfElement, {
            margin: 10,
            width: 575,
            windowWidth: 900,
            autoPaging: true
        });

        pdf.save('document.pdf');
    }

    return (
        <>
            <Header />
            <div id='pdf-wrapper' style={{ fontFamily: 'Montserrat, SeoulNamsan' }}>
                <FlatComponent editMode
                    cellId='c0'
                    initialFlat={{
                        'c0': {
                            type: 'root',
                            id: 'c0',
                            childIds: ['c1', 'c2', 'c3'],
                            value: '똑떨'
                        },
                        'c1': {
                            type: 'text',
                            id: 'c1',
                            parentId: 'c0',
                            childIds: [],
                            value:
                                `# 제목

으아아아앙

## 부제목

$$
x^2 + y^2 = z^2
$$
수식입력도 좀 해보고`
                        },
                        'c2': {
                            type: 'text',
                            id: 'c2',
                            parentId: 'c0',
                            childIds: ['c22', 'c23'],
                            value:
                                `# 또다른 제목

꺄르르르륵

## 또다른 부제목

> 아아, 이것은 인용구라는 것이다.`
                        },
                        'c3': {
                            type: 'text',
                            id: 'c3',
                            parentId: 'c0',
                            childIds: [],
                            value:
                                `# 세번째 제목

그롸롸롸롸

@@@expand[스포일러]
스표일려
@@@

나컴-exclusive한 것도 표시는 잘 되긴 하는데.`
                        },
                        'c22': {
                            type: 'code',
                            id: 'c22',
                            parentId: 'c2',
                            childIds: [],
                            value: `console.log('Hello, World!')`
                        },
                        'c23': {
                            type: 'math',
                            id: 'c23',
                            parentId: 'c2',
                            childIds: [],
                            value: `p_\\mu p^\\mu = -m^2 \\quad (-+++)`
                        }
                    }}
                />
            </div>

            <button onClick={createPdf}>
                Create PDF File
            </button>

            <Footer />
        </>
    );
}

export default Hidden;