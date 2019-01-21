const path = require('path'),
fs = require('fs'),
execSync = require('child_process').execSync,
dir = require('node-dir'),
md5File = require('md5-file'),
downloadCDN = 'https://casper.resist.network'
function getFilesizeInBytes(filename) {
	const stats = fs.statSync(filename)
	const fileSizeInBytes = stats.size
	return fileSizeInBytes
}
console.log('Scanning and creating JSON modlist file, please wait...')
var allJSONrequired = ''
var thisJSONrequired = '\t\t\t\t'
var allJSONoptional = ''
var thisJSONoptional = '\t\t\t\t'
fs.createReadStream(__dirname+'/app/assets/distribution-template.json').pipe(fs.createWriteStream(__dirname+'/app/assets/distribution.json'))
dir.files('../resist-mod-pack', function(err, files) {
	files.forEach(function(file) {
		var modFile = path.basename(file)
		var pathSearch = file.toString()
		//For now we do the libraries manually, but will eventually add them so they don't continually download due to hash mismatch!
		 if(pathSearch.indexOf('\\liteconfig\\') > 0) {
			var fileName = modFile.split('.').slice(0, -1).join('.')
			var target_type = 'File'
			var target_size = getFilesizeInBytes(file)
			var target_md5 = md5File.sync(file)
			var target_url = downloadCDN+file.toString().replace(/\\/g, '/').replace(/ /g,"%20").replace(/resist-mod-pack\//g,'')
			console.log(fileName+' >> '+target_md5)
			var target_id = fileName
			var target_name = fileName
			console.log(target_url)
			var ext = path.extname(file)
			var target_path = file.toString().replace(/\\/g, '/').replace('/config','').replace(/resist-mod-pack\//g,'')
			var thisJSONoptional = '{\r\n\t\t\t"id": "'+target_id+'",\r\n\t\t\t"name": "'+target_name+'",\r\n\t\t\t"type": "'+target_type+'",\r\n\t\t\t\t\t"required": {\r\n\t\t\t\t\t"value": false,\r\n\t\t\t\t\t"def": true\r\n\t\t\t\t},\r\n\t\t\t"artifact": {\r\n\t\t\t\t\t\t"size": '+target_size+',\r\n\t\t\t\t\t"path": "'+target_path+'",\r\n\t\t\t\t\t"MD5": "'+target_md5+'",\r\n\t\t\t\t\t"url": "'+target_url+'"\r\n\t\t\t\t\t}\r\n\t\t\t},'
			allJSONoptional += thisJSONoptional.toString()
		} else if(pathSearch.indexOf('\\mods-optional\\') > 0) {
			var fileName = modFile.split('.').slice(0, -1).join('.')
			var target_type = 'File'
			var target_size = getFilesizeInBytes(file)
			var ext = path.extname(file)
			var target_md5 = md5File.sync(file)
			var target_url = downloadCDN+file.toString().replace(/\\/g, '/').replace(/ /g,"%20").replace(/resist-mod-pack\//g,'')
			console.log(fileName+' >> '+target_md5)
			var target_id = 'net.resist:mod:'+target_md5.slice(0, -28)
			var target_name =fileName
			console.log(target_url)
			var target_path = 'mods-optional/'+fileName+ext
			var thisJSONoptional = '{\r\n\t\t\t\t\t"id": "'+target_id+'",\r\n\t\t\t\t\t"name": "'+target_name+'",\r\n\t\t\t\t"type": "'+target_type+'",\r\n\t\t\t\t"required": {\r\n\t\t\t\t\t"value": false,\r\n\t\t\t\t\t"def": true\r\n\t\t\t\t},\r\n\t\t\t\t\t"artifact": {\r\n\t\t\t\t"size": '+target_size+',\r\n\t\t\t\t\t"path": "'+target_path+'",\r\n\t\t\t\t\t"MD5": "'+target_md5+'",\r\n\t\t\t\t\t"url": "'+target_url+'"\r\n\t\t\t\t}\r\n\t\t\t},'
			allJSONoptional += thisJSONoptional.toString()
		} else if(pathSearch.indexOf('\\mods\\') > 0) {
			var fileName = modFile.split('.').slice(0, -1).join('.')
			var target_type = 'ForgeMod'
			var target_size = getFilesizeInBytes(file)
			var target_md5 = md5File.sync(file)
			var target_url = downloadCDN+file.toString().replace(/\\/g, '/').replace(/ /g,"%20").replace(/resist-mod-pack\//g,'')
			console.log(fileName+' >> '+target_md5)
			var target_id = 'net.resist:mod:'+target_md5.slice(0, -28)
			var target_name = fileName
			console.log(target_url)
			var ext = path.extname(file)
			var target_path = file.toString().replace(/\\/g, '/').replace(/mods\//g,'modstore\/').replace(/resist-mod-pack\//g,'')
			var thisJSONoptional = '{\r\n\t\t\t\t"id": "'+target_id+'",\r\n\t\t\t\t"name": "'+target_name+'",\r\n\t\t"type": "'+target_type+'",\r\n\t\t\t"required": {\r\n\t\t\t\t\t"value": false,\r\n\t\t\t\t\t"def": true\r\n\t\t\t\t},\r\n\t\t\t\t\t"artifact": {\r\n\t\t\t\t"size": '+target_size+',\r\n\t\t\t\t\t"path": "'+target_path+'",\r\n\t\t\t\t\t"MD5": "'+target_md5+'",\r\n\t\t\t\t\t"url": "'+target_url+'"\r\n\t\t\t\t}\r\n\t\t\t},'
			allJSONoptional += thisJSONoptional.toString()
		}  else if(pathSearch.indexOf('\\scripts\\') > 0) {
			var fileName = modFile.split('.').slice(0, -1).join('.')
			var target_type = 'File'
			var target_size = getFilesizeInBytes(file)
			var target_md5 = md5File.sync(file)
			var target_url = downloadCDN+file.toString().replace(/\\/g, '/').replace(/ /g,"%20").replace(/resist-mod-pack\//g,'')
			console.log(fileName+' >> '+target_md5)
			var target_id = fileName
			var target_name = fileName
			console.log(target_url)
			var ext = path.extname(file)
			var target_path = file.toString().replace(/\\/g, '/').replace(/mods\//g,'modstore\/').replace(/resist-mod-pack\//g,'')
			var thisJSONoptional = '{\r\n\t\t\t\t"id": "'+target_id+'",\r\n\t\t\t\t"name": "'+target_name+'",\r\n\t\t"type": "'+target_type+'",\r\n\t\t\t"required": {\r\n\t\t\t\t\t"value": false,\r\n\t\t\t\t\t"def": true\r\n\t\t\t\t},\r\n\t\t\t\t\t"artifact": {\r\n\t\t\t\t"size": '+target_size+',\r\n\t\t\t\t\t"path": "'+target_path+'",\r\n\t\t\t\t\t"MD5": "'+target_md5+'",\r\n\t\t\t\t\t"url": "'+target_url+'"\r\n\t\t\t\t}\r\n\t\t\t},'
			allJSONoptional += thisJSONoptional.toString()
		} else if(pathSearch.indexOf('\\config\\') > 0) {
			var fileName = modFile.split('.').slice(0, -1).join('.')
			var target_type = 'File'
			var target_size = getFilesizeInBytes(file)
			var target_md5 = md5File.sync(file)
			var target_url = downloadCDN+file.toString().replace(/\\/g, '/').replace(/ /g,"%20").replace(/resist-mod-pack\//g,'')
			console.log(fileName+' >> '+target_md5)
			var target_id = fileName
			var target_name = fileName
			console.log(target_url)
			var ext = path.extname(file)
			var target_path = file.toString().replace(/\\/g, '/').replace(/resist-mod-pack\//g,'')
			var thisJSONoptional = '{\r\n\t\t\t\t\t"id": "'+target_id+'",\r\n\t\t\t\t\t"name": "'+target_name+'",\r\n\t\t\t\t\t"type": "'+target_type+'",\r\n\t\t\t\t\t"required": {\r\n\t\t\t\t\t"value": false,\r\n\t\t\t\t\t"def": true\r\n\t\t\t\t},\r\n\t\t\t\t\t"artifact": {\r\n\t\t\t\t\t"size": '+target_size+',\r\n\t\t\t\t\t"path": "'+target_path+'",\r\n\t\t\t\t\t"MD5": "'+target_md5+'",\r\n\t\t\t\t\t"url": "'+target_url+'"\r\n\t\t\t\t}\r\n\t\t\t},'
			allJSONoptional += thisJSONoptional.toString()
		} else if(pathSearch.indexOf('\\resources\\') > 0) {
			var fileName = modFile.split('.').slice(0, -1).join('.')
			var target_type = 'File'
			var target_size = getFilesizeInBytes(file)
			var target_md5 = md5File.sync(file)
			var target_url = downloadCDN+file.toString().replace(/\\/g, '/').replace(/ /g,"%20").replace(/resist-mod-pack\//g,'')
			console.log(fileName+' >> '+target_md5)
			var target_id = fileName
			var target_name = fileName
			console.log(target_url)
			var ext = path.extname(file)
			var target_path = file.toString().replace(/\\/g, '/').replace('/config','').replace(/resist-mod-pack\//g,'')
			var thisJSONoptional = '{\r\n\t\t\t\t"id": "'+target_id+'",\r\n\t\t\t\t"name": "'+target_name+'",\r\n\t\t\t\t\t"type": "'+target_type+'",\r\n\t\t\t\t\t"required": {\r\n\t\t\t\t\t"value": false,\r\n\t\t\t\t\t"def": true\r\n\t\t\t\t},\r\n\t\t\t"artifact": {\r\n\t\t\t\t\t\t"size": '+target_size+',\r\n\t\t\t\t\t"path": "'+target_path+'",\r\n\t\t\t\t\t"MD5": "'+target_md5+'",\r\n\t\t\t\t\t"url": "'+target_url+'"\r\n\t\t\t\t\t}\r\n\t\t\t},'
			allJSONoptional += thisJSONoptional.toString()
		}
	})
	allJSONoptional = allJSONoptional.slice(0, -1).toString()
	allJSONrequired = allJSONrequired.slice(0, -1).toString()
	if(allJSONrequired == ''){
	allJSON = allJSONoptional+']\r\n\t\t}]\r\n}'
	} else {
		if(allJSONoptional == ''){
			allJSON = allJSONrequired+']\r\n\t\t}]\r\n}'
		} else {
			allJSON = allJSONrequired+','+allJSONoptional+']\r\n\t\t}]\r\n}'
		}
	}
	fs.appendFile(__dirname+'/app/assets/distribution.json', allJSON.replace(/\\/g, '/').replace(/\.\./g,'')+'', function (err) {
		if (err) throw err
		var fs = require('fs')
		fs.readFile(__dirname+'/app/assets/distribution.json', 'utf8', function (err,data) {
			if (err) {
				return console.log(err)
			}
			var result = data.replace(/RESIST_CDN/g, ''+downloadCDN+'')

			fs.writeFile(__dirname+'/app/assets/distribution.json', result, 'utf8', function (err) {
				if (err) return console.log(err)
				console.log('Wrote distribution.json to launcher repository!');
			})
		})
	})	
})
