import * as Debug from 'debug'
const debug = Debug('apps:logs:qmail:sources:filter:periodical:requests')

// import END from '../../../etc/range'
// const end = require('../../../../etc/end')

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

const NANOSECOND = 1000000
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = HOUR * 24
const WEEK = DAY * 7

// let total_bytes_sent = {}
// let hits = {}
//
// let user_agent_os_counter = {}
// let user_agent_os_family_counter = {}
// let user_agent_engine_counter = {}
// let user_agent_browser_counter = {}
// let user_agent_device_counter = {}
//
// let status_counter = {}
//
// let city_counter = {}
// let country_counter = {}
// let continent_counter = {}
// let world_map_city_counter = []
//
// let addr_counter = {}
// let user_counter = {}
// let referer_counter = {}
//
// let type_counter = {}

// import static_types from '../../../libs/static_extentions'
// const ss = require('simple-statistics')
//
// const _merge = function (prop, val1, val2) {
//   // debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
//   let merged
//
//   if (!isNaN(val1)) { // && !isNaN(val2)
//     if (val2 === undefined) val2 = 0
//     merged = val1 + val2 * 1
//   } else if (isNaN(val1) && val1.max !== undefined && val1.min !== undefined) {
//     // debug('HISTORICAL HOST CALLBACK data row %s %o', val1, val2)
//     merged = {}
//
//     merged.max = ss.max([val1.max * 1, val2.max * 1])
//     merged.min = ss.min([val1.min * 1, val2.min * 1])
//     merged.sum = ss.sumSimple([val1.sum * 1, val2.sum * 1])
//     merged.range = val1.max - val1.min
//     merged.mean = ss.mean([val1.mean * 1, val2.mean * 1])
//     merged.median = ss.median([val1.median * 1, val2.median * 1])
//     // delete val1.mode
//   } else if (
//     (prop !== 'geoip') &&
//     isNaN(val1) &&
//     isNaN(val2)
//   ) {
//     // debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
//     // if (Array.isArray(val1)) {
//     //   merged = []
//     //   Array.each(val1, function (val1_data, val1_index) {
//     //     merged.push(_merge(prop, val1_data, val2[val1_index]))
//     //   })
//     // } else {
//     merged = {}
//     merged = _merge_objects(prop, val1, val2)
//     // }
//   } else if (prop === 'geoip') {
//     // debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
//     merged = {}
//     merged.city = _merge('city', val1.city, val2.city)
//     merged.country = _merge('country', val1.country, val2.country)
//     merged.continent = _merge('continent', val1.continent, val2.continent)
//     merged.registeredCountry = _merge('registeredCountry', val1.registeredCountry, val2.registeredCountry)
//
//     merged.location = {}
//
//     Object.each(val1.location, function (val1_data, val1_prop) {
//       if (!merged.location[val1_prop]) merged.location[val1_prop] = Object.merge(Object.clone(val1_data), { count: 0 })
//
//       merged.location[val1_prop].count += val1_data.count
//     })
//
//     Object.each(val2.location, function (val2_data, val2_prop) {
//       if (!merged.location[val2_prop]) merged.location[val2_prop] = Object.merge(Object.clone(val2_data), { count: 0 })
//
//       merged.location[val2_prop].count += val2_data.count
//     })
//
//     merged.ip = {}
//
//     Object.each(val1.ip, function (val1_data, val1_prop) {
//       if (!merged.ip[val1_prop]) merged.ip[val1_prop] = Object.merge(Object.clone(val1_data), { count: 0 })
//
//       merged.ip[val1_prop].count += val1_data.count
//     })
//
//     Object.each(val2.ip, function (val2_data, val2_prop) {
//       if (!merged.ip[val2_prop]) merged.ip[val2_prop] = Object.merge(Object.clone(val2_data), { count: 0 })
//
//       merged.ip[val2_prop].count += val2_data.count
//     })
//   } else {
//     debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
//   }
//   return merged
// }
//
// const _merge_objects = function (prop, val1, val2) {
//   let merged = {}
//   let _used_props = []
//   Object.each(val1, function (val1_data, val1_prop) {
//     if (val2 && val2[val1_prop]) {
//       merged[val1_prop] = _merge(prop, val1_data, val2[val1_prop])
//     } else {
//       merged[val1_prop] = val1_data
//     }
//     _used_props.push(val1_prop)
//   })
//
//   Object.each(val2, function (val2_data, val2_prop) {
//     if (!_used_props.contains(val2_prop)) {
//       if (val1 && val1[val2_prop]) {
//         merged[val2_prop] = _merge(prop, val2_data, val1[val2_prop])
//       } else {
//         merged[val2_prop] = val2_data
//       }
//     }
//   })
//   return merged
// }

const generic_callback = function (data, metadata, key, vm) {
  // debug('HOST CALLBACK data %s %o', key, data)

  const END = vm.end()
  const TOP = vm.top
  // const END = end()
  // const END = 15000 //= > test data
  // const END = Date.now() // production

  if (/periodical/.test(key) && data) { // (data.logs || Object.getLength(data) > 0)
    // const START = END - MINUTE
    // const START = END - (15 * SECOND)
    // const START = (END - (5 * SECOND) >= 0) ? END - (5 * SECOND) : 0

    let _data
    if (data.logs) _data = data.logs // comes from 'Range'
    else _data = data // comes from 'register'

    // if (!_data.data) _data.data = {}
    let per_host = {}

    let range = {start: undefined, end: undefined}
    let timestamp = _data[0].metadata.timestamp // comes sorted by timestamp in desc order, so first item has the biggest timestamp
    let smallest_start = roundMilliseconds(timestamp - (5 * SECOND))
    debug('PERIODICAL HOST CALLBACK _data %o', _data)

    let logs = []
    Array.each(_data, function (row) {
      logs.push(row.metadata)

      let timestamp = row.metadata.timestamp

      if (timestamp >= smallest_start) { // discard any document that is previous to our smallest_start timestamp
        if (range.start === undefined || range.start > timestamp) { range.start = timestamp }

        if (range.end === undefined || range.end < timestamp) { range.end = timestamp }

        let host = row.metadata.host
        let path = row.metadata.domain
        if (!per_host[host]) per_host[host] = {}
        if (!per_host[host][path]) per_host[host][path] = {}
        per_host[host][path] = Object.merge(per_host[host][path], row.data)
        // debug('HISTORICAL HOST CALLBACK data per_host %s %o', host, row)
        // }
      }
    })

    // debug('PERIODICAL HOST CALLBACK data per_host %s %o', key, per_host)
    let failed_delivery = 0
    let success_delivery = 0
    let domain_to_counter = {}
    let domain_from_counter = {}
    let messages = 0
    let bytes = 0
    let _tmp_top_msg_per_host = {}
    let _tmp_top_deliveries_per_host = {}
    let top_msg_host = { domain: undefined, value: 0}
    let top_deliveries_host = { domain: undefined, value: 0}

    Object.each(per_host, function (data, host) {
      if (!_tmp_top_deliveries_per_host[host]) _tmp_top_deliveries_per_host[host] = 0
      if (!_tmp_top_msg_per_host[host]) _tmp_top_msg_per_host[host] = 0

      Object.each(data, function (value, prop) {
        if (prop === 'delivery.starting') {
          if (value.to) {
            let domain = (value.to.indexOf('@') > -1) ? /@(.*)/.exec(value.to) : []
            if (domain[1]) {
              domain[1] = domain[1].replace('>', '').toLowerCase()
              if (!domain_to_counter[domain[1]]) domain_to_counter[domain[1]] = 0
              domain_to_counter[domain[1]]++
            }
          }
        } else if (prop === 'delivery.status') {
          _tmp_top_deliveries_per_host[host]++

          if (value.status === 'success') {
            success_delivery++
          } else {
            failed_delivery++
          }
        } else if (prop === 'msg.info') {
          bytes += (value.bytes) ? value.bytes : 0
          _tmp_top_msg_per_host[host]++
          messages++
          if (value.from) {
            let domain = (value.from.indexOf('@') > -1) ? /@(.*)/.exec(value.from) : []
            if (domain[1]) {
              domain[1] = domain[1].replace('>', '').toLowerCase()
              if (!domain_from_counter[domain[1]]) domain_from_counter[domain[1]] = 0
              domain_from_counter[domain[1]]++
            }
          }
        }
      })
    })

    Object.each(_tmp_top_msg_per_host, function (value, host) {
      if (value > top_msg_host.value) {
        top_msg_host = {
          host: host,
          value: value
        }
      }
    })

    Object.each(_tmp_top_deliveries_per_host, function (value, host) {
      if (value > top_deliveries_host.value) {
        top_deliveries_host = {
          host: host,
          value: value
        }
      }
    })

    debug('PERIODICAL HOST CALLBACK logs %o', logs)
    if (logs.length > 0) {
      // vm.logs = logs
      vm.$set(vm.periodical, 'logs', logs)
      vm.loading_logs = false
    }
    vm.$set(vm.periodical, 'failed_delivery', failed_delivery)
    vm.$set(vm.periodical, 'success_delivery', success_delivery)

    vm.$set(vm.periodical, 'top_msg_host', top_msg_host)
    vm.$set(vm.periodical, 'top_deliveries_host', top_deliveries_host)

    vm.$set(vm.periodical, 'domain_to_counter', domain_to_counter)
    vm.$set(vm.periodical, 'domain_from_counter', domain_from_counter)
    //
    vm.$set(vm.periodical, 'messages', messages)
    vm.$set(vm.periodical, 'bytes', bytes)
  }
}

const host_once_component = {
  params: function (_key, vm) {
    debug('PERIODICAL host_range_component %o %o', _key, vm.filter)

    let source
    let key

    if (!_key) {
      key = ['periodical.once']// , 'historical.minute.once', 'historical.hour.once', 'historical.day.once'
    }

    if (
      _key
    ) {
      // const END = 15000 //= > test data
      // const END = end()
      const END = vm.end()

      /**
      * production
      **/
      // const END = Date.now()

      let START

      let filter = "this.r.row('metadata')('tag').contains('qmail.send').and("

      let count_close_filter = 0
      Object.each(vm.filter, function (value, prop) {
        debug('FILTER STRING SPLIT %s %o', prop, value)
        let _prop = prop.split('.', 2)
        let row = (_prop.length > 1) ? _prop[0] : 'metadata'
        let real_prop = (_prop.length > 1) ? _prop[1] : _prop[0]

        if (!Array.isArray(value)) { value = [value] }

        Array.each(value, function (single_value, index) {
          let _value = single_value.split(':')
          let operation = (_value.length > 1) ? _value[0] : 'eq'
          let real_value = (_value.length > 1) ? _value[1] : _value[0]

          // real_value = (isNaN(real_value * 1)) ? "'" + real_value + "'" : real_value * 1
          let type = (_value.length > 2) ? _value[2] : 'string'
          // real_value = (isNaN(real_value * 1)) ? "'" + real_value + "'" : real_value * 1
          real_value = (type === 'string') ? "'" + real_value + "'" : real_value * 1

          debug('FILTER STRING SPLIT %s %s', row, real_prop, operation, real_value)

          filter += "this.r.row('" + row + "')('" + real_prop + "')." + operation + '(' + real_value
          if (index === value.length - 1) {
            filter += ').and('
          } else {
            filter += ').or('
          }

          count_close_filter++
        })
      })

      debug('FILTER STRING %s', filter)

      switch (_key) {
        case 'periodical.once':
          // START = END - MINUTE
          // START = END - (15 * SECOND)
          START = (END - (5 * SECOND) >= 0) ? END - (5 * SECOND) : 0

          filter += "this.r.row('metadata')('type').eq('periodical')"
          // Object.each(vm.filter, function (value, prop) {
          //   filter += ')'
          // })
          for (let i = 0; i < count_close_filter; i++) {
            filter += ')'
          }

          filter += ')' // -> this.r.row('metadata')('tag').contains('qmail.send').and(

          debug('FILTER STRING %s', filter)

          source = [{
            params: { id: _key },
            path: 'all',
            // range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
            range: 'posix ' + START + '-' + END + '/*',
            query: {
              'from': 'logs',
              // 'register': 'changes',
              // 'format': 'stat',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                'data',
                'metadata'
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
                // { 'limit': 10 }
              ],
              filter: filter
              // 'filter': [
              //   { 'metadata': vm.filter },
              //   "r.row('metadata')('type').eq('periodical')"
              // ]

            }
          }]
          break

        // case 'historical.minute.once':
        //   // START = END - MINUTE
        //   START = (END - MINUTE >= 0) ? END - MINUTE : 0
        //
        //   filter += "this.r.row('metadata')('type').eq('minute')"
        //   Object.each(vm.filter, function (value, prop) {
        //     filter += ')'
        //   })
        //
        //   filter += ')' // -> this.r.row('metadata')('tag').contains('qmail.send').and(
        //
        //   debug('FILTER STRING %s', filter)
        //
        //   source = [{
        //     params: { id: _key },
        //     path: 'all',
        //     // range: 'posix ' + (Date.now() - (7 * MINUTE)) + '-' + Date.now() + '/*',
        //     range: 'posix ' + START + '-' + END + '/*',
        //     query: {
        //       'from': 'logs_historical',
        //       // 'register': 'changes',
        //       'format': 'stat',
        //       'index': false,
        //       /**
        //       * right now needed to match OUTPUT 'id' with this query (need to @fix)
        //       **/
        //       'q': [
        //         // {
        //         //   'metadata': [
        //         //     'timestamp',
        //         //     'path'
        //         //   ]
        //         // },
        //         'data',
        //         'metadata'
        //       ],
        //       'transformation': [
        //         {
        //           'orderBy': { 'index': 'r.desc(timestamp)' }
        //         }
        //       ],
        //       filter: filter
        //       // 'filter': [
        //       //   { 'metadata': vm.filter },
        //       //   "r.row('metadata')('type').eq('minute')"
        //       // ]
        //
        //     }
        //   }]
        //
        //   break
        //
        // case 'historical.hour.once':
        //   // START = END - HOUR
        //   START = START(END - HOUR >= 0) ? END - HOUR : 0
        //
        //   filter += "this.r.row('metadata')('type').eq('hour')"
        //   Object.each(vm.filter, function (value, prop) {
        //     filter += ')'
        //   })
        //
        //   filter += ')' // -> this.r.row('metadata')('tag').contains('qmail.send').and(
        //
        //   debug('FILTER STRING %s', filter)
        //
        //   source = [{
        //     params: { id: _key },
        //     path: 'all',
        //     // range: 'posix ' + (Date.now() - (7 * MINUTE)) + '-' + Date.now() + '/*',
        //     range: 'posix ' + START + '-' + END + '/*',
        //     query: {
        //       'from': 'logs_historical',
        //       // 'register': 'changes',
        //       'format': 'stat',
        //       'index': false,
        //       /**
        //       * right now needed to match OUTPUT 'id' with this query (need to @fix)
        //       **/
        //       'q': [
        //         // {
        //         //   'metadata': [
        //         //     'timestamp',
        //         //     'path'
        //         //   ]
        //         // },
        //         'data',
        //         'metadata'
        //       ],
        //       'transformation': [
        //         {
        //           'orderBy': { 'index': 'r.desc(timestamp)' }
        //         }
        //       ],
        //       filter: filter
        //       // 'filter': [
        //       //   { 'metadata': vm.filter },
        //       //   "r.row('metadata')('type').eq('hour')"
        //       // ]
        //
        //     }
        //   }]
        //
        //   break
        //
        // case 'historical.day.once':
        //   // START = END - DAY
        //   START = START(END - DAY >= 0) ? END - DAY : 0
        //
        //   filter += "this.r.row('metadata')('type').eq('day')"
        //   Object.each(vm.filter, function (value, prop) {
        //     filter += ')'
        //   })
        //
        //   filter += ')' // -> this.r.row('metadata')('tag').contains('qmail.send').and(
        //
        //   debug('FILTER STRING %s', filter)
        //
        //   source = [{
        //     params: { id: _key },
        //     path: 'all',
        //     // range: 'posix ' + (Date.now() - (7 * MINUTE)) + '-' + Date.now() + '/*',
        //     range: 'posix ' + START + '-' + END + '/*',
        //     query: {
        //       'from': 'logs_historical',
        //       // 'register': 'changes',
        //       'format': 'stat',
        //       'index': false,
        //       /**
        //         * right now needed to match OUTPUT 'id' with this query (need to @fix)
        //         **/
        //       'q': [
        //         // {
        //         //   'metadata': [
        //         //     'timestamp',
        //         //     'path'
        //         //   ]
        //         // },
        //         'data',
        //         'metadata'
        //       ],
        //       'transformation': [
        //         {
        //           'orderBy': { 'index': 'r.desc(timestamp)' }
        //         }
        //       ],
        //       filter: filter
        //       // 'filter': [
        //       //   { 'metadata': vm.filter },
        //       //   "r.row('metadata')('type').eq('hour')"
        //       // ]
        //
        //     }
        //   }]
        //
        //   break
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
  // host_range_component
  host_once_component
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests
