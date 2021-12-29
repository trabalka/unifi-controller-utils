# unifi-controller-utils
Management of Ubiquity UniFi Controller for WiFi Access points.

# Installation
```javascript
npm install unifi-controller-utils
```

# Usage
```javascript
'use strict'
const Unifi = require('unifi-controller-utils')
async function run(){
	const unifi = new Unifi(UNIFY_URL, UNIFY_USER, UNIFY_PASS, DEBUG)
	try{
    // list devices (Access Points)
		let devices = await unifi.devices()
		console.log(devices.length,'ACCESS POINTS:')
		for(let dev of devices) console.log(`IP: ${dev.ip}   MAC: ${dev.mac}   NAME: ${dev.name}`)

    // list stations (WiFi Clients)
		let stations = await unifi.stations()
		console.log('\n'+stations.length+' WIFI CLIENTS:')
		for(let sta of stations) console.log(`IP: ${sta.ip}   MAC: ${sta.mac}   USER ID: ${sta.user_id}   NAME: ${sta.name}`)

    // change station name
		await unifi.renameStation(stations[0].mac, 'Some new name...')

    // disconnect station
		await unifi.disconnectStation(stations[0].mac, 'Some new name...')
  }catch(e){
		console.error('Error getting stations: ', String(e))
	}
}

run()
```

# API
`require('unifi-controller-utils')`

### **constructor**(<_string_>url, <_string_>username, <_string_>password, <_boolean_>debug)

Creates new instance of Unifi controller class.

  * **url** - _string_ - URL to access the Unifi server.

  * **username** - _string_ - Username for authentication.

  * **password** - _string_ - Password for authentication.

  * **debug** - _boolean_ - If set to true, will console.log() network requests.

### **devices**() - _(Promise)_

Returns list of Unifi devices (i.e. Access Points). Each devices is an object with many useful properties,
see excerption on the sample below:

```javascript
{
  "_id":       "69218764a29238721439bcde",
  "device_id": "69218764a29238721439bcde",
  "ip": "10.0.0.2",
  "mac": "ab:cd:12:34:56:78",
  "model": "U7NHD",
  "type": "uap",
  "version": "5.60.12.34567",
  "site_id": "28c64932876b9298c6749864",
  "gateway_mac": "a2:12:34:56:78:b3",
  "internet": true,
  "connected_at": 1641945697,
  "name": "Nano AP 3rd floor",
  "last_seen": 1642045697,
  "uptime": 3891,
  "system-stats": {
    "cpu": "1.9",
    "mem": "42.2",
    "uptime": "3891"
  },
  "startup_timestamp": 1641845697,
  "satisfaction": 99,
  "bytes-d": 16022,
  "tx_bytes-d": 10310,
  "rx_bytes-d": 5712,
  "bytes-r": 1232,
  "tx_bytes": 55323801004,
  "rx_bytes": 4037952922,
  "bytes": 59361753926,
  "num_sta": 3,
  "user-num_sta": 3,
  "user-wlan-num_sta": 3,
  "guest-num_sta": 0,
  "guest-wlan-num_sta": 0
}
```

### **stations**() - _(Promise)_

Returns list of Unifi stations (i.e. WiFi clients). Each station is an object with many useful properties,
see excerption on the sample below:

```javascript
{
  "_id": "61c398c7021b374027a96210",
  "user_id": "61c398c7021b374027a96210",
  "site_id": "28c64932876b9298c6749864",
  "oui": "Manufacturer, ltd.",
  "mac": "18:55:e3:5b:6d:85",
  "ip": "10.0.0.33",
  "hostname": "My-Computer",
  "hostname_source": "uap",
  "is_guest": false,
  "is_wired": false,
  "assoc_time": 1640761576,
  "latest_assoc_time": 1640775604,
  "first_seen": 1640635552,
  "last_seen": 1640779989,
  "usergroup_id": "",
  "disconnect_timestamp": 1640725472,
  "_uptime_by_uap": 4386,
  "_last_seen_by_uap": 1640779989,
  "_is_guest_by_uap": false,
  "ap_mac": "ab:cd:12:34:56:78",
  "channel": 44,
  "radio": "na",
  "radio_name": "rai0",
  "essid": "myunifi",
  "bssid": "1e:b0:cd:34:56:11",
  "powersave_enabled": true,
  "is_11r": false,
  "ccq": 0,
  "rssi": 20,
  "noise": -96,
  "signal": -76,
  "tx_rate": 121000,
  "rx_rate": 240000,
  "tx_power": 0,
  "idletime": 15,
  "dhcpend_time": 120,
  "satisfaction": 98,
  "anomalies": 0,
  "tx_mcs": 6,
  "vlan": 0,
  "radio_proto": "ac",
  "uptime": 18413,
  "tx_bytes": 289784002,
  "rx_bytes": 17553222,
  "tx_packets": 271541,
  "rx_packets": 91249,
  "bytes-r": 0,
  "tx_bytes-r": 0,
  "rx_bytes-r": 0,
  "tx_retries": 29233,
  "wifi_tx_attempts": 212219,
  "authorized": true,
  "qos_policy_applied": true,
  "roam_count": 4
}
```

### **restartDevice**(mac, site) - _(Promise)_

Restarts Access Point with given MAC address.

  * **mac** - _string_ - MAC address of Unifi device (Access Point)

  * **site** - _string_ - Optional name of Unifi site. Defaults to "default"

### **disconnectStation**(mac, site) - _(Promise)_

Disconnects wifi client from Unifi network.

  * **mac** - _string_ - MAC address of WiFi client

  * **site** - _string_ - Optional name of Unifi site. Defaults to "default"

### **blockStation**(mac, site) - _(Promise)_

Blocks wifi client from accessing Unifi network.

  * **mac** - _string_ - MAC address of WiFi client

  * **site** - _string_ - Optional name of Unifi site. Defaults to "default"

### **unblockStation**(mac, site) - _(Promise)_

Un-blocks wifi client from accessing Unifi network.

  * **mac** - _string_ - MAC address of WiFi client

  * **site** - _string_ - Optional name of Unifi site. Defaults to "default"

### **forgetStation**(mac, site) - _(Promise)_

Forgets wifi client from Unifi network.

  * **mac** - _string_ - MAC address of WiFi client

  * **site** - _string_ - Optional name of Unifi site. Defaults to "default"

### **renameStation**(mac, name, site) - _(Promise)_

Sets name for wifi client within Unifi network.

  * **mac** - _string_ - MAC address of WiFi client

  * **name** - _string_ - Name for the WiFi client

  * **site** - _string_ - Optional name of Unifi site. Defaults to "default"

