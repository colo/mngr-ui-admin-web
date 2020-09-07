import * as Debug from 'debug'
const debug = Debug('apps:logs:qmail:sources:filter:historical:requests')

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = HOUR * 24
const WEEK = DAY * 7

// import static_types from '../../../libs/static_extentions'

const generic_callback = function (data, metadata, key, vm) {
  debug('HISTORICAL HOST CALLBACK data %s %o', key, data)

  const END = vm.end()
  const TOP = vm.top

  if (/historical/.test(key) && data[key] && Object.getLength(data[key]) > 0) {
    data = JSON.parse(JSON.stringify(data))
    debug('HISTORICAL HOST CALLBACK data %s %o', key, data, END)
    // let type
    // let vm_data = {}
    let per_domain = {}
    let per_host = {}

    let range = {start: undefined, end: undefined}
    let per_host_range = {start: undefined, end: undefined}
    let timestamp = data[key][0].metadata.timestamp // comes sorted by timestamp in desc order, so first item has the biggest timestamp
    let smallest_start = vm.round(timestamp)

    Array.each(data[key], function (row) {
      let start = row.metadata.range.start
      let end = row.metadata.range.end

      if (start >= smallest_start) { // discard any document that is previous to our smallest_start timestamp
        if (range.start === undefined || range.start > start) { range.start = start }

        if (range.end === undefined || range.end < end) { range.end = end }

        // if (timestamp === undefined || timestamp < row.metadata.timestamp) { timestamp = row.metadata.timestamp }

        // if (Array.isArray(row.metadata.host)) {
        //   let domain = row.metadata.domain
        //   if (!per_domain[domain]) per_domain[domain] = row.data
        // } else {
        let host = row.metadata.host
        let path = row.metadata.path
        if (!per_host[host]) per_host[host] = {}
        if (!per_host[host][path]) per_host[host][path] = {}
        per_host[host][path] = Object.merge(per_host[host][path], row.data)
        // debug('HISTORICAL HOST CALLBACK data per_host %s %o', host, row)
        // }
      }
    })
    //
    // let total_bytes_sent = 0
    // let total_requests = 0
    // let unique_visitors = 0
    // let status_counter = {}
    // let referer_counter = {}
    // let user_counter = {}
    // let type_counter = {}
    // let user_agent_os_counter = {}
    // let user_agent_browser_counter = {}

    // // let _top_os_counter = 0
    // // let top_os
    //
    // let world_map_city_counter = []
    // let world_map_country_counter = []
    // let city_counter = {}
    // let country_counter = {}
    // let continent_counter = {}
    // let _tmp_world_map_city_counter = {}
    // let _tmp_world_map_country_counter = {}
    // let _tmp_top_per_domain = {}
    //
    debug('HISTORICAL HOST CALLBACK data per_host %s %o', key, per_host)
    //
    let per_data = {}
    if (Object.getLength(per_domain) > 0) {
      per_data = per_domain
    } else {
      per_data = per_host
    }

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

    Object.each(per_data, function (data, host) {
      if (!_tmp_top_deliveries_per_host[host]) _tmp_top_deliveries_per_host[host] = 0
      if (!_tmp_top_msg_per_host[host]) _tmp_top_msg_per_host[host] = 0

      Object.each(data, function (value, path) {
        if (path === 'logs.qmail.send.stats') {
          messages += (value.messages) ? value.messages : 0
          bytes += (value.bytes) ? value.bytes : 0
          _tmp_top_msg_per_host[host] += (value.messages) ? value.messages : 0

          if (value.to && value.to.success && value.to.success.domains) {
            Object.each(value.to.success.domains, function (value, domain) {
              domain = domain.toLowerCase()
              if (!domain_to_counter[domain]) domain_to_counter[domain] = 0
              domain_to_counter[domain] += value
              success_delivery += value
              _tmp_top_deliveries_per_host[host] += value
            })
          }

          if (value.to && value.to.failed && value.to.failed.domains) {
            Object.each(value.to.failed.domains, function (value, domain) {
              domain = domain.toLowerCase()
              if (!domain_to_counter[domain]) domain_to_counter[domain] = 0
              domain_to_counter[domain] += value.length

              failed_delivery += value.length
              _tmp_top_deliveries_per_host[host] += value.length
            })
          }

          if (value.from && value.from.domains) {
            Object.each(value.from.domains, function (value, domain) {
              domain = domain.toLowerCase()
              if (!domain_from_counter[domain]) domain_from_counter[domain] = 0
              domain_from_counter[domain] += value
            })
          }
        }

        // if (path === 'logs.qmail.send.delivered') {
        //   Object.each(value, function (delivery, id) {
        //     bytes = (delivery.bytes) ? bytes + delivery.bytes : bytes
        //
        //     // debug('HISTORICAL HOST CALLBACK data per_domain per_host %d %d %o', bytes, delivery.bytes, delivery)
        //
        //     if (!_tmp_top_deliveries_per_host[host]) _tmp_top_deliveries_per_host[host] = 0
        //     _tmp_top_deliveries_per_host[host] += 1
        //
        //     if (delivery.status === 'success') {
        //       success_delivery++
        //     } else {
        //       failed_delivery++
        //     }
        //   })
        // }
      })
      // if (data.messages) {
      //   messages += Object.getLength(data.messages)
      //   // Object.each(data.messages, function (message) {
      //   //   bytes += message.bytes
      //   // })
      //   if (!_tmp_top_msg_per_host[host]) _tmp_top_msg_per_host[host] = 0
      //   _tmp_top_msg_per_host[host] += Object.getLength(data.messages)
      // }

    //
    //   if (data.unique_visitors) {
    //     unique_visitors += data.unique_visitors
    //   }
    //
    //   /**
    //   * use "status" to count "total_requests" & per_domain "requests"
    //   **/
    //   if (data.status) {
    //     Object.each(data.status, function (value, status) {
    //       if (!status_counter[status]) status_counter[status] = 0
    //       status_counter[status] += value
    //
    //       total_requests += value
    //
    //       if (!_tmp_top_per_domain[domain]) _tmp_top_per_domain[domain] = 0
    //       _tmp_top_per_domain[domain] += value
    //     })
    //   }
    //
    //   if (data.referer && data.referer.medium) {
    //     Object.each(data.referer.medium, function (value, medium) {
    //       if (!referer_counter[medium]) referer_counter[medium] = 0
    //       referer_counter[medium] += value
    //     })
    //   }
    //
    //   if (data.remote_user) {
    //     Object.each(data.remote_user, function (value, user) {
    //       if (!user_counter[user]) user_counter[user] = 0
    //       user_counter[user] += value
    //     })
    //   }
    //
    //   if (data.pathname) {
    //     Object.each(data.pathname, function (value, pathname) {
    //       let type = (static_types.test(pathname)) ? 'static' : 'dynamic'
    //       if (!type_counter[type]) type_counter[type] = 0
    //       type_counter[type] += value
    //     })
    //   }
    //
    //   if (data.user_agent) {
    //     if (data.user_agent.os && data.user_agent.os.family) {
    //       Object.each(data.user_agent.os.family, function (value, os) {
    //         if (!user_agent_os_counter[os]) user_agent_os_counter[os] = 0
    //         user_agent_os_counter[os] += value
    //       })
    //     }
    //
    //     if (data.user_agent.ua && data.user_agent.ua.family) {
    //       Object.each(data.user_agent.ua.family, function (value, browser) {
    //         if (!user_agent_browser_counter[browser]) user_agent_browser_counter[browser] = 0
    //         user_agent_browser_counter[browser] += value
    //       })
    //     }
    //   }
    //
    //   if (data.geoip) {
    //     Object.each(data.geoip.location, function (row) {
    //       debug('GEODATA %o', row)
    //
    //       let country = (row.country) ? row.country : 'Unknown'
    //       let continent = (row.continent) ? row.continent : 'Unknown'
    //       let city = (row.city && country) ? row.city + ' - ' + country : 'Unknown - ' + country
    //
    //       // world_map_city_counter.push({
    //       //   title: city + ' ( hits: ' + row.count + ' )',
    //       //   latitude: row.latitude,
    //       //   longitude: row.longitude,
    //       //   count: row.count
    //       // })
    //
    //       // let world_map_city = (row.location && row.location.latitude && row.location.longitude) ? row.location + ':' + row.location.latitude : undefined
    //       // let world_map_city_name = (row.city) ? (row.city.names) ? (row.city.names.en) ? row.city.names.en + ' - ' + country : row.city.names.es + ' - ' + country : undefined : undefined
    //
    //       if (city !== undefined && !city_counter[city]) city_counter[city] = 0
    //       if (city !== undefined) city_counter[city] += row.count
    //
    //       if (city !== undefined && !_tmp_world_map_city_counter[city]) {
    //         _tmp_world_map_city_counter[city] = Object.clone(row)
    //         // _tmp_world_map_city_counter[city].count = row.count
    //       } else if (city !== undefined) {
    //         _tmp_world_map_city_counter[city].count += row.count
    //       }
    //
    //       if (country !== undefined && !_tmp_world_map_country_counter[country]) {
    //         _tmp_world_map_country_counter[country] = Object.clone(row)
    //         // _tmp_world_map_country_counter[country].count = row.count.length
    //       } else if (country !== undefined) {
    //         _tmp_world_map_country_counter[country].count += row.count
    //       }
    //
    //       if (country !== undefined && !country_counter[country]) country_counter[country] = 0
    //       if (country !== undefined) country_counter[country] += row.count
    //
    //       if (continent !== undefined && !continent_counter[continent]) continent_counter[continent] = 0
    //       if (continent !== undefined) continent_counter[continent] += row.count
    //     })
    //   } else {
    //     debug('NO GEODATA')
    //   }
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

    //
    // // debug('_tmp_world_map_city_counter', _tmp_world_map_city_counter)
    //
    // Object.each(_tmp_world_map_city_counter, function (row, city) {
    //   world_map_city_counter.push({
    //     title: city + ' ( hits: ' + row.count + ' )',
    //     latitude: row.latitude,
    //     longitude: row.longitude,
    //     count: row.count
    //   })
    // })
    //
    // Object.each(_tmp_world_map_country_counter, function (row, country) {
    //   world_map_country_counter.push({
    //     title: country + ' ( hits: ' + row.count + ' )',
    //     name: country,
    //     count: row.count
    //   })
    // })
    //
    // let top_city_counter = {}
    // let _top_city_counter = []
    // Object.each(city_counter, function (data, city) {
    //   _top_city_counter.push(data)
    // })
    //
    // _top_city_counter = _top_city_counter.sort((a, b) => b - a)
    //
    // for (let i = 0; i < TOP; i++) {
    //   let value = _top_city_counter[i]
    //
    //   Object.each(city_counter, function (data, city) {
    //     if (data === value) {
    //       top_city_counter[city] = data
    //     }
    //   })
    // }
    //
    // let top_country_counter = {}
    // let _top_country_counter = []
    // Object.each(country_counter, function (data, country) {
    //   _top_country_counter.push(data)
    // })
    //
    // _top_country_counter = _top_country_counter.sort((a, b) => b - a)
    //
    // for (let i = 0; i < TOP; i++) {
    //   let value = _top_country_counter[i]
    //
    //   Object.each(country_counter, function (data, country) {
    //     if (data === value) {
    //       top_country_counter[country] = data
    //     }
    //   })
    // }
    //
    // world_map_city_counter = world_map_city_counter.sort((a, b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0))
    //
    // let top_world_map_city_counter = []
    //
    // for (let i = 0; i < TOP; i++) {
    //   let data = world_map_city_counter[i]
    //
    //   top_world_map_city_counter.push(data)
    // }
    //
    // world_map_country_counter = world_map_country_counter.sort((a, b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0))
    //
    // let top_world_map_country_counter = []
    //
    // for (let i = 0; i < TOP; i++) {
    //   let data = world_map_country_counter[i]
    //
    //   top_world_map_country_counter.push(data)
    // }
    //
    // debug('HISTORICAL HOST CALLBACK geodata %s %o %o %o', key, world_map_country_counter, top_country_counter, country_counter)
    //

    vm.$set(vm.historical, 'top_msg_host', top_msg_host)
    vm.$set(vm.historical, 'top_deliveries_host', top_deliveries_host)

    vm.$set(vm.historical, 'failed_delivery', failed_delivery)
    vm.$set(vm.historical, 'success_delivery', success_delivery)

    vm.$set(vm.historical, 'domain_to_counter', domain_to_counter)
    vm.$set(vm.historical, 'domain_from_counter', domain_from_counter)

    vm.$set(vm.historical, 'messages', messages)
    vm.$set(vm.historical, 'bytes', bytes)
    // // vm.$set(vm.historical, 'unique_visitors', unique_visitors)
    // // vm.$set(vm.historical, 'status_counter', status_counter)
    // // vm.$set(vm.historical, 'referer_counter', referer_counter)
    // // vm.$set(vm.historical, 'user_counter', user_counter)
    // // vm.$set(vm.historical, 'type_counter', type_counter)
    // // vm.$set(vm.historical, 'user_agent_os_counter', user_agent_os_counter)
    // // vm.$set(vm.historical, 'user_agent_browser_counter', user_agent_browser_counter)
    // //
    // // // vm.$set(vm.historical, 'top_os', top_os)
    // //
    // // vm.$set(vm.historical, 'per_domain', per_domain)
    // // vm.$set(vm.historical, 'per_host', per_host)
    vm.$set(vm.historical, 'range', range)
    vm.$set(vm.historical, 'timestamp', timestamp)
    // // vm.$set(vm.historical, 'world_map_cities', world_map_city_counter)
    // // vm.$set(vm.historical, 'top_world_map_cities', top_world_map_city_counter)
    // //
    // // vm.$set(vm.historical, 'world_map_countries', world_map_country_counter)
    // // vm.$set(vm.historical, 'top_world_map_countries', top_world_map_country_counter)
    // //
    // // vm.$set(vm.historical, 'city_counter', city_counter)
    // // vm.$set(vm.historical, 'country_counter', country_counter)
    // // vm.$set(vm.historical, 'top_city_counter', top_city_counter)
    // // vm.$set(vm.historical, 'top_country_counter', top_country_counter)
    // //
    // // vm.$set(vm.historical, 'continent_counter', continent_counter)
    //
    // vm.set_data({
    //   'top_msg_host': top_msg_host,
    //   'total_bytes_sent': total_bytes_sent,
    //   'total_requests': total_requests,
    //   'unique_visitors': unique_visitors,
    //   'status_counter': status_counter,
    //   'referer_counter': referer_counter,
    //   'user_counter': user_counter,
    //   'type_counter': type_counter,
    //   'user_agent_os_counter': user_agent_os_counter,
    //   'user_agent_browser_counter': user_agent_browser_counter,
    //
    //   // 'per_domain': per_domain,
    //   // 'per_host': per_host,
    //
    //   'range': range,
    //   'timestamp': timestamp,
    //   // 'world_map_cities': world_map_city_counter,
    //   'top_world_map_cities': top_world_map_city_counter,
    //
    //   // 'world_map_countries': world_map_country_counter,
    //   'top_world_map_countries': top_world_map_country_counter,
    //
    //   // 'city_counter': city_counter,
    //   // 'country_counter': country_counter,
    //   'top_city_counter': top_city_counter,
    //   'top_country_counter': top_country_counter,
    //
    //   'continent_counter': continent_counter
    // })
    // debug('HISTORICAL HOST CALLBACK data %s %o', key, city_counter, country_counter, continent_counter)
    //
    // data = undefined
    //
    // // // data = data[key][0]
    // //
    // // // if (/minute/.test(key)){
    // // //   const START = END - MINUTE
    // // // }
  }
}

const host_once_component = {
  params: function (_key, vm) {
    debug('HISTORICAL host_range_component %o %o', _key, vm.filter, vm.type)

    let source
    let key

    if (!_key) {
      // key = ['periodical.once', 'historical.minute.once', 'historical.hour.once', 'historical.day.once']// 'config.once',
      // key = ['historical.' + vm.type + '.once']// 'config.once',
      key = ['logs_historical_' + vm.type]// 'config.once',
    }

    if (
      _key
    ) {
      // const END = 1586055600972 //= > test data
      const END = vm.end()

      let START

      let filter = ["r.row('metadata')('tag').contains('qmail.send')"]
      // let filter = [
      //   "r.row('metadata')('path').eq('logs.qmail.send.status')",
      //   "r.row('metadata')('path').eq('logs.qmail.send.delivered')",
      //   "r.row('metadata')('path').eq('logs.qmail.send.stats')",
      //   "r.row('metadata')('path').eq('logs.qmail.send.queue')"
      // ]

      let tag = false
      Object.each(vm.filter, function (value, prop) {
        // debug('FILTER STRING SPLIT %o', prop.split('.'))
        let _prop = prop.split('.', 2)
        let row = (_prop.length > 1) ? _prop[0] : 'metadata'
        let real_prop = (_prop.length > 1) ? _prop[1] : _prop[0]

        if (real_prop === 'tag') {
          tag = true
        }

        if (!Array.isArray(value)) {
          let _value = value.split(':')
          let operation = (_value.length > 1) ? _value[0] : 'match'
          let real_value = (_value.length > 1) ? _value[1] : _value[0]
          let type = (_value.length > 2) ? _value[2] : 'string'
          // real_value = (isNaN(real_value * 1)) ? "'" + real_value + "'" : real_value * 1
          real_value = (type === 'string') ? "'" + real_value + "'" : real_value * 1

          debug('FILTER STRING SPLIT %s %s', row, real_prop, operation, real_value)

          filter.push('function:' +
          "row('" + row + "')('" + real_prop + "').do(function(val) {" +
          "  return this.r.branch(val.typeOf().eq('ARRAY'), val.contains(" + real_value + '), val.' + operation + '(' + real_value + '))' +
          '}.bind(this))'
          )
        } else {
          /**
          * if you are searching for more than one "host", you don't want to use ".contains", because it will bring "domain stats" docs
          **/
          let func = "function:row('" + row + "')('" + real_prop + "').do(function(val) {"

          let contains = ''
          let op = ''
          let count_close_op = 0
          Array.each(value, function (single_value, index) {
            let _value = single_value.split(':')
            let operation = (_value.length > 1) ? _value[0] : 'eq'
            let real_value = (_value.length > 1) ? _value[1] : _value[0]
            let type = (_value.length > 2) ? _value[2] : 'string'
            // real_value = (isNaN(real_value * 1)) ? "'" + real_value + "'" : real_value * 1
            real_value = (type === 'string') ? "'" + real_value + "'" : real_value * 1

            // debug('FILTER STRING SPLIT %s %s', row, real_prop, operation, real_value)

            contains += (index < value.length - 1) ? real_value + ',' : real_value
            op += (index < value.length - 1) ? 'val.' + operation + '(' + real_value + ').or(' : 'val.' + operation + '(' + real_value + ')'
            count_close_op++
          })
          for (let i = 0; i < count_close_op; i++) {
            op += ')'
          }
          func += "return this.r.branch(val.typeOf().eq('ARRAY'),  val.contains(" + contains + '),' + op
          // func += "return this.r.branch(val.typeOf().ne('ARRAY')," + op
          func += '}.bind(this))'
          debug('FILTER STRING SPLIT %s', func)
          filter.push(func)
        }
      })

      // if no filer by tag (domain|host) add "domain" as default
      if (tag === false) {
        filter.push("r.row('metadata')('tag').contains('host')")
      }

      if (vm.type === 'minute') {
        START = (END - (5 * MINUTE) >= 0) ? END - (5 * MINUTE) : 0
      } else if (vm.type === 'hour') {
        START = (END - (2 * HOUR) >= 0) ? END - (2 * HOUR) : 0
      } else {
        START = (END - DAY >= 0) ? END - DAY : 0
      }

      filter.push("r.row('metadata')('type').eq('" + vm.type + "')")
      filter.push("r.row('metadata')('path').ne('logs.qmail.send')")
      filter.push("r.row('metadata')('path').ne('logs.qmail.send.queue')")
      filter.push("r.row('metadata')('path').ne('logs.qmail.send.delivered')")
      debug('FILTER ARRAY %o', filter)

      source = [{
        params: { id: _key },
        path: 'all',
        range: 'posix ' + START + '-' + END + '/*',
        query: {
          'from': 'logs_historical_' + vm.type,
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
          ],
          filter: filter

        }
      }]
    }

    debug('MyChart periodical KEY ', key, source)

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
