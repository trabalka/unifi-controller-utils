'use strict'
const https = require('https')

module.exports = class Unifi {
	constructor(url, user, pass, debug){
		this.url = url
		this.user = user
		this.pass = pass
		this.debug = debug
	} // constructor

	async httpsPost(uri, params, set_cookie){
		const options = {
			method: 'POST',
			rejectUnauthorized: false, // to allow working without HTTPS certificate
		}
		if(set_cookie) {
			if(!this.cookie){
				// automatically log in if not yet logged
				await this.login()
			}
			options.headers = {cookie:this.cookie}
		}

		return new Promise(async (resolve,reject)=>{
			let data = ''
			const url = this.url+uri
			if(this.debug) console.log(`${url}`)
			const req = https.request(url, options, res=>{
				res.on('data', chunk=>data += chunk)
				res.on('end', ()=>{
					if(res.statusCode==200) resolve({headers: res.headers, data})
					else reject(res.statusCode)
				})
			}).on('error', err=>reject(err))
			if(params && typeof params=='object') params = JSON.stringify(params)
			if(params) req.write(params)
			req.end()
		})
	} // httpsPost

	async api(site, uri, params){
		site = site || 'default'
		const {data} = await this.httpsPost(`/api/s/${site}${uri}`, params, true)
		return JSON.parse(data).data
	} // api


	// LOGIN / LOGOUT ////////////////////////////////////////////////////////////////////////////

	async login(){
		const params = {
			username: this.user,
			password: this.pass,
		}
		const {headers} = await this.httpsPost('/api/login', params, false)
		this.cookie = headers['set-cookie']
		if(!this.cookie) throw new Error('Missing cookie')
		return null
	}

	async logout(){
		try{
			await this.httpsPost('/logout', true)
		}catch(e){}
		delete this.cookie
	}


	// MANAGEMENT OF DEVICES (ACCESS POINTS) /////////////////////////////////////////////////////

	async devices(site){
		return this.api(site, '/stat/device', {})
	}

	async restartDevice(mac, site){
		return this.api(site, '/cmd/devmgr', { cmd: 'restart', mac })
	}


	// MANAGEMENT OF STATIONS (WIFI CLIENTS) /////////////////////////////////////////////////////

	async stations(site){
		return this.api(site, '/stat/sta', {})
	}

	async disconnectStation(mac, site){
		return this.api(site, '/cmd/stamgr', { cmd: 'kick-sta', mac })
	}

	async blockStation(mac, site){
		return this.api(site, '/cmd/stamgr', { cmd: 'block-sta', mac })
	}

	async unblockStation(mac, site){
		return this.api(site, '/cmd/stamgr', { cmd: 'unblock-sta', mac })
	}

	async forgetStation(mac, site){
		return this.api(site, '/cmd/stamgr', { cmd: 'forget-sta', mac })
	}

	async renameStation(mac, name, site){
		if(!mac) throw("Missing MAC address")
		const stations = await this.stations(site)
		const station = stations.find(sta=>sta.mac==mac)
		if(!station) throw("Station not found")
		return this.api(site, '/upd/user/'+station.user_id, { name })
	}

} // class Unifi
