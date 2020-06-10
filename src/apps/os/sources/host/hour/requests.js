import * as Debug from 'debug'
const debug = Debug('apps:os:sources:host:hour:requests')

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

let init = false

const generic_callback = function (data, metadata, key, vm) {
  debug('HOUR HOST CALLBACK data %s %o', key, data, metadata)

  if (/hour/.test(key) && metadata.opts && metadata.opts.params && metadata.opts.params.init === true) {
    debug('HOUR HOST CALLBACK data INIT')
    init = true
  }

  if (/hour/.test(key) && (data.os_historical || Object.getLength(data) > 0) && init === true) {
    // debug('HOUR HOST CALLBACK data %s %o', key, data)
    let _data
    if (data.os_historical) _data = data.os_historical // comes from 'Range'
    else _data = data // comes from 'register'

    // let _paths = []
    // let _plugins_categories = []
    // let _plugins_config_sorted = []

    Object.each(_data, function (plugin, name) {
      // name = name.toLowerCase()
      let category
      if (name !== undefined) {
        name = name.replace('os.', '')
        category = (name.indexOf('.') > -1) ? name.substring(0, name.indexOf('.')) : name
        // if (!_paths.contains(path)) _paths.push(path)
        // if (!_plugins_config[category]) _plugins_config[category] = {}
        if (!vm.hour.plugins_categories.contains(category)) vm.hour.plugins_categories.push(category)

        // _plugins_config[category][name] = config
      }

      // debug('HOUR HOST CALLBACK data %s %o', name, plugin)

      if (plugin && Object.getLength(plugin) > 0) {
        // if (!vm.hour.plugins[name]) vm.hour.$set(vm.hour.plugins, name, { periodical: undefined, hour: undefined })
        if (!vm.hour.plugins.contains(name)) vm.hour.plugins.push(name)

        // vm.$nextTick(function () {
        // if (vm.$refs[name + '.hour'] && vm.$refs[name + '.hour'][0]) { // if data already exists
        // if (!vm.$refs[name + '.hour'][0].$options.plugin_data) vm.$refs[name + '.hour'][0].$options.plugin_data = { periodical: undefined, hour: undefined }

        let _plugin = {}

        Object.keys(plugin)
          .sort()// sort keys alphabetically
          .forEach(function (prop, i) {
            // console.log(v, data[v]);
            let data = plugin[prop]
            if (Array.isArray(data) && data.length > 0) { // on 'register' data may be empty
              // _plugin[prop] = Array.clone(data)
              if (!_plugin[prop]) _plugin[prop] = []
              Array.each(data, function (row) {
                _plugin[prop].push([row[0], row[3]])
              })

              _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
            }
          })

        // debug('HOUR HOST CALLBACK no prev data %s %o %o', name, _plugin)
        // }

        if (Object.getLength(_plugin) > 0) {
          // debug('HOUR HOST CALLBACK %s %o', name, _plugin)
          // vm.$refs[name + '.hour'][0].set_data({ periodical: _plugin })
          // if (metadata.opts && metadata.opts.params && metadata.opts.params.init === true) {
          //   vm.set_plugin_data(name, _plugin, 'hour')
          // }
          vm.set_plugin_data(name, _plugin, 'hour')
        }
        // }
        // })
      }
    })

    vm.hour.plugins_categories.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
    vm.hour.plugins.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })

    // if (_plugins_categories.length > 0 && _plugins_categories.length !== vm.plugins_categories.length) {
    //   vm.plugins_categories = _plugins_categories
    // }
  }
}

const host_once_component = {
  params: function (_key, vm) {
    debug('PERIODICAL HOUR host_range_component %o %o', _key, vm)

    let source
    let key

    if (!_key) {
      key = ['hour.once']// , 'hour.once' 'config.once',
    }

    if (
      _key
    ) {
      switch (_key) {
        // case 'periodical.once':
        //   source = [{
        //     params: { id: _key },
        //     path: 'all',
        //     range: 'posix ' + roundMilliseconds(Date.now() - (6 * hour)) + '-' + roundMilliseconds(Date.now()) + '/*',
        //     // range: 'posix ' + (Date.now() - hour) + '-' + Date.now() + '/*',
        //     query: {
        //       'from': 'os',
        //       // 'register': 'changes',
        //       'format': 'tabular',
        //       'index': false,
        //       /**
        //       * right now needed to match OUTPUT 'id' with this query (need to @fix)
        //       **/
        //       'q': [
        //         'data'
        //       ],
        //       'transformation': [
        //         {
        //           'orderBy': { 'index': 'r.desc(timestamp)' }
        //         }
        //       ],
        //       'filter': [
        //         { 'metadata': { 'host': vm.host } },
        //         "r.row('metadata')('path').ne('os.procs')"
        //       ]
        //
        //     }
        //   }]
        //   break

        case 'hour.once':
          source = [{
            params: { id: _key, init: true },
            path: 'all',
            range: 'posix ' + (Date.now() - WEEK) + '-' + Date.now() + '/*',
            query: {
              'from': 'os_historical',
              // 'register': 'changes',
              'format': 'tabular',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                // {
                //   'metadata': [
                //     'timestamp',
                //     'path'
                //   ]
                // },
                // 'metadata',
                'data'
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              'filter': [
                { 'metadata': { 'host': vm.host } },
                { 'metadata': { 'type': 'hour' } },
                "r.row('metadata')('path').ne('os.procs')"
              ]

            }
          }]

          break
      }
    }

    // debug('MyChart periodical KEY ', key, source)

    return { key, source }
  },
  callback: generic_callback

}

const host_range_component = {
  params: function (_key, vm) {
    debug('PERIODICAL HOUR host_range_component host_range_component %o %o', _key, vm)

    let source
    let key

    if (!_key) {
      key = ['hour.periodical']// , 'hour.once' 'config.once',
    }

    if (
      _key
    ) {
      switch (_key) {
        // case 'periodical.once':
        //   source = [{
        //     params: { id: _key },
        //     path: 'all',
        //     range: 'posix ' + roundMilliseconds(Date.now() - (6 * hour)) + '-' + roundMilliseconds(Date.now()) + '/*',
        //     // range: 'posix ' + (Date.now() - hour) + '-' + Date.now() + '/*',
        //     query: {
        //       'from': 'os',
        //       // 'register': 'changes',
        //       'format': 'tabular',
        //       'index': false,
        //       /**
        //       * right now needed to match OUTPUT 'id' with this query (need to @fix)
        //       **/
        //       'q': [
        //         'data'
        //       ],
        //       'transformation': [
        //         {
        //           'orderBy': { 'index': 'r.desc(timestamp)' }
        //         }
        //       ],
        //       'filter': [
        //         { 'metadata': { 'host': vm.host } },
        //         "r.row('metadata')('path').ne('os.procs')"
        //       ]
        //
        //     }
        //   }]
        //   break

        case 'hour.periodical':
          source = [{
            params: { id: _key },
            path: 'all',
            range: 'posix ' + (Date.now() - (2 * HOUR)) + '-' + Date.now() + '/*',
            query: {
              'from': 'os_historical',
              // 'register': 'changes',
              'format': 'tabular',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                // {
                //   'metadata': [
                //     'timestamp',
                //     'path'
                //   ]
                // },
                // 'metadata',
                'data'
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              'filter': [
                { 'metadata': { 'host': vm.host } },
                { 'metadata': { 'type': 'hour' } },
                "r.row('metadata')('path').ne('os.procs')"
              ]

            }
          }]

          break
      }
    }

    // debug('MyChart periodical KEY ', key, source)

    return { key, source }
  },
  callback: generic_callback

}

const once = [
  // host_once_register,
  host_once_component
]

const periodical = [
  host_range_component
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests
