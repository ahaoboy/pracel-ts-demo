console.log('download===')
const axios = require('axios')
const fs = require('fs-extra')
const path = require('path')

const {
  from, EMPTY
} = require('rxjs')
const {
  ignoreElements,take,
  catchError, concatMap,
  bufferCount,mergeMap
} = require('rxjs/operators')

axios.defaults.timeout = 6000;

const headers = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-language": "zh-CN,zh;q=0.9,zh-TW;q=0.8",
  // "upgrade-insecure-requests": "1",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"
}

async function download(url, path, dirPath) {
  if (fs.pathExistsSync(path))
    return true
  console.log('download', dirPath)
  try {
    let data = await axios({
      headers,
      url,
      responseType: 'arraybuffer'
    })
    // if (!fs.existsSync(dirPath))
    //   fs.mkdirSync(dirPath);
    fs.outputFileSync(path, data.data, 'binary')
    console.log('suc', dirPath)
    return true
  } catch (e) {
    console.log('e == >', e.message, url)
    return false
  } finally {
    console.log('end', dirPath)
  }
}

let dataPath = path.join(__dirname,'data.txt')
let s = fs.readFileSync(dataPath, 'utf8').trim().split('\n')
const root =path.join(__dirname,'../','images') 


from(s).pipe(
    take(100),
  bufferCount(10),
  concatMap(lines => {
    let list = lines.map(x => {
      let [name, url] = x.split(',')
      let fileName = name.replace(/\//g, '_')
      // console.log(name, url)
      let dirPath = path.join(root, fileName)
      let filePath = path.join(dirPath, fileName + '.jpg')
      return download(url, filePath, dirPath)
    })
    return from(Promise.all(list))
  }),
  // mergeAll(3),
  catchError(e => {
    console.log('err')
    return EMPTY
  })
).subscribe(
  x => {
    console.log('sub', x)
  }
)


