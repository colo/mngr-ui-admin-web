import * as Debug from 'debug'
const debug = Debug('apps:logs:web:sources:filter:periodical:requests')

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

import static_types from '../../../libs/static_extentions'
const ss = require('simple-statistics')

const _merge = function (prop, val1, val2) {
  // debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
  let merged

  if (!isNaN(val1)) { // && !isNaN(val2)
    if (val2 === undefined) val2 = 0
    merged = val1 + val2 * 1
  } else if (isNaN(val1) && val1.max !== undefined && val1.min !== undefined) {
    // debug('HISTORICAL HOST CALLBACK data row %s %o', val1, val2)
    merged = {}

    merged.max = ss.max([val1.max * 1, val2.max * 1])
    merged.min = ss.min([val1.min * 1, val2.min * 1])
    merged.sum = ss.sumSimple([val1.sum * 1, val2.sum * 1])
    merged.range = val1.max - val1.min
    merged.mean = ss.mean([val1.mean * 1, val2.mean * 1])
    merged.median = ss.median([val1.median * 1, val2.median * 1])
    // delete val1.mode
  } else if (
    (prop !== 'geoip') &&
    isNaN(val1) &&
    isNaN(val2)
  ) {
    // debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
    // if (Array.isArray(val1)) {
    //   merged = []
    //   Array.each(val1, function (val1_data, val1_index) {
    //     merged.push(_merge(prop, val1_data, val2[val1_index]))
    //   })
    // } else {
    merged = {}
    merged = _merge_objects(prop, val1, val2)
    // }
  } else if (prop === 'geoip') {
    // debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
    merged = {}
    merged.city = _merge('city', val1.city, val2.city)
    merged.country = _merge('country', val1.country, val2.country)
    merged.continent = _merge('continent', val1.continent, val2.continent)
    merged.registeredCountry = _merge('registeredCountry', val1.registeredCountry, val2.registeredCountry)

    merged.location = {}

    Object.each(val1.location, function (val1_data, val1_prop) {
      if (!merged.location[val1_prop]) merged.location[val1_prop] = Object.merge(Object.clone(val1_data), { count: 0 })

      merged.location[val1_prop].count += val1_data.count
    })

    Object.each(val2.location, function (val2_data, val2_prop) {
      if (!merged.location[val2_prop]) merged.location[val2_prop] = Object.merge(Object.clone(val2_data), { count: 0 })

      merged.location[val2_prop].count += val2_data.count
    })

    merged.ip = {}

    Object.each(val1.ip, function (val1_data, val1_prop) {
      if (!merged.ip[val1_prop]) merged.ip[val1_prop] = Object.merge(Object.clone(val1_data), { count: 0 })

      merged.ip[val1_prop].count += val1_data.count
    })

    Object.each(val2.ip, function (val2_data, val2_prop) {
      if (!merged.ip[val2_prop]) merged.ip[val2_prop] = Object.merge(Object.clone(val2_data), { count: 0 })

      merged.ip[val2_prop].count += val2_data.count
    })
  } else {
    debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
  }
  return merged
}

const _merge_objects = function (prop, val1, val2) {
  let merged = {}
  let _used_props = []
  Object.each(val1, function (val1_data, val1_prop) {
    if (val2 && val2[val1_prop]) {
      merged[val1_prop] = _merge(prop, val1_data, val2[val1_prop])
    } else {
      merged[val1_prop] = val1_data
    }
    _used_props.push(val1_prop)
  })

  Object.each(val2, function (val2_data, val2_prop) {
    if (!_used_props.contains(val2_prop)) {
      if (val1 && val1[val2_prop]) {
        merged[val2_prop] = _merge(prop, val2_data, val1[val2_prop])
      } else {
        merged[val2_prop] = val2_data
      }
    }
  })
  return merged
}

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

    debug('PERIODICAL HOST CALLBACK _data %o', _data)

    let range = {start: undefined, end: undefined}
    // let per_host_range = {start: undefined, end: undefined}
    let timestamp = _data[0].metadata.timestamp // comes sorted by timestamp in desc order, so first item has the biggest timestamp
    let smallest_start = roundMilliseconds(timestamp - (5 * SECOND))
    // const START = roundSeconds(timestamp - (5 * SECOND))

    /**
    * removed from global
    **/
    let total_bytes_sent = {}
    let total_requests = {}

    let user_agent_os_counter = {}
    let user_agent_os_family_counter = {}
    let user_agent_engine_counter = {}
    let user_agent_browser_counter = {}
    let user_agent_device_counter = {}

    let status_counter = {}

    let city_counter = {}
    let country_counter = {}
    let continent_counter = {}
    let world_map_city_counter = {}
    let world_map_country_counter = {}

    let addr_counter = {}
    let user_counter = {}
    let referer_counter = {}

    let unique_visitors_ip_uas = {}

    let type_counter = {}
    /**
    * removed from global
    **/

    /**
    * logs
    **/

    let logs = []

    let host_counter = {}
    let domain_counter = {}

    let current_bytes_sent = 0
    let smallest_start_index = 0
    let _tmp_periodical_world_map_city_counter = {}
    let _tmp_periodical_world_map_country_counter = {}

    // Array.each(_data[0].data.referer, function (row, index) {
    //   // debug('REFERER %o', row.value)
    //   let value = (row.value.referer) ? row.value.referer + ' - ' + row.value.medium : row.value.medium
    //   if (!referer_counter[row.timestamp]) referer_counter[row.timestamp] = {}
    //   if (!referer_counter[row.timestamp][value]) referer_counter[row.timestamp][value] = 0
    //   referer_counter[row.timestamp][value] += 1
    // })

    Array.each(_data, function (row, index) {
      let start = row.metadata.timestamp
      let end = row.metadata.timestamp

      if (start >= smallest_start) { // discard any document that is previous to our smallest_start timestamp
        // debug('PERIODICAL HOST CALLBACK _data %o', _data)
        if (range.start === undefined || range.start > start) { range.start = start }

        if (range.end === undefined || range.end < end) { range.end = end }

        let host = row.metadata.host
        let domain = row.metadata.domain

        if (!host_counter[host]) host_counter[host] = 0
        if (!domain_counter[domain]) domain_counter[domain] = 0

        host_counter[host] += 1
        domain_counter[domain] += 1

        logs.push(Object.merge(Object.clone(row.metadata), { log: row.data.log }))

        if (!total_requests[row.metadata.timestamp]) total_requests[row.metadata.timestamp] = 0
        total_requests[row.metadata.timestamp] += 1

        if (row.data.body_bytes_sent) {
          if (smallest_start_index === 0) {
            current_bytes_sent = row.data.body_bytes_sent
          }

          if (!total_bytes_sent[row.metadata.timestamp]) total_bytes_sent[row.metadata.timestamp] = 0
          total_bytes_sent[row.metadata.timestamp] += row.data.body_bytes_sent
        }

        if (row.data.status) {
          if (!status_counter[row.metadata.timestamp]) status_counter[row.metadata.timestamp] = {}
          if (!status_counter[row.metadata.timestamp][row.data.status]) status_counter[row.metadata.timestamp][row.data.status] = 0
          status_counter[row.metadata.timestamp][row.data.status] += 1
        }

        /**
        * UNIQUE VISITORS are calculated with remote_addr + user_agent
        **/
        if (row.data.remote_addr) {
          let ip = row.data.remote_addr
          if (!addr_counter[row.metadata.timestamp]) addr_counter[row.metadata.timestamp] = {}
          if (!addr_counter[row.metadata.timestamp][ip]) addr_counter[row.metadata.timestamp][ip] = 0
          addr_counter[row.metadata.timestamp][ip] += 1

          if (!unique_visitors_ip_uas[ip]) unique_visitors_ip_uas[ip] = []
          if (row.data.remote_user) unique_visitors_ip_uas[ip].combine([JSON.stringify(row.data.user_agent)])
        }

        /** user_agent **/
        if (row.data.user_agent) {
          // debug('user_agent %s', row.data.user_agent)

          let os = row.data.user_agent.os.family
          os = (row.data.user_agent.os.major) ? os + ' ' + row.data.user_agent.os.major : os

          let engine = row.data.user_agent.engine.family
          // engine = (row.data.user_agent.engine.major) ? engine + ' ' + row.data.user_agent.engine.major : engine
          // engine = (row.data.user_agent.engine.minor) ? engine + '.' + row.data.user_agent.engine.minor : engine
          // engine = (row.data.user_agent.engine.patch) ? engine + '.' + row.data.user_agent.engine.patch : engine

          let browser = row.data.user_agent.ua.family
          // browser = (row.data.user_agent.ua.major) ? browser + ' ' + row.data.user_agent.ua.major : browser
          // browser = (row.data.user_agent.ua.minor) ? browser + '.' + row.data.user_agent.ua.minor : browser
          // browser = (row.data.user_agent.ua.patch) ? browser + '.' + row.data.user_agent.ua.patch : browser
          // browser = (row.data.user_agent.ua.type) ? browser + ' ' + row.data.user_agent.ua.type : browser

          let device = (row.data.user_agent.device.brand) ? row.data.user_agent.device.brand : row.data.user_agent.device.family
          device = (row.data.user_agent.device.model) ? device + ' ' + row.data.user_agent.device.model : device
          device = (row.data.user_agent.device.type) ? device + ' - ' + row.data.user_agent.device.type : device

          if (!user_agent_os_counter[row.metadata.timestamp]) user_agent_os_counter[row.metadata.timestamp] = {}
          if (!user_agent_os_counter[row.metadata.timestamp][os]) user_agent_os_counter[row.metadata.timestamp][os] = 0
          user_agent_os_counter[row.metadata.timestamp][os] += 1

          if (!user_agent_engine_counter[row.metadata.timestamp]) user_agent_engine_counter[row.metadata.timestamp] = {}
          if (!user_agent_engine_counter[row.metadata.timestamp][engine]) user_agent_engine_counter[row.metadata.timestamp][engine] = 0
          user_agent_engine_counter[row.metadata.timestamp][engine] += 1

          if (!user_agent_browser_counter[row.metadata.timestamp]) user_agent_browser_counter[row.metadata.timestamp] = {}
          if (!user_agent_browser_counter[row.metadata.timestamp][browser]) user_agent_browser_counter[row.metadata.timestamp][browser] = 0
          user_agent_browser_counter[row.metadata.timestamp][browser] += 1

          if (!user_agent_device_counter[row.metadata.timestamp]) user_agent_device_counter[row.metadata.timestamp] = {}
          if (!user_agent_device_counter[row.metadata.timestamp][device]) user_agent_device_counter[row.metadata.timestamp][device] = 0
          user_agent_device_counter[row.metadata.timestamp][device] += 1
        }

        if (row.data.remote_user) {
          if (!user_counter[row.metadata.timestamp]) user_counter[row.metadata.timestamp] = {}
          if (!user_counter[row.metadata.timestamp][row.data.remote_user]) user_counter[row.metadata.timestamp][row.data.remote_user] = 0
          user_counter[row.metadata.timestamp][row.data.remote_user] += 1
        }

        if (row.data.pathname) {
          let value = (static_types.test(row.data.pathname)) ? 'static' : 'dynamic'
          if (!type_counter[row.metadata.timestamp]) type_counter[row.metadata.timestamp] = {}
          if (!type_counter[row.metadata.timestamp][value]) type_counter[row.metadata.timestamp][value] = 0
          type_counter[row.metadata.timestamp][value] += 1
        }

        if (row.data.referer.referer || row.data.referer.medium) {
          // debug('PERIODICAL HOST CALLBACK referer %o', row.data.referer.referer, row.data.referer.medium)
          let value = (row.data.referer.referer) ? row.data.referer.referer + ' - ' + row.data.referer.medium : row.data.referer.medium
          if (!referer_counter[row.metadata.timestamp]) referer_counter[row.metadata.timestamp] = {}
          if (!referer_counter[row.metadata.timestamp][value]) referer_counter[row.metadata.timestamp][value] = 0
          referer_counter[row.metadata.timestamp][value] += 1
        }

        /** geoip **/
        if (row.data.geoip) {
          let country = (row.data.geoip.country) ? (row.data.geoip.country.names) ? (row.data.geoip.country.names.en) ? row.data.geoip.country.names.en : row.data.geoip.country.names.es : undefined : undefined
          let continent = (row.data.geoip.continent) ? (row.data.geoip.continent.names) ? (row.data.geoip.continent.names.en) ? row.data.geoip.continent.names.en : row.data.geoip.continent.names.es : undefined : undefined
          let city = (row.data.geoip.city && country) ? (row.data.geoip.city.names) ? (row.data.geoip.city.names.en) ? row.data.geoip.city.names.en + ' - ' + country : row.data.geoip.city.names.es + ' - ' + country : undefined : undefined

          let world_map_city = (row.data.geoip.location && row.data.geoip.location.latitude && row.data.geoip.location.longitude) ? row.data.geoip.location + ':' + row.data.geoip.location.latitude : undefined
          let world_map_city_name = (row.data.geoip.city) ? (row.data.geoip.city.names) ? (row.data.geoip.city.names.en) ? row.data.geoip.city.names.en + ' - ' + country : row.data.geoip.city.names.es + ' - ' + country : undefined : undefined

          let world_map_country = (row.data.geoip.country && row.data.geoip.country.isoCode) ? row.data.geoip.country.isoCode : undefined

          // if (row.data.geoip.country && !row.data.geoip.country.isoCode) {
          //   debug('NOT ISO', row.data.geoip.country)
          // } else {
          //   debug('ISO', row.data.geoip.country.isoCode)
          // }

          // let world_map_country_name = (row.data.geoip.country) ? (row.data.geoip.country.names) ? (row.data.geoip.country.names.en) ? row.data.geoip.country.names.en : row.data.geoip.country.names.es : undefined : undefined

          if (city && !city_counter[row.metadata.timestamp]) city_counter[row.metadata.timestamp] = {}
          if (country && !country_counter[row.metadata.timestamp]) country_counter[row.metadata.timestamp] = {}
          if (continent && !continent_counter[row.metadata.timestamp]) continent_counter[row.metadata.timestamp] = {}

          if (world_map_city && world_map_city_name && !world_map_city_counter[row.metadata.timestamp]) world_map_city_counter[row.metadata.timestamp] = {}

          if (world_map_country && country && !world_map_country_counter[row.metadata.timestamp]) world_map_country_counter[row.metadata.timestamp] = {}

          if (city && country && !city_counter[row.metadata.timestamp][city]) city_counter[row.metadata.timestamp][city] = 0
          if (country && !country_counter[row.metadata.timestamp][country]) country_counter[row.metadata.timestamp][country] = 0
          if (continent && !continent_counter[row.metadata.timestamp][continent]) continent_counter[row.metadata.timestamp][continent] = 0

          if (world_map_city && world_map_city_name && !world_map_city_counter[row.metadata.timestamp][world_map_city]) world_map_city_counter[row.metadata.timestamp][world_map_city] = { name: world_map_city_name, count: 0, latitude: row.data.geoip.location.latitude, longitude: row.data.geoip.location.longitude }

          if (world_map_country && country && !world_map_city_counter[row.metadata.timestamp][world_map_country]) world_map_country_counter[row.metadata.timestamp][world_map_country] = {name: country, count: 0}

          if (city) { city_counter[row.metadata.timestamp][city] += 1 }
          if (country) country_counter[row.metadata.timestamp][country] += 1
          if (continent) continent_counter[row.metadata.timestamp][continent] += 1

          if (world_map_city && world_map_city_name) world_map_city_counter[row.metadata.timestamp][world_map_city].count += 1

          if (world_map_country && country) world_map_country_counter[row.metadata.timestamp][world_map_country].count = country_counter[row.metadata.timestamp][country]
        }

        smallest_start_index++
      }
    })

    debug('PERIODICAL HOST CALLBACK COUNTRY data %s %o %o', key, country_counter, JSON.parse(JSON.stringify(world_map_country_counter)))

    /**
    * bytes & total_requests
    **/
    // let current_bytes_sent = 0
    // Array.each(_data[0].data.body_bytes_sent, function (row, index) {
    //   if (index === 0) {
    //     current_bytes_sent = row.value
    //   }
    //
    //   if (!total_requests[row.timestamp]) total_requests[row.timestamp] = 0
    //   total_requests[row.timestamp] += 1
    //
    //   if (!total_bytes_sent[row.timestamp]) total_bytes_sent[row.timestamp] = 0
    //   total_bytes_sent[row.timestamp] += row.value
    // })

    let periodical_total_bytes_sent = 0
    let periodical_total_requests = 0
    Object.each(total_bytes_sent, function (val, ts) {
      if (ts < smallest_start) {
        delete total_bytes_sent[ts]
        delete total_requests[ts]
      } else {
        let hit = total_requests[ts]
        periodical_total_bytes_sent += val
        periodical_total_requests += hit
      }
    })

    /**
    * status
    **/
    // Array.each(_data[0].data.status, function (row, index) {
    //   if (!status_counter[row.timestamp]) status_counter[row.timestamp] = {}
    //   if (!status_counter[row.timestamp][row.value]) status_counter[row.timestamp][row.value] = 0
    //   status_counter[row.timestamp][row.value] += 1
    // })

    let periodical_status_counter = {}
    Object.each(status_counter, function (val, ts) {
      if (ts < smallest_start) {
        delete status_counter[ts]
      } else {
        Object.each(val, function (data, status) {
          if (!periodical_status_counter[status]) periodical_status_counter[status] = 0
          periodical_status_counter[status] += data
        })
      }
    })

    /**
    * city - country - continent
    **/
    // let _tmp_periodical_world_map_city_counter = {}
    // Array.each(_data[0].data.geoip, function (row, index) {
    //   let country = (row.value.country) ? (row.value.country.names) ? (row.value.country.names.en) ? row.value.country.names.en : row.value.country.names.es : undefined : undefined
    //   let continent = (row.value.continent) ? (row.value.continent.names) ? (row.value.continent.names.en) ? row.value.continent.names.en : row.value.continent.names.es : undefined : undefined
    //   let city = (row.value.city && country) ? (row.value.city.names) ? (row.value.city.names.en) ? row.value.city.names.en + ' - ' + country : row.value.city.names.es + ' - ' + country : undefined : undefined
    //
    //   let world_map_city = (row.value.location && row.value.location.latitude && row.value.location.longitude) ? row.value.location + ':' + row.value.location.latitude : undefined
    //   let world_map_city_name = (row.value.city) ? (row.value.city.names) ? (row.value.city.names.en) ? row.value.city.names.en + ' - ' + country : row.value.city.names.es + ' - ' + country : undefined : undefined
    //
    //   if (city && !city_counter[row.timestamp]) city_counter[row.timestamp] = {}
    //   if (country && !country_counter[row.timestamp]) country_counter[row.timestamp] = {}
    //   if (continent && !continent_counter[row.timestamp]) continent_counter[row.timestamp] = {}
    //
    //   if (world_map_city && world_map_city_name && !world_map_city_counter[row.timestamp]) world_map_city_counter[row.timestamp] = {}
    //
    //   if (city && country && !city_counter[row.timestamp][city]) city_counter[row.timestamp][city] = 0
    //   if (country && !country_counter[row.timestamp][country]) country_counter[row.timestamp][country] = 0
    //   if (continent && !continent_counter[row.timestamp][continent]) continent_counter[row.timestamp][continent] = 0
    //
    //   if (world_map_city && world_map_city_name && !world_map_city_counter[row.timestamp][world_map_city]) world_map_city_counter[row.timestamp][world_map_city] = { name: world_map_city_name, count: 0, latitude: row.value.location.latitude, longitude: row.value.location.longitude }
    //
    //   if (city) { city_counter[row.timestamp][city] += 1 }
    //   if (country) country_counter[row.timestamp][country] += 1
    //   if (continent) continent_counter[row.timestamp][continent] += 1
    //
    //   if (world_map_city && world_map_city_name) world_map_city_counter[row.timestamp][world_map_city].count += 1
    // })

    let periodical_city_counter = {}
    let periodical_country_counter = {}
    let periodical_continent_counter = {}

    Object.each(city_counter, function (val, ts) {
      if (ts < smallest_start) {
        delete city_counter[ts]
        delete country_counter[ts]
        delete continent_counter[ts]
        delete world_map_city_counter[ts]
        delete world_map_country_counter[ts]
      } else {
        let country_val = country_counter[ts]
        let continent_val = continent_counter[ts]
        let world_map_city_val = world_map_city_counter[ts]
        let world_map_country_val = world_map_country_counter[ts]

        Object.each(val, function (data, city) {
          if (!periodical_city_counter[city]) periodical_city_counter[city] = 0
          periodical_city_counter[city] += data
        })

        Object.each(country_val, function (data, country) {
          if (!periodical_country_counter[country]) periodical_country_counter[country] = 0
          periodical_country_counter[country] += data
        })

        Object.each(continent_val, function (data, continent) {
          if (!periodical_continent_counter[continent]) periodical_continent_counter[continent] = 0
          periodical_continent_counter[continent] += data
        })

        Object.each(world_map_city_val, function (data, world_map_city) {
          // if (!periodical_continent_counter[continent]) periodical_continent_counter[continent] = 0
          // periodical_continent_counter[continent] += data

          if (!_tmp_periodical_world_map_city_counter[world_map_city]) {
            _tmp_periodical_world_map_city_counter[world_map_city] = data
          } else {
            _tmp_periodical_world_map_city_counter[world_map_city].count += data.count
          }
        })

        Object.each(world_map_country_val, function (data, world_map_country) {
          // if (!periodical_continent_counter[continent]) periodical_continent_counter[continent] = 0
          // periodical_continent_counter[continent] += data

          if (!_tmp_periodical_world_map_country_counter[world_map_country]) {
            _tmp_periodical_world_map_country_counter[world_map_country] = data
          } else {
            _tmp_periodical_world_map_country_counter[world_map_country].count += data.count
          }
        })
      }
    })

    let periodical_world_map_city_counter = []

    let periodical_top_world_map_city_counter = []

    Object.each(_tmp_periodical_world_map_city_counter, function (data, world_map_city) {
      periodical_world_map_city_counter.push({
        title: data.name + ' ( hits: ' + data.count + ' )',
        latitude: data.latitude,
        longitude: data.longitude,
        count: data.count,
      })
    })

    periodical_world_map_city_counter = periodical_world_map_city_counter.sort((a, b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0))

    for (let i = 0; i < TOP; i++) {
      let data = periodical_world_map_city_counter[i]

      periodical_top_world_map_city_counter.push(data)
    }

    /**
    * COUNTRY
    **/
    let periodical_world_map_country_counter = []

    let periodical_top_world_map_country_counter = []

    Object.each(_tmp_periodical_world_map_country_counter, function (data, world_map_country) {
      periodical_world_map_country_counter.push({
        id: world_map_country,
        title: data.name + ' ( hits: ' + data.count + ' )',
        name: data.name,
        count: data.count,
      })
    })

    periodical_world_map_country_counter = periodical_world_map_country_counter.sort((a, b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0))

    for (let i = 0; i < TOP; i++) {
      let data = periodical_world_map_country_counter[i]

      periodical_top_world_map_country_counter.push(data)
    }
    /**
    * address (IP)
    **/
    // Array.each(_data[0].data.remote_addr, function (row, index) {
    //   if (!addr_counter[row.timestamp]) addr_counter[row.timestamp] = {}
    //   if (!addr_counter[row.timestamp][row.value]) addr_counter[row.timestamp][row.value] = 0
    //   addr_counter[row.timestamp][row.value] += 1
    // })

    let periodical_addr_counter = {}
    Object.each(addr_counter, function (val, ts) {
      if (ts < smallest_start) {
        delete addr_counter[ts]
      } else {
        Object.each(val, function (data, addr) {
          if (!periodical_addr_counter[status]) periodical_addr_counter[addr] = 0
          periodical_addr_counter[addr] += data
        })
      }
    })

    /**
    * user
    **/
    // Array.each(_data[0].data.remote_user, function (row, index) {
    //   if (!user_counter[row.timestamp]) user_counter[row.timestamp] = {}
    //   if (!user_counter[row.timestamp][row.value]) user_counter[row.timestamp][row.value] = 0
    //   user_counter[row.timestamp][row.value] += 1
    // })

    let periodical_user_counter = {}
    Object.each(user_counter, function (val, ts) {
      if (ts < smallest_start) {
        delete user_counter[ts]
      } else {
        Object.each(val, function (data, user) {
          if (!periodical_user_counter[user]) periodical_user_counter[user] = 0
          periodical_user_counter[user] += data
        })
      }
    })

    /**
    * Static & Dynamic types
    **/
    // Array.each(_data[0].data.pathname, function (row, index) {
    //   let value = (static_types.test(row.value)) ? 'static' : 'dynamic'
    //   // debug('TYPE %o', row.value, type)
    //   if (!type_counter[row.timestamp]) type_counter[row.timestamp] = {}
    //   if (!type_counter[row.timestamp][value]) type_counter[row.timestamp][value] = 0
    //   type_counter[row.timestamp][value] += 1
    // })

    let periodical_type_counter = {}
    Object.each(type_counter, function (val, ts) {
      if (ts < smallest_start) {
        delete type_counter[ts]
      } else {
        Object.each(val, function (data, type) {
          if (!periodical_type_counter[type]) periodical_type_counter[type] = 0
          periodical_type_counter[type] += data
        })
      }
    })

    /**
    * referer
    **/
    // Array.each(_data[0].data.referer, function (row, index) {
    //   // debug('REFERER %o', row.value)
    //   let value = (row.value.referer) ? row.value.referer + ' - ' + row.value.medium : row.value.medium
    //   if (!referer_counter[row.timestamp]) referer_counter[row.timestamp] = {}
    //   if (!referer_counter[row.timestamp][value]) referer_counter[row.timestamp][value] = 0
    //   referer_counter[row.timestamp][value] += 1
    // })

    let periodical_referer_counter = {}
    Object.each(referer_counter, function (val, ts) {
      if (ts < smallest_start) {
        delete referer_counter[ts]
      } else {
        Object.each(val, function (data, referer) {
          if (!periodical_referer_counter[referer]) periodical_referer_counter[referer] = 0
          periodical_referer_counter[referer] += data
        })
      }
    })

    /**
    * User Agent
    **/
    // Array.each(_data[0].data.user_agent, function (row, index) {
    //   // debug('OS %s', row.value.os.family)
    //
    //   let os = row.value.os.family
    //
    //   user_agent_os_family_counter[row.timestamp] = os
    //
    //   os = (row.value.os.major) ? os + ' ' + row.value.os.major : os
    //   // os = (row.value.os.minor) ? os + '.' + row.value.os.minor : os
    //   user_agent_os_counter[row.timestamp] = os
    //
    //   let engine = row.value.engine.family
    //   engine = (row.value.engine.major) ? engine + ' ' + row.value.engine.major : engine
    //   engine = (row.value.engine.minor) ? engine + '.' + row.value.engine.minor : engine
    //   engine = (row.value.engine.patch) ? engine + '.' + row.value.engine.patch : engine
    //
    //   user_agent_engine_counter[row.timestamp] = engine
    //
    //   let browser = row.value.ua.family
    //   browser = (row.value.ua.major) ? browser + ' ' + row.value.ua.major : browser
    //   browser = (row.value.ua.minor) ? browser + '.' + row.value.ua.minor : browser
    //   browser = (row.value.ua.patch) ? browser + '.' + row.value.ua.patch : browser
    //   browser = (row.value.ua.type) ? browser + ' ' + row.value.ua.type : browser
    //
    //   user_agent_browser_counter[row.timestamp] = browser
    //
    //   // let device = row.value.device.family
    //   // device = (row.value.device.brand) ? device + ' ' + row.value.device.brand : device
    //   // device = (row.value.device.model) ? device + '.' + row.value.device.model : device
    //   // device = (row.value.device.type) ? device + '.' + row.value.device.type : device
    //
    //   let device = (row.value.device.brand) ? row.value.device.brand : row.value.device.family
    //   device = (row.value.device.model) ? device + ' ' + row.value.device.model : device
    //   device = (row.value.device.type) ? device + ' - ' + row.value.device.type : device
    //
    //   user_agent_device_counter[row.timestamp] = device
    // })

    // let periodical_user_agent_os_counter = {}
    // let periodical_user_agent_os_family_counter = {}
    // let periodical_user_agent_engine_counter = {}
    // let periodical_user_agent_browser_counter = {}
    // let periodical_user_agent_device_counter = {}

    // Object.each(user_agent_os_family_counter, function (val, ts) {
    //   if (ts < smallest_start) {
    //     // delete user_agent_os_counter[ts]
    //     delete user_agent_os_family_counter[ts]
    //   } else {
    //     let family = user_agent_os_family_counter[ts]
    //     let engine = user_agent_engine_counter[ts]
    //     let browser = user_agent_browser_counter[ts]
    //     let device = user_agent_device_counter[ts]
    //
    //     if (!periodical_user_agent_os_counter[val]) periodical_user_agent_os_counter[val] = 0
    //     if (!periodical_user_agent_os_family_counter[family]) periodical_user_agent_os_family_counter[family] = 0
    //     if (!periodical_user_agent_engine_counter[engine]) periodical_user_agent_engine_counter[engine] = 0
    //     if (!periodical_user_agent_browser_counter[browser]) periodical_user_agent_browser_counter[browser] = 0
    //     if (!periodical_user_agent_device_counter[device]) periodical_user_agent_device_counter[device] = 0
    //
    //     // periodical_user_agent_os_counter[val] += 1
    //     periodical_user_agent_os_family_counter[family] += 1
    //     periodical_user_agent_engine_counter[engine] += 1
    //     periodical_user_agent_browser_counter[browser] += 1
    //     periodical_user_agent_device_counter[device] += 1
    //   }
    // })

    let periodical_user_agent_os_counter = {}
    // let periodical_user_agent_os_family_counter = {}
    let periodical_user_agent_engine_counter = {}
    let periodical_user_agent_browser_counter = {}
    let periodical_user_agent_device_counter = {}

    Object.each(user_agent_os_counter, function (val, ts) {
      if (ts < smallest_start) {
        delete user_agent_os_counter[ts]
      } else {
        Object.each(val, function (data, os) {
          if (!periodical_user_agent_os_counter[os]) periodical_user_agent_os_counter[os] = 0
          periodical_user_agent_os_counter[os] += data
        })
      }
    })

    Object.each(user_agent_engine_counter, function (val, ts) {
      if (ts < smallest_start) {
        delete user_agent_engine_counter[ts]
      } else {
        Object.each(val, function (data, engine) {
          if (!periodical_user_agent_engine_counter[engine]) periodical_user_agent_engine_counter[engine] = 0
          periodical_user_agent_engine_counter[engine] += data
        })
      }
    })

    Object.each(user_agent_device_counter, function (val, ts) {
      if (ts < smallest_start) {
        delete user_agent_device_counter[ts]
      } else {
        Object.each(val, function (data, device) {
          if (!periodical_user_agent_device_counter[device]) periodical_user_agent_device_counter[device] = 0
          periodical_user_agent_device_counter[device] += data
        })
      }
    })

    Object.each(user_agent_browser_counter, function (val, ts) {
      if (ts < smallest_start) {
        delete user_agent_browser_counter[ts]
      } else {
        Object.each(val, function (data, browser) {
          if (!periodical_user_agent_browser_counter[browser]) periodical_user_agent_browser_counter[browser] = 0
          periodical_user_agent_browser_counter[browser] += data
        })
      }
    })

    let top_city_counter = {}
    let _top_city_counter = []
    Object.each(periodical_city_counter, function (data, city) {
      _top_city_counter.push(data)
    })

    _top_city_counter = _top_city_counter.sort((a, b) => b - a)

    for (let i = 0; i < TOP; i++) {
      let value = _top_city_counter[i]

      Object.each(periodical_city_counter, function (data, city) {
        if (data === value) {
          top_city_counter[city] = data
        }
      })
    }

    let top_country_counter = {}
    let _top_country_counter = []
    Object.each(periodical_country_counter, function (data, country) {
      _top_country_counter.push(data)
    })

    _top_country_counter = _top_country_counter.sort((a, b) => b - a)

    for (let i = 0; i < TOP; i++) {
      let value = _top_country_counter[i]

      Object.each(periodical_country_counter, function (data, country) {
        if (data === value) {
          top_country_counter[country] = data
        }
      })
    }

    let top_host_counter = {}
    let _top_host_counter = []
    Object.each(host_counter, function (data, host) {
      _top_host_counter.push(data)
    })

    _top_host_counter = _top_host_counter.sort((a, b) => b - a)

    for (let i = 0; i < TOP; i++) {
      let value = _top_host_counter[i]

      Object.each(host_counter, function (data, host) {
        if (data === value) {
          top_host_counter[host] = data
        }
      })
    }

    let top_domain_counter = {}
    let _top_domain_counter = []
    Object.each(domain_counter, function (data, domain) {
      _top_domain_counter.push(data)
    })

    _top_domain_counter = _top_domain_counter.sort((a, b) => b - a)

    for (let i = 0; i < TOP; i++) {
      let value = _top_domain_counter[i]

      Object.each(domain_counter, function (data, domain) {
        if (data === value) {
          top_domain_counter[domain] = data
        }
      })
    }

    let unique_visitors = 0
    let unique_visitors_by_ip = {}
    Object.each(unique_visitors_ip_uas, function (uas, ip) {
      // debug('user_agent|remote_addr %s %o', ip, uas)
      unique_visitors += uas.length
      unique_visitors_by_ip[ip] = uas.length
    })

    debug('PERIODICAL HOST CALLBACK data %s %o %o', key, host_counter, domain_counter)

    if (logs.length > 0) {
      // vm.logs = logs
      vm.$set(vm.periodical, 'logs', logs)
      vm.loading_logs = false
    }

    vm.$set(vm.periodical, 'host_counter', host_counter)
    vm.$set(vm.periodical, 'domain_counter', domain_counter)

    vm.$set(vm.periodical, 'top_host_counter', top_host_counter)
    vm.$set(vm.periodical, 'top_domain_counter', top_domain_counter)

    vm.$set(vm.periodical, 'timestamp', timestamp)
    vm.$set(vm.periodical, 'range', range)

    vm.$set(vm.periodical, 'total_bytes_sent', periodical_total_bytes_sent)
    vm.$set(vm.periodical, 'total_requests', periodical_total_requests)

    vm.$set(vm.periodical, 'current_bytes_sent', current_bytes_sent)

    vm.$set(vm.periodical, 'status_counter', periodical_status_counter)

    vm.$set(vm.periodical, 'city_counter', periodical_city_counter)
    vm.$set(vm.periodical, 'country_counter', periodical_country_counter)

    vm.$set(vm.periodical, 'top_city_counter', top_city_counter)
    vm.$set(vm.periodical, 'top_country_counter', top_country_counter)

    vm.$set(vm.periodical, 'continent_counter', periodical_continent_counter)

    vm.$set(vm.periodical, 'world_map_cities', periodical_world_map_city_counter)
    vm.$set(vm.periodical, 'top_world_map_cities', periodical_top_world_map_city_counter)

    vm.$set(vm.periodical, 'world_map_countries', periodical_world_map_country_counter)
    vm.$set(vm.periodical, 'top_world_map_countries', periodical_top_world_map_country_counter)

    vm.$set(vm.periodical, 'addr_counter', periodical_addr_counter)

    vm.$set(vm.periodical, 'unique_visitors', unique_visitors)
    vm.$set(vm.periodical, 'unique_visitors_by_ip', unique_visitors_by_ip)

    vm.$set(vm.periodical, 'user_counter', periodical_user_counter)
    vm.$set(vm.periodical, 'referer_counter', periodical_referer_counter)
    vm.$set(vm.periodical, 'type_counter', periodical_type_counter)

    vm.$set(vm.periodical, 'user_agent_os_counter', periodical_user_agent_os_counter)
    // vm.$set(vm.periodical, 'user_agent_os_family_counter', periodical_user_agent_os_family_counter)
    vm.$set(vm.periodical, 'user_agent_engine_counter', periodical_user_agent_engine_counter)
    vm.$set(vm.periodical, 'user_agent_browser_counter', periodical_user_agent_browser_counter)
    vm.$set(vm.periodical, 'user_agent_device_counter', periodical_user_agent_device_counter)
  }
  // else if (/historical/.test(key) && data.logs_historical && Object.getLength(data.logs_historical) > 0) {
  //   // debug('HISTORICAL HOST CALLBACK data %s %o', key, data)
  //   let type
  //   let vm_data = {}
  //   Object.each(data.logs_historical, function (row) {
  //     if (!type) type = row.metadata.type
  //     Object.each(row.data, function (row_data, prop) {
  //       if (!vm_data[prop]) {
  //         vm_data[prop] = JSON.parse(JSON.stringify(row_data[0].value))
  //       } else if (row_data[0] && row_data[0].value) {
  //         // if (prop === 'user_agent') {
  //         //   // debug('HISTORICAL HOST CALLBACK data %s %s %o %o', key, type, prop, vm_data[prop], row_data)
  //         //   debug('HISTORICAL HOST CALLBACK data %s %s %o %o', key, type, prop)
  //         //   vm_data[prop] = _merge(prop, vm_data[prop], JSON.parse(JSON.stringify(row_data[0].value)))
  //         // }
  //         vm_data[prop] = _merge(prop, vm_data[prop], JSON.parse(JSON.stringify(row_data[0].value)))
  //         // debug('HISTORICAL HOST CALLBACK data %s %s %o', key, type, prop, row_data)
  //       }
  //     })
  //
  //     if (Object.getLength(vm_data) > 0) {
  //       vm[type] = vm_data
  //     }
  //   })
  //
  //   debug('HISTORICAL HOST CALLBACK data %s %s %o', key, type, vm_data)
  //   // data = data.logs_historical[0]
  //
  //   // if (/minute/.test(key)){
  //   //   const START = END - MINUTE
  //   // }
  // }
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

      let filter = "this.r.row('metadata')('tag').contains('web').and("

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

          filter += ')' // -> this.r.row('metadata')('tag').contains('web').and(

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
        //   filter += ')' // -> this.r.row('metadata')('tag').contains('web').and(
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
        //   filter += ')' // -> this.r.row('metadata')('tag').contains('web').and(
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
        //   filter += ')' // -> this.r.row('metadata')('tag').contains('web').and(
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
