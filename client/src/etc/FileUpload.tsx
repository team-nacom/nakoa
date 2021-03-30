import axios from "axios";
import config from "./config";

async function upload(file: File){
/*    const host = 'https://file.io/'
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
*/

// Make the file uploadable to server, getting a URI as a response.

//    let form = new FormData();
//    form.append('file', file);
//    let response = await axios.post(`${config.apiAddress}/file`, form, { withCredentials: true });
//    return response.data.location as string;

    return 'https://tamref.github.io/images/myface.png';
}


export { upload };