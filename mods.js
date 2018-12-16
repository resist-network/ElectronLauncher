// Basic Includes
const path = require('path')
const fs = require('fs')
const execSync = require('child_process').execSync
const dir = require('node-dir')

// Our Locations

// START MAIN CONFIG

// Local Checkout of WA-Mod-Pack  MUST USE TRAILING SLASH, OPPOSITE OF BELOW!!!!!!! (I am super lazy)
const packFolder = '../mod-pack/'

// Remote Checkout of WA-Mod-Pack AKA "CDN" NO TRAILING SLASH!!!!!!!! (I am super lazy)

// GitHub CDN
//const downloadCDN = 'https://github.com/worldautomation/WA-Mod-Pack/raw/master'	

// Heroku CDN Using the Built-In cdn.js :D
const downloadCDN = 'https://github.com/resist-network/mod-pack/raw/master'	

// Th3Fanbus Sexy-Time Mirror on Google
//const downloadCDN = 'https://xx.x.x.x/WA-Mod-Pack'	

// Set the MC Version for Various Tasks
const mcVersion = '1.12.2'

// END MAIN CONFIG


// Get File Size Function
function getFilesizeInBytes(filename) {
	const stats = fs.statSync(filename)
	const fileSizeInBytes = stats.size
	return fileSizeInBytes
}

// Create our JSON
console.log('Scanning and creating JSON modlist file, please wait...')
var allJSON = ''
var thisJSON = ''
fs.createReadStream('app/assets/distribution-'+mcVersion+'.json').pipe(fs.createWriteStream('app/assets/distribution.json'));
dir.files(packFolder, function(err, files) {
	if (err) throw err
	files.forEach(function(file) {
		var fileName = path.basename(file)
		var pathSearch = file.toString()
		if(pathSearch.indexOf('logo.png') > 0 || 
			pathSearch.indexOf('.git/') > 0 || 
			pathSearch.indexOf('LICENSE') > 0 || 
			pathSearch.indexOf('push.bat') > 0 || 
			pathSearch.indexOf('README.md') > 0 || 
			pathSearch.indexOf('libraries/') > 0 || 
			pathSearch.indexOf('bin/') > 0 || 
			pathSearch.indexOf('pull.sh') > 0 || 
			pathSearch.indexOf('push.sh') > 0 || 
			pathSearch.indexOf('technic.sh') > 0 || 
			pathSearch.indexOf('package.json') > 0 || 
			pathSearch.indexOf('package-lock.json') > 0 || 
			pathSearch.indexOf('modpack.zip') > 0 || 
			pathSearch.indexOf('index.html') > 0 || 
			pathSearch.indexOf('cdn.js') > 0 || 
			pathSearch.indexOf('cdn.sh') > 0 || 
		   pathSearch.indexOf('node_modules/') > 0 || 
			pathSearch.indexOf('.gitignore') > 0 || 
			pathSearch.indexOf('bg.jpg') > 0 || 
			pathSearch.indexOf('pack.ico') > 0 || 
			pathSearch.indexOf('curse.html') > 0 || 			
			pathSearch.indexOf('pack.png') > 0) {
		} else {
			//console.log(file)
			//console.log(fileName)
			var fileName = fileName.split('.').slice(0, -1).join('.')
			var fileExtension = path.extname(file).slice(1)
			var target_name = fileName
			var target_type = 'File'
			var target_size = getFilesizeInBytes(file)
			// Requires md5sum on the Shell (Only Shell Dependent Aspect Currently for Speed)
			var md5 = execSync("md5sum \""+file+"\" | awk '{ print $1 }'")
			var target_md5 = md5.toString().replace(/\n|\r/g, "").replace('\\','')
			var target_url = downloadCDN+'/'+file.toString().replace(/..\/wa-mod-pack\//g,'')
			var target_path = file.replace('mods','mods-required').replace('mods-optional','mods').toString().replace(/..\/wa-mod-pack\//g,'/')
			console.log(target_path)		
			var target_id = target_size+'.'+target_size+':'+target_md5
			var thisJSON = '{\r\n\t\t\t"id": "'+target_id+'",\r\n\t\t\t"name": "'+target_name+'",\r\n\t\t\t"type": "'+target_type+'",\r\n\t\t\t"required": {\r\n\t\t\t\t"value": false,\r\n\t\t\t\t"def": true\r\n\t\t\t},\r\n\t\t\t"artifact": {\r\n\t\t\t\t"size": '+target_size+',\r\n\t\t\t\t"path": "'+target_path+'",\r\n\t\t\t\t"MD5": "'+target_md5+'",\r\n\t\t\t\t"url": "'+target_url+'"\r\n\t\t\t}\r\n\t\t},'
			allJSON += thisJSON.toString()
		}
	})
 	allJSON = allJSON.slice(0, -1).toString()
	fs.appendFile('app/assets/distribution.json', allJSON.replace(/\\/g, '/')+'\r\n\t\t\t]\r\n\t\t}\r\n\t]\r\n}', function (err) {
		if (err) throw err
		var fs = require('fs')
		fs.readFile('app/assets/distribution.json', 'utf8', function (err,data) {
			if (err) {
				return console.log(err)
			}
			var result = data.replace(/RESIST_CDN/g, downloadCDN)

			fs.writeFile('app/assets/distribution.json', result, 'utf8', function (err) {
				if (err) return console.log(err)
				console.log('Wrote new distribution.json!');
			})
		})
	})
})