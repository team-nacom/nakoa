
async function upload(file: File){
    const host = 'https://file.io/'
    const fileUrlResolve = (key: string) => `https://www.file.io/download/${ key }`

    var data = new FormData();
    data.append('file',file);
    // data.append('maxDownloads','1');

    // console.log(data);

    const res = await fetch(host,{
        method: 'POST',
        body: data
    });

    var jres = await res.json();

    // console.log(jres);

    return fileUrlResolve(jres.key + '');
}


export { upload };