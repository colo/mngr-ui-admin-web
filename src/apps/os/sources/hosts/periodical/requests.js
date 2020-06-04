import * as Debug from 'debug'
const debug = Debug('apps:os:sources:hosts:periodical:requests')

const roundMilliseconds = function (timestamp) {
  let d = new Date(timestamp)
  d.setMilliseconds(0)

  return d.getTime()
}

const roundSeconds = function (timestamp) {
  timestamp = roundMilliseconds(timestamp)
  let d = new Date(timestamp)
  d.setSeconds(0)

  return d.getTime()
}

const roundMinutes = function (timestamp) {
  timestamp = roundSeconds(timestamp)
  let d = new Date(timestamp)
  d.setMinutes(0)

  return d.getTime()
}
const roundHours = function (timestamp) {
  timestamp = roundMinutes(timestamp)
  let d = new Date(timestamp)
  d.setHours(0)

  return d.getTime()
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = HOUR * 24
const WEEK = DAY * 7

let max_networkInterfaces = {}
let max_loadavg = {}

// let max_networkInterfaces_out = {}

const hosts_range_component = {
  params: function (_key, vm) {
    // debug('PERIODICAL host_range_component %o %o', _key, vm)

    // const MINUTE = 60000

    let source
    let key

    if (!_key) {
      // key = ['periodical.range', 'config.range', 'minute.range']
      key = ['periodical.range'] //, 'minute.range'
    }

    // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

    if (
      _key
    ) {
      switch (_key) {
        case 'periodical.range':
          source = [{
            params: { id: _key },
            path: 'all',
            range: 'posix ' + roundMilliseconds((Date.now() - (5 * SECOND))) + '-' + roundMilliseconds(Date.now()) + '/*',
            query: {
              'from': 'os',
              // 'register': 'changes',
              // 'format': 'tabular',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                'data',
                {'metadata': ['host', 'path']}
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              // 'filter': [
              //   "r.row('metadata')('path').ne('os.procs')",
              //   "this.r.row('metadata')('path').eq('os.cpus')" +
              //   ".or(this.r.row('metadata')('path').eq('os.memory')" +
              //   ".or(this.r.row('metadata')('path').eq('os.uptime')"+".or(this.r.row('metadata')('path').eq('os.loadavg')))"
              //
              // ]

            }
          }]
          break
      }
    }

    // debug('MyChart periodical KEY ', key, source)

    return { key, source }
  },
  callback: function (data, metadata, key, vm) {
    // debug('PERIODICAL HOSTS CALLBACK data %s %o', key, data)

    if (/periodical/.test(key) && (data.os || Object.getLength(data) > 0)) {
      let _data
      if (data.os) _data = data.os // comes from 'Range'
      else _data = data // comes from 'register'

      // debug('PERIODICAL HOSTS CALLBACK data %s %o', key, _data)
      let _hosts_data = {}
      Array.each(_data, function (row, index) {
        let host = row.metadata.host
        let path = row.metadata.path

        if (!_hosts_data[host]) _hosts_data[host] = {}
        if (!_hosts_data[host][path]) _hosts_data[host][path] = []

        _hosts_data[host][path].push(row.data)
      })

      // debug('PERIODICAL HOSTS CALLBACK data %s %o', key, _hosts_data)

      let hosts_data = {}
      Object.each(_hosts_data, function (data, host) {
        if (!hosts_data[host]) hosts_data[host] = {}

        if (!max_networkInterfaces[host]) max_networkInterfaces[host] = {in: 0, out: 0}
        if (!max_loadavg[host]) max_loadavg[host] = 0

        Object.each(data, function (values, path) {
          if (!hosts_data[host][path]) hosts_data[host][path] = {}

          if (/^os\.networkInterfaces.*/.test(path) || /^os\.blockdevices.*/.test(path) || path === 'os.cpus') { // derived
            let current = {}
            Object.each(values[0], function (val, prop) {
              // debug('PERIODICAL HOSTS CALLBACK data %s %o', prop, val, values[1][prop])
              if (prop !== 'cores') {
                current[prop] = val - values[1][prop]
              } else {
                current[prop] = val
              }
            })

            hosts_data[host][path] = current
            if (path === 'os.cpus') {
              let total = hosts_data[host][path].cores * 10000
              let used = total - hosts_data[host][path].idle
              let percentage = ((used * 100) / total).toFixed(1) * 1
              if (percentage >= 0) {
                hosts_data[host][path + '.percentage'] = percentage
              }
            } else if (
              /^os\.networkInterfaces\.eth.*\.bytes$/.test(path) ||
              /^os\.networkInterfaces\.eno.*\.bytes$/.test(path) ||
              /^os\.networkInterfaces\.enp.*\.bytes$/.test(path) ||
              /^os\.networkInterfaces\.vlan.*\.bytes$/.test(path) ||
              /^os\.networkInterfaces\.vnet.*\.bytes$/.test(path)
            ) {
              if (!hosts_data[host]['os.networkInterfaces.in']) hosts_data[host]['os.networkInterfaces.in'] = 0
              if (!hosts_data[host]['os.networkInterfaces.out']) hosts_data[host]['os.networkInterfaces.out'] = 0

              if (!hosts_data[host]['os.networkInterfaces.max.in']) hosts_data[host]['os.networkInterfaces.max.in'] = 0
              if (!hosts_data[host]['os.networkInterfaces.max.out']) hosts_data[host]['os.networkInterfaces.max.out'] = 0

              // // if (!max_networkInterfaces_out[host]) max_networkInterfaces_out[host] = 0
              //
              // max_networkInterfaces[host].in += hosts_data[host][path].recived * 1
              // max_networkInterfaces[host].out += hosts_data[host][path].transmited * 1

              // debug('PERIODICAL HOSTS CALLBACK networkInterfaces %s %o', key, hosts_data[host][path])

              //   // if (/^os\.networkInterfaces\.eth.*$/.test(path)) { // real ethX
              hosts_data[host]['os.networkInterfaces.in'] += hosts_data[host][path].recived * 1
              hosts_data[host]['os.networkInterfaces.out'] += hosts_data[host][path].transmited * 1
            //   // }
            }
          } else {
            hosts_data[host][path] = values[0]// most recent value
            if (path === 'os.memory') {
              let total = hosts_data[host][path].totalmem
              let used = total - hosts_data[host][path].freemem
              let percentage = ((used * 100) / total).toFixed(1) * 1
              if (percentage >= 0) {
                hosts_data[host][path + '.percentage'] = percentage
              }
            }

            if (path === 'os.loadavg') {
              if (!hosts_data[host]['os.loadavg.max']) hosts_data[host]['os.loadavg.max'] = 0
            }
          }

          // Array.each(values, function(val, index){
          //   if()
          // })
        })
      })

      Object.each(hosts_data, function (host_data, host) {
        // Object.each(host_data, function (path_data, path) {
        hosts_data[host]['os.networkInterfaces.max.in'] = (hosts_data[host]['os.networkInterfaces.in'] > max_networkInterfaces[host].in) ? hosts_data[host]['os.networkInterfaces.in'] : max_networkInterfaces[host].in
        hosts_data[host]['os.networkInterfaces.max.out'] = (hosts_data[host]['os.networkInterfaces.out'] > max_networkInterfaces[host].out) ? hosts_data[host]['os.networkInterfaces.out'] : max_networkInterfaces[host].out

        max_networkInterfaces[host] = {
          in: hosts_data[host]['os.networkInterfaces.max.in'],
          out: hosts_data[host]['os.networkInterfaces.max.out']
        }

        hosts_data[host]['os.loadavg.max'] = (hosts_data[host]['os.loadavg']['1_min'] > max_loadavg[host]) ? hosts_data[host]['os.loadavg']['1_min'] : max_loadavg[host]

        max_loadavg[host] = hosts_data[host]['os.loadavg.max']
        // })
      })

      debug('PERIODICAL HOSTS CALLBACK data %s %o %o', key, hosts_data) //, max_networkInterfaces_in, max_networkInterfaces_out
      vm.hosts_data = hosts_data
    }
  }

}

const once = [
  hosts_range_component
]

const periodical = [
  hosts_range_component
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests
