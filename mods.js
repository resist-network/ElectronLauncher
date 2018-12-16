const path = require('path')
const fs = require('fs-extra')
const execSync = require('child_process').execSync
const dir = require('node-dir')
const packFolder = '../mod-pack/'
const downloadCDN = 'https://github.com/resist-network/mod-pack/raw/master'
const mcVersion = '1.12.2'
fs.removeSync('app/assets/distribution.json')
function getFilesizeInBytes(filename){
	const stats = fs.statSync(filename)
	const fileSizeInBytes = stats.size
	return fileSizeInBytes
}
console.log('Scanning and creating JSON modlist file, please wait...')
var allJSON = ''
var thisJSON = ''
fs.createReadStream('app/assets/distribution-'+mcVersion+'.json').pipe(fs.createWriteStream('app/assets/distribution.json'))
dir.files(packFolder,function(err, files){
	if (err) throw err
	files.forEach(function(file){
		var fileName = path.basename(file)
		var pathSearch = file.toString()
//		if(pathSearch.indexOf('config\\') > 0 || pathSearch.indexOf('mods-optional\\') > 0){
//			var fileName = fileName.split('.').slice(0, -1).join('.')
//			var fileExtension = path.extname(file).slice(1)
//			var target_name = fileName
//			var target_type = 'File'
//			var target_size = getFilesizeInBytes(file)
//			var md5 = execSync("md5sum \""+file+"\" | awk '{ print $1 }'")
//			var target_md5 = md5.toString().replace(/\n|\r/g, "").replace('\\','')
//			var target_url = downloadCDN+'/'+file.toString().replace(/..\\mod-pack\\/g,'')
//			var target_path = file.replace('mods','mods-required').replace('mods-optional','mods').toString().replace(/..\\mod-pack\\/g,'')
//			console.log(target_path)
//			var target_id = target_md5.substring(0,2)+'.'+target_md5.substring(30,32)+':'+target_md5.substring(2,30)
//			var thisJSON = '{\r\n\t\t\t"id": "'+target_id+'",\r\n\t\t\t"name": "'+target_name+'",\r\n\t\t\t"type": "'+target_type+'",\r\n\t\t\t"required": {\r\n\t\t\t\t"value": false,\r\n\t\t\t\t"def": true\r\n\t\t\t},\r\n\t\t\t"artifact": {\r\n\t\t\t\t"size": '+target_size+',\r\n\t\t\t\t"path": "'+target_path+'",\r\n\t\t\t\t"MD5": "'+target_md5+'",\r\n\t\t\t\t"url": "'+target_url+'"\r\n\t\t\t}\r\n\t\t},'
//			allJSON += thisJSON.toString()
//		}
		if(pathSearch.indexOf('README.md') > 0){
			var fileName = fileName.split('.').slice(0, -1).join('.')
			var fileExtension = path.extname(file).slice(1)
			var target_name = fileName
			var target_type = 'ForgeMod'
			var target_size = getFilesizeInBytes(file)
			var md5 = execSync("md5sum \""+file+"\" | awk '{ print $1 }'")
			var target_md5 = md5.toString().replace(/\n|\r/g, "").replace('\\','')
			var target_url = downloadCDN+'/'+file.toString().replace(/..\\mod-pack\\/g,'')
			var target_path = file.replace('mods','mods-required').replace('mods-optional','mods').toString().replace(/..\\mod-pack\\/g,'')
			console.log(target_path)
			var target_id = target_md5.substring(0,2)+'.'+target_md5.substring(30,32)+':'+target_md5.substring(2,30)
			var thisJSON = '{\r\n\t\t\t"id": "'+target_id+'",\r\n\t\t\t"name": "'+target_name+'",\r\n\t\t\t"type": "'+target_type+'",\r\n\t\t\t"required": {\r\n\t\t\t\t"value": false,\r\n\t\t\t\t"def": true\r\n\t\t\t},\r\n\t\t\t"artifact": {\r\n\t\t\t\t"size": '+target_size+',\r\n\t\t\t\t"path": "'+target_path+'",\r\n\t\t\t\t"MD5": "'+target_md5+'",\r\n\t\t\t\t"url": "'+target_url+'"\r\n\t\t\t}\r\n\t\t},'
			allJSON += thisJSON.toString()
		}
	})
 	allJSON = allJSON.slice(0, -1).toString()
	fs.appendFile('app/assets/distribution.json',allJSON.replace(/\\/g, '/')+'\r\n\t\t\t]\r\n\t\t}\r\n\t]\r\n}',function(err){
		if (err) throw err
		fs.readFile('app/assets/distribution.json','utf8',function(err,data){
			if(err){
				return console.log(err)
			}
			var result = data.replace(/RESIST_CDN/g,downloadCDN)
			fs.write('app/assets/distribution.json',result,'utf8',function(err){
				if (err){
					console.log('ERROR: '+err)
				}
			})
		})
	})
})
execSync('jsonlint -i app/assets/distribution.json')
