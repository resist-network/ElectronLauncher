const path = require('path')
const {AssetGuard} = require(path.join(__dirname, 'assets', 'js', 'assetguard.js'))
const ProcessBuilder = require(path.join(__dirname, 'assets', 'js', 'processbuilder.js'))
const ConfigManager = require(path.join(__dirname, 'assets', 'js', 'configmanager.js'))
const DiscordWrapper = require(path.join(__dirname, 'assets', 'js', 'discordwrapper.js'))
const Mojang = require(path.join(__dirname, 'assets', 'js', 'mojang.js'))
const AuthManager = require(path.join(__dirname, 'assets', 'js', 'authmanager.js'))

let mojangStatusListener

// Synchronous Listener
document.addEventListener('readystatechange', function(){
    if (document.readyState === 'interactive'){

        // Bind launch button
        document.getElementById('launch_button').addEventListener('click', function(e){
            console.log('Launching game..')
            testdownloads()
        })

        // TODO convert this to dropdown menu.
        // Bind selected server
        document.getElementById('server_selection').innerHTML = '\u2022 ' + AssetGuard.getServerById(ConfigManager.getGameDirectory(), ConfigManager.getSelectedServer()).name


        // Update Mojang Status Color
        const refreshMojangStatuses = async function(){
            console.log('Refreshing Mojang Statuses..')
            try {
                let status = 'grey'
                const statuses = await Mojang.status()
                greenCount = 0
                for(let i=0; i<statuses.length; i++){
                    if(statuses[i].status === 'yellow' && status !== 'red'){
                        status = 'yellow'
                        continue
                    } else if(statuses[i].status === 'red'){
                        status = 'red'
                        break
                    }
                    ++greenCount
                }
                if(greenCount == statuses.length){
                    status = 'green'
                }

                document.getElementById('mojang_status_icon').style.color = Mojang.statusToHex(status)

            } catch (err) {
                console.error('Unable to refresh Mojang service status..', err)
            }
        }

        refreshMojangStatuses()
        // Set refresh rate to once every 5 minutes.
        mojangStatusListener = setInterval(refreshMojangStatuses, 300000)

    }
}, false)

// Keep reference to AssetGuard object temporarily
let tracker;

testdownloads = async function(){

    if(ConfigManager.getSelectedAccount() == null){
        console.error('login first.')
        //in devtools AuthManager.addAccount(username, pass)
        return
    }

    const content = document.getElementById('launch_content')
    const details = document.getElementById('launch_details')
    const progress = document.getElementById('launch_progress')
    const progress_text = document.getElementById('launch_progress_label')
    const det_text = document.getElementById('launch_details_text')

    det_text.innerHTML = 'Please wait..'
    progress.setAttribute('max', '100')
    details.style.display = 'flex'
    content.style.display = 'none'

    tracker = new AssetGuard(ConfigManager.getGameDirectory(), ConfigManager.getJavaExecutable())

    det_text.innerHTML = 'Loading server information..'
    const serv = await tracker.validateDistribution(ConfigManager.getSelectedServer())
    progress.setAttribute('value', 20)
    progress_text.innerHTML = '20%'
    console.log('forge stuff done')

    det_text.innerHTML = 'Loading version information..'
    const versionData = await tracker.loadVersionData(serv.mc_version)
    progress.setAttribute('value', 40)
    progress_text.innerHTML = '40%'

    det_text.innerHTML = 'Validating asset integrity..'
    await tracker.validateAssets(versionData)
    progress.setAttribute('value', 60)
    progress_text.innerHTML = '60%'
    console.log('assets done')

    det_text.innerHTML = 'Validating library integrity..'
    await tracker.validateLibraries(versionData)
    progress.setAttribute('value', 80)
    progress_text.innerHTML = '80%'
    console.log('libs done')

    det_text.innerHTML = 'Validating miscellaneous file integrity..'
    await tracker.validateMiscellaneous(versionData)
    progress.setAttribute('value', 100)
    progress_text.innerHTML = '100%'
    console.log('files done')

    det_text.innerHTML = 'Downloading files..'
    tracker.on('totaldlprogress', function(data){
        progress.setAttribute('max', data.total)
        progress.setAttribute('value', data.acc)
        progress_text.innerHTML = parseInt((data.acc/data.total)*100) + '%'
    })

    tracker.on('dlcomplete', async function(){

        det_text.innerHTML = 'Preparing to launch..'
        const forgeData = await tracker.loadForgeData(serv.id)
        const authUser = await AuthManager.validateSelected()
        let pb = new ProcessBuilder(ConfigManager.getGameDirectory(), serv, versionData, forgeData, authUser)
        det_text.innerHTML = 'Launching game..'
        let proc;
        try{
            proc = pb.build()
            det_text.innerHTML = 'Done. Enjoy the server!'
            const tempListener = function(data){
                if(data.indexOf('[Client thread/INFO]: -- System Details --') > -1){
                    details.style.display = 'none'
                    content.style.display = 'inline-flex'
                    proc.stdout.removeListener('data', tempListener)
                }
            }
            proc.stdout.on('data', tempListener)
            // Init Discord Hook (Untested)
            const distro = AssetGuard.retrieveDistributionDataSync(ConfigManager.getGameDirectory)
            if(distro.discord != null && serv.discord != null){
                DiscordWrapper.initRPC(distro.discord, serv.discord)
                proc.on('close', (code, signal) => {
                    DiscordWrapper.shutdownRPC()
                })
            }
        } catch(err) {
            //det_text.innerHTML = 'Error: ' + err.message;
            det_text.innerHTML = 'Error: See log for details..';
            console.log(err)
            setTimeout(function(){
                details.style.display = 'none'
                content.style.display = 'inline-flex'
            }, 5000)
        }
        // Remove reference to tracker.
        tracker = null
    })
    tracker.processDlQueues()
}