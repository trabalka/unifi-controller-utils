'use strict'

const UNIFY_URL = 'https://unifi_ip:8443'
const UNIFY_USER = 'unifi_username'
const UNIFY_PASS = 'secret_password'
const DEBUG = false

const Unifi = require('unifi-controller-utils')

function compareIP(a,b){
	a = String(a).split('.').map(x=>String(x).padStart(3,'0')).join('.')
	b = String(b).split('.').map(x=>String(x).padStart(3,'0')).join('.')
	return a.localeCompare(b)
}

async function run(){
	const unifi = new Unifi(UNIFY_URL, UNIFY_USER, UNIFY_PASS, DEBUG)
	try{
		let devices = await unifi.devices()
		devices = devices.sort((a,b)=>compareIP(a.ip,b.ip))
		console.log(devices.length,'ACCESS POINTS:')
		for(let dev of devices) console.log(`IP: ${dev.ip}   MAC: ${dev.mac}   NAME: ${dev.name}`)

		let stations = await unifi.stations()
		stations = stations.sort((a,b)=>compareIP(a.ip,b.ip))
		console.log('\n'+stations.length+' WIFI CLIENTS:')
		for(let sta of stations) console.log(`IP: ${sta.ip}   MAC: ${sta.mac}   USER ID: ${sta.user_id}   NAME: ${sta.name}`)

		// await unifi.renameStation(stations[0].mac, 'Some new name...')
	}catch(e){
		console.error('Error getting stations: ', String(e))
	}
}

run()
