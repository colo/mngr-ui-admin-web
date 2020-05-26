import * as Debug from 'debug'
const debug = Debug('apps:os:sources:host:minute:requests')

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

const generic_callback = function (data, metadata, key, vm) {
  debug('MINUTE HOST CALLBACK data %s %o', key, data)

  // if (/periodical/.test(key) && (data.os || Object.getLength(data) > 0)) {
  //   let _data
  //   if (data.os) _data = data.os // comes from 'Range'
  //   else _data = data // comes from 'register'
  //
  //   // let _paths = []
  //   // let _plugins_categories = []
  //   // let _plugins_config_sorted = []
  //
  //   Object.each(_data, function (plugin, name) {
  //     // name = name.toLowerCase()
  //     let category
  //     if (name !== undefined) {
  //       name = name.replace('os.', '')
  //       category = (name.indexOf('.') > -1) ? name.substring(0, name.indexOf('.')) : name
  //       // if (!_paths.contains(path)) _paths.push(path)
  //       // if (!_plugins_config[category]) _plugins_config[category] = {}
  //       if (!vm.periodical.plugins_categories.contains(category)) vm.periodical.plugins_categories.push(category)
  //
  //       // _plugins_config[category][name] = config
  //     }
  //
  //     if (plugin && Object.getLength(plugin) > 0) {
  //       // if (!vm.periodical.plugins[name]) vm.periodical.$set(vm.periodical.plugins, name, { periodical: undefined, minute: undefined })
  //       if (!vm.periodical.plugins.contains(name)) vm.periodical.plugins.push(name)
  //
  //       vm.$nextTick(function () {
  //         if (vm.$refs[name + '.periodical'] && vm.$refs[name + '.periodical'][0]) { // if data already exists
  //           if (!vm.$refs[name + '.periodical'][0].$options.plugin_data) vm.$refs[name + '.periodical'][0].$options.plugin_data = { periodical: undefined, minute: undefined }
  //
  //           let _plugin = {}
  //           // if (
  //           //   vm.$refs[name+'.periodical'][0].$options.plugin_data &&
  //           //   vm.$refs[name+'.periodical'][0].$options.plugin_data.periodical &&
  //           //     Object.getLength(vm.$refs[name+'.periodical'][0].$options.plugin_data.periodical) > 0
  //           // ) {
  //           //   _plugin = JSON.parse(JSON.stringify(vm.$refs[name+'.periodical'][0].$options.plugin_data.periodical))
  //           //
  //           //   Object.each(plugin, function (data, prop) {
  //           //     if (_plugin[prop] && Array.isArray(_plugin[prop]) && _plugin[prop].length > 0) {
  //           //       _plugin[prop].combine(data)
  //           //
  //           //       // sort by first column, timestamp
  //           //       _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //           //
  //           //       let filtered = []
  //           //       Array.each(_plugin[prop], function (item, index) {
  //           //         if (index === 0) { filtered.push(item) } else if (item[0] !== _plugin[prop][index - 1][0]) {
  //           //           filtered.push(item)
  //           //         }
  //           //       })
  //           //
  //           //       // debug('PERIODICAL HOST CALLBACK %s %o', name, prop, filtered)
  //           //
  //           //       _plugin[prop] = filtered
  //           //     } else {
  //           //       debug('PERIODICAL HOST CALLBACK BUG %s %s %o %o', name, prop, _plugin[prop], data)
  //           //       // _plugin[prop] = data
  //           //       //
  //           //       // _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //           //     }
  //           //   })
  //           //
  //           //   // debug('PERIODICAL HOST CALLBACK %s %o', name, _plugin)
  //           // } else {
  //           //   _plugin = {}
  //
  //           // Object.each(plugin, function (data, prop) {
  //           //   // sort by first column, timestamp
  //           //
  //           //   if (Array.isArray(data) && data.length > 0) { // on 'register' data may be empty
  //           //     _plugin[prop] = Array.clone(data)
  //           //     _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //           //   }
  //           // })
  //
  //           Object.keys(plugin)
  //             .sort()// sort keys alphabetically
  //             .forEach(function (prop, i) {
  //             // console.log(v, data[v]);
  //               let data = plugin[prop]
  //               if (Array.isArray(data) && data.length > 0) { // on 'register' data may be empty
  //                 _plugin[prop] = Array.clone(data)
  //                 _plugin[prop].sort(function (a, b) { return (a[0] < b[0]) ? 1 : ((a[0] > b[0]) ? -1 : 0) })
  //               }
  //             })
  //
  //           // debug('PERIODICAL HOST CALLBACK no prev data %s %o %o', name, _plugin)
  //           // }
  //
  //           if (Object.getLength(_plugin) > 0) {
  //             debug('PERIODICAL HOST CALLBACK %s %o', name, _plugin)
  //             vm.$refs[name + '.periodical'][0].set_data({ periodical: _plugin })
  //           }
  //         }
  //       })
  //     }
  //   })
  //
  //   vm.periodical.plugins_categories.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
  //   vm.periodical.plugins.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
  //
  //   // if (_plugins_categories.length > 0 && _plugins_categories.length !== vm.plugins_categories.length) {
  //   //   vm.plugins_categories = _plugins_categories
  //   // }
  // }
  // else
  if (/minute/.test(key) && (data.os_historical || Object.getLength(data) > 0)) {
    debug('MINUTE HOST CALLBACK data %s %o', key, data)
  }
}

const host_once_component = {
  params: function (_key, vm) {
    debug('PERIODICAL host_range_component %o %o', _key, vm)

    let source
    let key

    if (!_key) {
      key = ['minute.once']// , 'minute.once' 'config.once',
    }

    if (
      _key
    ) {
      switch (_key) {
        // case 'periodical.once':
        //   source = [{
        //     params: { id: _key },
        //     path: 'all',
        //     range: 'posix ' + roundMilliseconds(Date.now() - (6 * MINUTE)) + '-' + roundMilliseconds(Date.now()) + '/*',
        //     // range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
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

        case 'minute.once':
          source = [{
            params: { id: _key },
            path: 'all',
            range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
            query: {
              'from': 'os_historical',
              // 'register': 'changes',
              // 'format': 'tabular',
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
                'metadata',
                'data'
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              'filter': [
                { 'metadata': { 'host': vm.host } },
                { 'metadata': { 'type': 'minute' } },
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
// const host_range_component = {
//   params: function (_key, vm) {
//     // debug('PERIODICAL host_range_component %o %o', _key, vm)
//
//     // const MINUTE = 60000
//
//     let source
//     let key
//
//     if (!_key) {
//       // key = ['periodical.range', 'config.range', 'minute.range']
//       key = ['periodical.range'] //, 'minute.range'
//     }
//
//     // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)
//
//     if (
//       _key
//     ) {
//       switch (_key) {
//         case 'periodical.range':
//           source = [{
//             params: { id: _key },
//             path: 'all',
//             range: 'posix ' + roundMilliseconds((Date.now() - (1 * SECOND))) + '-' + roundMilliseconds(Date.now()) + '/*',
//             query: {
//               'from': 'os',
//               // 'register': 'changes',
//               'format': 'tabular',
//               'index': false,
//               /**
//               * right now needed to match OUTPUT 'id' with this query (need to @fix)
//               **/
//               'q': [
//                 // {
//                 //   'metadata': [
//                 //     'timestamp',
//                 //     'path'
//                 //   ]
//                 // },
//                 // 'metadata',
//                 'data'
//               ],
//               'transformation': [
//                 {
//                   'orderBy': { 'index': 'r.desc(timestamp)' }
//                 }
//               ],
//               'filter': { 'metadata': { 'host': vm.host } }
//
//             }
//           }]
//           break
//
//         // case 'minute.range':
//         //   source = [{
//         //     params: { id: _key },
//         //     path: 'all',
//         //     range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
//         //     query: {
//         //       'from': 'os_historical',
//         //       // 'register': 'changes',
//         //       'format': 'tabular',
//         //       'index': false,
//         //       /**
//         //       * right now needed to match OUTPUT 'id' with this query (need to @fix)
//         //       **/
//         //       'q': [
//         //         // {
//         //         //   'metadata': [
//         //         //     'timestamp',
//         //         //     'path'
//         //         //   ]
//         //         // },
//         //         // 'metadata',
//         //         'data'
//         //       ],
//         //       'transformation': [
//         //         {
//         //           'orderBy': { 'index': 'r.desc(timestamp)' }
//         //         }
//         //       ],
//         //       'filter': [
//         //         { 'metadata': { 'host': vm.host } },
//         //         { 'metadata': { 'type': 'minute' } }
//         //       ]
//         //
//         //     }
//         //   }]
//         //
//         //   break
//       }
//     }
//
//     // debug('MyChart periodical KEY ', key, source)
//
//     return { key, source }
//   },
//   callback: generic_callback
//
// }

const once = [
  // host_once_register,
  host_once_component
]

const periodical = [
  host_once_component
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests
