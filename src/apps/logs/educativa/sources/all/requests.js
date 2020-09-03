import * as Debug from 'debug'
const debug = Debug('apps:logs:educativa:sources:all:requests')

// import END from '../../../etc/range'
const end = require('../../../etc/end')

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

const roundMilliseconds = function (timestamp) {
  let d = new Date(timestamp)
  d.setMilliseconds(0)

  return d.getTime()
}

const logs_paths = {
  params: function (_key, vm) {
    let source
    let key

    if (!_key) {
      key = ['hosts.range']
    }

    debug('PERIODICAL %o %o', _key, vm)
    // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

    if (
      _key
    ) {
      const END = vm.end()

      /**
      * production
      **/
      // const END = Date.now()

      // const START = END - (15 * SECOND) // HOUR
      const START = (END - (20 * SECOND) >= 0) ? END - (20 * SECOND) : 0

      source = [{
        params: { id: _key },
        // range: 'posix ' + (Date.now() - HOUR) + '-' + Date.now() + '/*', //prod
        range: 'posix ' + START + '-' + END + '/*',

        path: 'all',
        query: {
          'from': 'logs',
          // 'index': 'domain',
          'index': false,
          'q': [
            // { 'metadata': ['host', 'path', 'domain'] } // 'path' ain't needed for first view (categories)
            'metadata'
          ],
          filter: [
            "this.r.row('metadata')('path').eq('logs.educativa')"
          ],
          'transformation': [
            { 'orderBy': { 'index': 'r.desc(timestamp)' } }
            // 'slice:0:9'
          ],
          // 'aggregation': 'distinct'
        }
      }]
    }

    // debug('MyChart periodical KEY ', key, source)

    // if (!vm.web) {
    //
    // }

    return { key, source }
  },
  callback: function (data, meta, key, vm) {
    data = JSON.parse(JSON.stringify(data))
    debug('CALLBACK', data)
    // let _hosts_paths = {}
    // let _paths = []

    let logs = []
    let timestamps = {}
    let paths = []

    if (data && data.logs && data.logs.length > 0) {
      // debug('CALLBACK', data)
      let timestamp = data.logs[0].metadata.timestamp // comes sorted by timestamp in desc order, so first item has the biggest timestamp
      let smallest_start = roundMilliseconds(timestamp - (15 * SECOND))

      Array.each(data.logs, function (row) {
        // let timestamp = roundMilliseconds(row.metadata._timestamp)
        let timestamp = roundMilliseconds(row.metadata.timestamp)
        if (timestamp >= smallest_start) {
          logs.push(row.metadata)

          let path = row.metadata.path

          if (!timestamps[timestamp]) timestamps[timestamp] = {}
          if (!timestamps[timestamp][path]) timestamps[timestamp][path] = 0
          timestamps[timestamp][path] += 1

          if (!paths.contains(path)) paths.push(path)
        }
      })
      /**
      * with 'index'
      **/
      // Array.each(data.logs, function (group) {
      //   // debug('GROUP', group)
      //   Array.each(group, function (row) {
      //     logs.push(row.metadata)
      //     let timestamp = roundMilliseconds(row.metadata._timestamp)
      //     let timestamp = roundMilliseconds(row.metadata.timestamp)
      //     let path = row.metadata.path
      //
      //     if (!timestamps[timestamp]) timestamps[timestamp] = {}
      //     if (!timestamps[timestamp][path]) timestamps[timestamp][path] = 0
      //     timestamps[timestamp][path] += 1
      //
      //     if (!paths.contains(path)) paths.push(path)
      //   })
      // })

      let by_type = []
      Object.each(timestamps, function (data, ts) {
        let row = [ts * 1]

        for (let i = 0; i < paths.length; i++) {
          let path = paths[i]
          if (!data[path]) {
            row.push(0)
          } else {
            row.push(data[path])
          }
        }

        by_type.push(row)
      })

      by_type.sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })

      debug('TIMESTAMPS %o', timestamps, paths, by_type, vm.stat.data)

      logs.sort(function (a, b) { return (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0) })

      // if (vm.stat.data.length > 0) {
      //   by_type = vm.stat.data[0].append(by_type)
      //   by_type.sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
      // }

      vm.$set(vm.stat, 'data', [by_type])
      vm.chart = Object.merge(vm.chart, {
        options: {
          labels: ['Timestamp'].combine(paths)
        }
      })

      if (logs.length > 0) {
        vm.logs = logs
        vm.loading = false
      }

    //   vm.paths = _paths
    }

    // debug('CATEGORIES callback %o %o', _hosts_paths, _categories)
  }
  // params: {
  //   path: 'all',
  //   query: {
  //     'from': 'os',
  //     'index': 'host',
  //     'q': [
  //       { 'config': 'graph' },
  //       { 'metadata': ['host'] } // 'path' ain't needed for first view (categories)
  //     ],
  //     'aggregation': 'distinct'
  //   }
  // },
  // callback: function (data, meta, key, vm) {
  //   debug('CALLBACK', data)
  //   // let _hosts_paths = {}
  //   // let _paths = []
  //
  //   let logs = []
  //   if (data && data.logs && data.logs.length > 0) {
  //     // debug('CALLBACK', data)
  //
  //     Array.each(data.logs, function (group) {
  //       debug('GROUP', group)
  //       Array.each(group, function (row) {
  //         logs.push(row.metadata)
  //         //       let host = plugin.metadata.host
  //         //       // debug('All callback', plugin)
  //         //       let path = (plugin.metadata.path) ? plugin.metadata.path : undefined
  //         //
  //         //       if (!_hosts_paths[host]) _hosts_paths[host] = []
  //         //
  //         //       if (path !== undefined) {
  //         //         path = path.replace('os.', '')
  //         //         if (path.indexOf('.') > -1) { path = path.substring(0, path.indexOf('.')) }
  //         //       }
  //         //       if (path !== undefined && !_hosts_paths[host].contains(path)) _hosts_paths[host].push(path)
  //         //
  //         //       if (!_paths.contains(path)) _paths.push(path)
  //       })
  //     })
  //     //
  //     //   Object.each(_hosts_paths, function (paths, host) {
  //     //     paths.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
  //     //   })
  //     //
  //     logs.sort(function (a, b) { return (a.domain > b.domain) ? 1 : ((b.domain > a.domain) ? -1 : 0) })
  //
  //     if (logs.length > 0) {
  //       vm.logs = logs
  //       vm.loading = false
  //     }
  //
  //   //   vm.paths = _paths
  //   }
  //
  //   // debug('CATEGORIES callback %o %o', _hosts_paths, _categories)
  // }
}

const once = [
  logs_paths
]

const periodical = [
  logs_paths
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once, logs_paths }
export default requests
