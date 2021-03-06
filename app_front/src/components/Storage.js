// import { Web3Storage } from 'web3.storage/dist/bundle.esm.min';
// // import { Web3Storage } from 'web3.storage'

// export const Storage = (props) => {

//     function getAccessToken() {
//         // If you're just testing, you can paste in a token
//         // and uncomment the following line:
//         return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDIxNzlmZGI4MTdjNDkyRDRkZkJFMkFjZjFDZGM0MDgwRmNGNmNBNGUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTcxODk2MzYzODIsIm5hbWUiOiJXZWIzLlN0b3JhZ2UgdGVzdCJ9.ztYIwCcsUbrQ50qs3JTFydiezwYcGFh1lXXWJs4YV1M'

//         // In a real app, it's better to read an access token from an
//         // environement variable or other configuration that's kept outside of
//         // your code base. For this to work, you need to set the
//         // WEB3STORAGE_TOKEN environment variable before you run your code.
//         //   return process.env.WEB3STORAGE_TOKEN
//     }

//     function makeStorageClient() {
//         return new Web3Storage({ token: getAccessToken() })
//     }

//     const getFiles = async () => {
//         // async function getFiles() {
//         console.log("hoge");
//         const fileInput = await document.querySelector('input[type="file"]');
//         return (fileInput.files);
//     };

//     function makeFileObjects() {
//         // You can create File objects from a Blob of binary data
//         // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
//         // Here we're just storing a JSON object, but you can store images,
//         // audio, or whatever you want!
//         console.log("hoge")
//         const obj = { hello: 'world' }
//         const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })

//         const files = [
//             new File(['contents-of-file-1'], 'plain-utf8.txt'),
//             new File([blob], 'hello.json')
//             // ここを任意のファイル内容に置き換えるとうまく保存できそう
//         ]
//         console.log(files)
//         return files
//     }

//     const storeFiles = async (files) => {
//         // async function storeFiles(files) {
//         const client = makeStorageClient()
//         const cid = await client.put(files)
//         console.log('stored files with cid:', cid)
//         return cid
//     }

//     const storeWithProgress = async (files) => {
//         console.log(files)
//         // show the root cid as soon as it's ready
//         const onRootCidReady = cid => {
//             console.log('uploading files with cid:', cid)
//         }

//         // when each chunk is stored, update the percentage complete and display
//         // const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
//         // const totalSize = files.size
//         const totalSize = 15853205
//         console.log(files.size)
//         let uploaded = 0

//         const onStoredChunk = size => {
//             uploaded += size
//             const pct = totalSize / uploaded
//             console.log(`Uploading... ${pct.toFixed(2)}% complete`)
//         }

//         // makeStorageClient returns an authorized Web3.Storage client instance
//         const client = makeStorageClient()

//         // client.put will invoke our callbacks during the upload
//         // and return the root cid when the upload completes
//         return client.put(files, { onRootCidReady, onStoredChunk })
//     }

//     const retrieve = async (cid) => {
//         const client = makeStorageClient()
//         const res = await client.get(cid)
//         console.log(`Got a response! [${res.status}] ${res.statusText}`)
//         if (!res.ok) {
//             throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
//         }

//         // unpack File objects from the response
//         const files = await res.files()
//         for (const file of files) {
//             console.log(`${file.cid} -- ${file.path} -- ${file.size}`)
//         }
//     }

//     const store = async (e) => {
//         // storeWithProgress(e.target.files)
//         storeFiles(e.target.files)
//     }

//     return (
//         <div>
//             <input type='file' multiple onChange={store} />
//             <button className="waveButton"
//                 onClick={() => {
//                     storeFiles(makeFileObjects());
//                 }}>
//                 ファイルを選択
//             </button>
//             <button className="waveButton"
//                 onClick={() => {
//                     // storeFiles(getFiles);
//                     retrieve('bafybeiaw4nbmaikms3pefdzqpt5vcyohthjiwtbfxsquvfeuacgym44l7e');
//                 }}>
//                 提出
//             </button>
//         </div>
//     );
// };

// export default Storage;