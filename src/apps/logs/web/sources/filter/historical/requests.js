import * as Debug from 'debug'
const debug = Debug('apps:logs:web:sources:filter:historical:requests')

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = HOUR * 24
const WEEK = DAY * 7

import static_types from '../../../libs/static_extentions'

const generic_callback = function (data, metadata, key, vm) {
  // debug('HISTORICAL HOST CALLBACK data %s %o', key, data)

  const END = vm.end()
  const TOP = vm.top

  if (/historical/.test(key) && data.logs_historical && Object.getLength(data.logs_historical) > 0) {
    data = JSON.parse(JSON.stringify(data))
    debug('HISTORICAL HOST CALLBACK data %s %o', key, data, END)
    // let type
    // let vm_data = {}
    let per_domain = {}
    let per_host = {}

    let range = {start: undefined, end: undefined}
    let per_host_range = {start: undefined, end: undefined}
    let timestamp = data.logs_historical[0].metadata.timestamp // comes sorted by timestamp in desc order, so first item has the biggest timestamp
    let smallest_start = vm.round(timestamp)

    Array.each(data.logs_historical, function (row) {
      let start = row.metadata.range.start
      let end = row.metadata.range.end

      if (start >= smallest_start) { // discard any document that is previous to our smallest_start timestamp
        if (range.start === undefined || range.start > start) { range.start = start }

        if (range.end === undefined || range.end < end) { range.end = end }

        // if (timestamp === undefined || timestamp < row.metadata.timestamp) { timestamp = row.metadata.timestamp }

        if (Array.isArray(row.metadata.host)) {
          let domain = row.metadata.domain
          if (!per_domain[domain]) per_domain[domain] = row.data
        } else {
          let host = row.metadata.host
          if (!per_host[host]) per_host[host] = row.data
        }
      }
      // if (!type) type = row.metadata.type
      // Object.each(row.data, function (row_data, prop) {
      //   if (!vm_data[prop]) {
      //     vm_data[prop] = JSON.parse(JSON.stringify(row_data[0].value))
      //   } else if (row_data[0] && row_data[0].value) {
      //     // if (prop === 'user_agent') {
      //     //   // debug('HISTORICAL HOST CALLBACK data %s %s %o %o', key, type, prop, vm_data[prop], row_data)
      //     //   debug('HISTORICAL HOST CALLBACK data %s %s %o %o', key, type, prop)
      //     //   vm_data[prop] = _merge(prop, vm_data[prop], JSON.parse(JSON.stringify(row_data[0].value)))
      //     // }
      //     vm_data[prop] = _merge(prop, vm_data[prop], JSON.parse(JSON.stringify(row_data[0].value)))
      //     // debug('HISTORICAL HOST CALLBACK data %s %s %o', key, type, prop, row_data)
      //   }
      // })
      //
      // if (Object.getLength(vm_data) > 0) {
      //   vm[type] = vm_data
      // }
    })

    let total_bytes_sent = 0
    let total_requests = 0
    let unique_visitors = 0
    let status_counter = {}
    let referer_counter = {}
    let user_counter = {}
    let type_counter = {}
    let user_agent_os_counter = {}
    let user_agent_browser_counter = {}
    let top_domain = { domain: undefined, value: 0}
    // let _top_os_counter = 0
    // let top_os

    let world_map_city_counter = []
    let world_map_country_counter = []
    let city_counter = {}
    let country_counter = {}
    let continent_counter = {}
    let _tmp_world_map_city_counter = {}
    let _tmp_world_map_country_counter = {}
    let _tmp_top_per_domain = {}

    debug('HISTORICAL HOST CALLBACK data %s %o', key, per_domain)

    Object.each(per_domain, function (data, domain) {
      if (data.body_bytes_sent && data.body_bytes_sent.sum) {
        total_bytes_sent += data.body_bytes_sent.sum
      }

      if (data.unique_visitors) {
        unique_visitors += data.unique_visitors
      }

      /**
      * use "status" to count "total_requests" & per_domain "requests"
      **/
      if (data.status) {
        Object.each(data.status, function (value, status) {
          if (!status_counter[status]) status_counter[status] = 0
          status_counter[status] += value

          total_requests += value

          if (!_tmp_top_per_domain[domain]) _tmp_top_per_domain[domain] = 0
          _tmp_top_per_domain[domain] += value
        })
      }

      if (data.referer && data.referer.medium) {
        Object.each(data.referer.medium, function (value, medium) {
          if (!referer_counter[medium]) referer_counter[medium] = 0
          referer_counter[medium] += value
        })
      }

      if (data.remote_user) {
        Object.each(data.remote_user, function (value, user) {
          if (!user_counter[user]) user_counter[user] = 0
          user_counter[user] += value
        })
      }

      if (data.pathname) {
        Object.each(data.pathname, function (value, pathname) {
          let type = (static_types.test(pathname)) ? 'static' : 'dynamic'
          if (!type_counter[type]) type_counter[type] = 0
          type_counter[type] += value
        })
      }

      if (data.user_agent) {
        if (data.user_agent.os && data.user_agent.os.family) {
          Object.each(data.user_agent.os.family, function (value, os) {
            if (!user_agent_os_counter[os]) user_agent_os_counter[os] = 0
            user_agent_os_counter[os] += value
          })
        }

        if (data.user_agent.ua && data.user_agent.ua.family) {
          Object.each(data.user_agent.ua.family, function (value, browser) {
            if (!user_agent_browser_counter[browser]) user_agent_browser_counter[browser] = 0
            user_agent_browser_counter[browser] += value
          })
        }
      }

      if (data.geoip) {
        Object.each(data.geoip.location, function (row) {
          let country = (row.country) ? row.country : undefined
          let continent = (row.continent) ? row.continent : undefined
          let city = (row.city && country) ? row.city + ' - ' + country : undefined

          // world_map_city_counter.push({
          //   title: city + ' ( hits: ' + row.count.length + ' )',
          //   latitude: row.latitude,
          //   longitude: row.longitude,
          //   count: row.count.length
          // })

          // let world_map_city = (row.location && row.location.latitude && row.location.longitude) ? row.location + ':' + row.location.latitude : undefined
          // let world_map_city_name = (row.city) ? (row.city.names) ? (row.city.names.en) ? row.city.names.en + ' - ' + country : row.city.names.es + ' - ' + country : undefined : undefined

          if (city !== undefined && !city_counter[city]) city_counter[city] = 0
          if (city !== undefined) city_counter[city] += row.count.length

          if (city !== undefined && !_tmp_world_map_city_counter[city]) {
            _tmp_world_map_city_counter[city] = Object.clone(row)
            _tmp_world_map_city_counter[city].count = row.count.length
          } else if (city !== undefined) {
            _tmp_world_map_city_counter[city].count += row.count.length
          }

          if (country !== undefined && !_tmp_world_map_country_counter[country]) {
            _tmp_world_map_country_counter[country] = Object.clone(row)
            _tmp_world_map_country_counter[country].count = row.count.length
          } else if (country !== undefined) {
            _tmp_world_map_country_counter[country].count += row.count.length
          }

          if (country !== undefined && !country_counter[country]) country_counter[country] = 0
          if (country !== undefined) country_counter[country] += row.count.length

          if (continent !== undefined && !continent_counter[continent]) continent_counter[continent] = 0
          if (continent !== undefined) continent_counter[continent] += row.count.length
        })
      }
    })

    Object.each(_tmp_top_per_domain, function (value, domain) {
      if (value > top_domain.value) {
        top_domain = {
          domain: domain,
          value: value
        }
      }
    })

    debug('_tmp_world_map_city_counter', _tmp_world_map_city_counter)

    Object.each(_tmp_world_map_city_counter, function (row, city) {
      world_map_city_counter.push({
        title: city + ' ( hits: ' + row.count + ' )',
        latitude: row.latitude,
        longitude: row.longitude,
        count: row.count
      })
    })

    Object.each(_tmp_world_map_country_counter, function (row, country) {
      world_map_country_counter.push({
        title: country + ' ( hits: ' + row.count + ' )',
        name: country,
        count: row.count
      })
    })

    let top_city_counter = {}
    let _top_city_counter = []
    Object.each(city_counter, function (data, city) {
      _top_city_counter.push(data)
    })

    _top_city_counter = _top_city_counter.sort((a, b) => b - a)

    for (let i = 0; i < TOP; i++) {
      let value = _top_city_counter[i]

      Object.each(city_counter, function (data, city) {
        if (data === value) {
          top_city_counter[city] = data
        }
      })
    }

    let top_country_counter = {}
    let _top_country_counter = []
    Object.each(country_counter, function (data, country) {
      _top_country_counter.push(data)
    })

    _top_country_counter = _top_country_counter.sort((a, b) => b - a)

    for (let i = 0; i < TOP; i++) {
      let value = _top_country_counter[i]

      Object.each(country_counter, function (data, country) {
        if (data === value) {
          top_country_counter[country] = data
        }
      })
    }

    world_map_city_counter = world_map_city_counter.sort((a, b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0))

    let top_world_map_city_counter = []

    for (let i = 0; i < TOP; i++) {
      let data = world_map_city_counter[i]

      top_world_map_city_counter.push(data)
    }

    world_map_country_counter = world_map_country_counter.sort((a, b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0))

    let top_world_map_country_counter = []

    for (let i = 0; i < TOP; i++) {
      let data = world_map_country_counter[i]

      top_world_map_country_counter.push(data)
    }

    debug('HISTORICAL HOST CALLBACK data %s %o %o', key, top_city_counter, top_country_counter)

    // vm.$set(vm.historical, 'total_bytes_sent', total_bytes_sent)
    // vm.$set(vm.historical, 'total_requests', total_requests)
    // vm.$set(vm.historical, 'unique_visitors', unique_visitors)
    // vm.$set(vm.historical, 'status_counter', status_counter)
    // vm.$set(vm.historical, 'referer_counter', referer_counter)
    // vm.$set(vm.historical, 'user_counter', user_counter)
    // vm.$set(vm.historical, 'type_counter', type_counter)
    // vm.$set(vm.historical, 'user_agent_os_counter', user_agent_os_counter)
    // vm.$set(vm.historical, 'user_agent_browser_counter', user_agent_browser_counter)
    //
    // // vm.$set(vm.historical, 'top_os', top_os)
    //
    // vm.$set(vm.historical, 'per_domain', per_domain)
    // vm.$set(vm.historical, 'per_host', per_host)
    // vm.$set(vm.historical, 'range', range)
    // vm.$set(vm.historical, 'timestamp', timestamp)
    // vm.$set(vm.historical, 'world_map_cities', world_map_city_counter)
    // vm.$set(vm.historical, 'top_world_map_cities', top_world_map_city_counter)
    //
    // vm.$set(vm.historical, 'world_map_countries', world_map_country_counter)
    // vm.$set(vm.historical, 'top_world_map_countries', top_world_map_country_counter)
    //
    // vm.$set(vm.historical, 'city_counter', city_counter)
    // vm.$set(vm.historical, 'country_counter', country_counter)
    // vm.$set(vm.historical, 'top_city_counter', top_city_counter)
    // vm.$set(vm.historical, 'top_country_counter', top_country_counter)
    //
    // vm.$set(vm.historical, 'continent_counter', continent_counter)

    vm.set_data({
      'top_domain': top_domain,
      'total_bytes_sent': total_bytes_sent,
      'total_requests': total_requests,
      'unique_visitors': unique_visitors,
      'status_counter': status_counter,
      'referer_counter': referer_counter,
      'user_counter': user_counter,
      'type_counter': type_counter,
      'user_agent_os_counter': user_agent_os_counter,
      'user_agent_browser_counter': user_agent_browser_counter,

      // 'per_domain': per_domain,
      // 'per_host': per_host,

      'range': range,
      'timestamp': timestamp,
      // 'world_map_cities': world_map_city_counter,
      'top_world_map_cities': top_world_map_city_counter,

      // 'world_map_countries': world_map_country_counter,
      'top_world_map_countries': top_world_map_country_counter,

      // 'city_counter': city_counter,
      // 'country_counter': country_counter,
      'top_city_counter': top_city_counter,
      'top_country_counter': top_country_counter,

      'continent_counter': continent_counter
    })
    debug('HISTORICAL HOST CALLBACK data %s %o', key, city_counter, country_counter, continent_counter)

    data = undefined

    // // data = data.logs_historical[0]
    //
    // // if (/minute/.test(key)){
    // //   const START = END - MINUTE
    // // }
  }
}

const host_once_component = {
  params: function (_key, vm) {
    debug('HISTORICAL host_range_component %o %o', _key, vm.filter, vm.type)

    let source
    let key

    if (!_key) {
      // key = ['periodical.once', 'historical.minute.once', 'historical.hour.once', 'historical.day.once']// 'config.once',
      key = ['historical.' + vm.type + '.once']// 'config.once',
    }

    if (
      _key
    ) {
      // const END = 1586055600972 //= > test data
      const END = vm.end()

      let START

      let filter = ["r.row('metadata')('tag').contains('web')"]

      Object.each(vm.filter, function (value, prop) {
        filter.push('function:' +
        "row('metadata')('" + prop + "').do(function(val) {" +
        "  return this.r.branch(val.typeOf().eq('ARRAY'), val.contains('" + value + "'), val.eq('" + value + "'))" +
        '}.bind(this))'
        )
      })

      debug('FILTER ARRAY %o', filter)
      if (vm.type === 'minute') {
        START = (END - (5 * MINUTE) >= 0) ? END - (5 * MINUTE) : 0
      } else if (vm.type === 'hour') {
        START = (END - (2 * HOUR) >= 0) ? END - (2 * HOUR) : 0
      } else {
        START = (END - DAY >= 0) ? END - DAY : 0
      }

      filter.push("r.row('metadata')('type').eq('" + vm.type + "')")

      source = [{
        params: { id: _key },
        path: 'all',
        range: 'posix ' + START + '-' + END + '/*',
        query: {
          'from': 'logs_historical',
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
