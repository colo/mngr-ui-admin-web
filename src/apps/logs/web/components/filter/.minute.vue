<template>
  <q-card flat>
    <q-card-section>
      <tool-bar :range="historical.range" :timestamp="historical.timestamp" :type="'minute'" @selected_minute="selected_minute"/>
    </q-card-section>

    <q-card-section>
      <info-bar :values="infoBarValues" :type="'minute'"/>
    </q-card-section>

    <q-card-section>
      <!-- <div :style="{height: (height + 100) + 'px', 'margin-top': '25px'}"> -->
      <div :style="{height: height  + 'px'}">
        <grid-view
          v-if="grid.layouts && Object.getLength(components) > 0"
          :swap_components="true"
          :id="id+'MinuteGrid'"
          :components="components"
          :grid="grid"
          v-on:height="setHeight"
        />
      </div>
    </q-card-section>

  </q-card>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:web:components:filter:minute')

import { date } from 'quasar'

import DataSourcesMixin from '@mixins/dataSources'
import chartTabular from '@components/chart.tabular'

import JSPipeline from 'js-pipeline'

import MinutePipeline from '@apps/logs/web/pipelines/filter/minute'
import * as MinuteSources from '@apps/logs/web/sources/filter/historical/index'

import moment from 'moment'

import { mapState } from 'vuex'

import WorldCitiesMap from '@apps/logs/web/components/worldCitiesMap'
import WorldCountriesMap from '@apps/logs/web/components/worldCountriesMap'
import TopCountry from '@apps/logs/web/components/topCountry'
import TopContinent from '@apps/logs/web/components/topContinent'
import TopCity from '@apps/logs/web/components/topCity'
import ToolBar from '@apps/logs/web/components/filter/minute/toolbar'
import InfoBar from '@apps/logs/web/components/infoBar'
// import LogsTable from '@apps/logs/web/components/filter/periodical/logsTable'

import GridView from '@components/gridView'

import * as am4core from '@amcharts/amcharts4/core'
const colorSet = new am4core.ColorSet()

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

export default {
  mixins: [DataSourcesMixin],

  components: {
    chartTabular,
    GridView,
    WorldCitiesMap,
    WorldCountriesMap,
    TopCountry,
    TopContinent,
    TopCity,
    ToolBar,
    InfoBar,
  },

  name: 'LogsWebFilterMinute',

  _logsWebFilterMinute_components: {
    range: {
      source: {
        requests: MinuteSources.requests
        // store: store
      }
    }
  },

  data () {
    return {
      type: 'minute',
      id: 'logs.web.filter.minute',
      path: 'all',
      height: 0,

      infoBarValues: {},

      cities_color: {},
      countries_color: {},

      current_minute: undefined,
      top: 15,

      /** calendar **/

      // selected_minute: date.formatDate(Date.now(), 'HH:mm'),

      showCalendar: false,

      showMinute: false,

      historical: {
        top_host_counter: {},
        top_domain_counter: {},

        host_counter: {},
        domain_counter: {},

        total_bytes_sent: 0,
        total_requests: 0,

        top_city_counter: {},
        top_country_counter: {},
        // top_continent_counter: {},

        per_domain: {},
        per_host: {},
        range: { start: 0, end: 0},
        timestamp: 0,
        city_counter: {},
        country_counter: {},
        continent_counter: {},

        world_map_cities: [],
        top_world_map_cities: [],

        world_map_countries: [],
        top_world_map_countries: [],

        // body_bytes_sent: {},
        // geoip: {},
        // qs: {},
        // referer: {},
        // pathname: {},
        // method: {},
        // remote_addr: {},
        // remote_user: {},
        // status: {},
        // unique_visitors: 0,
        // unique_visitors_by_ip: {},
        // user_agent: {},
        //
        // type_counter: {}
      },

      store: false,
      // pipeline_id: 'input.logs.web.filter',
      pipeline_id: [
        'input.logs.web.filter.minute',
      ],

      grid: {
        layouts: {
          'lg': [
            // { x: 0, y: 0, w: 24, h: 5, i: 'toolbar', immobile: false },

            { x: 0, y: 0, w: 12, h: 36, i: 'topCountry', immobile: false },
            { x: 12, y: 0, w: 12, h: 36, i: 'worldCountriesMap', immobile: false },
            { x: 0, y: 1, w: 12, h: 36, i: 'worldCitiesMap', immobile: false },
            { x: 12, y: 1, w: 12, h: 36, i: 'topCity', immobile: false },
            { x: 0, y: 2, w: 12, h: 36, i: 'continent', immobile: false },
            // { x: 12, y: 3, w: 12, h: 36, i: 'topCitySum', immobile: false },
            // { x: 0, y: 4, w: 24, h: 50, i: 'logs', immobile: false },
            // { x: 15, y: 0, w: 6, h: 10, i: 'mounts', immobile: false },
            // { x: 21, y: 0, w: 3, h: 10, i: 'memory', immobile: false },
            // // { x: 0, y: 1, w: 12, h: 2, i: 'separator' }
          ],
          'md': [
            // { x: 0, y: 0, w: 4, h: 10, i: 'loadavg', immobile: false },
            // { x: 4, y: 0, w: 4, h: 10, i: 'netOut', immobile: false },
            // { x: 8, y: 0, w: 4, h: 10, i: 'netIn', immobile: false },
            // { x: 12, y: 0, w: 4, h: 10, i: 'memory', immobile: false },
            //
            // { x: 0, y: 1, w: 8, h: 15, i: 'cpu', immobile: false },
            // { x: 8, y: 1, w: 8, h: 10, i: 'mounts', immobile: false },
            //
            // // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
          ],
          'sm': [
            // { x: 0, y: 0, w: 3, h: 10, i: 'loadavg', immobile: false },
            // { x: 3, y: 0, w: 3, h: 10, i: 'netOut', immobile: false },
            // { x: 6, y: 0, w: 3, h: 10, i: 'netIn', immobile: false },
            // { x: 9, y: 0, w: 3, h: 10, i: 'memory', immobile: false },
            //
            // { x: 0, y: 1, w: 6, h: 15, i: 'cpu', immobile: false },
            // { x: 6, y: 1, w: 6, h: 10, i: 'mounts', immobile: false },
            //
            // // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
          ],
          'xs': [
            // { x: 0, y: 0, w: 4, h: 10, i: 'loadavg', immobile: false },
            // { x: 4, y: 0, w: 4, h: 10, i: 'memory', immobile: false },
            // { x: 0, y: 1, w: 4, h: 10, i: 'netOut', immobile: false },
            // { x: 4, y: 1, w: 4, h: 10, i: 'netIn', immobile: false },
            // { x: 0, y: 2, w: 8, h: 15, i: 'cpu', immobile: false },
            // { x: 0, y: 3, w: 8, h: 10, i: 'mounts', immobile: false },
            //
            // // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
          ],
          'xxs': [
            // { x: 0, y: 0, w: 3, h: 10, i: 'loadavg', immobile: false },
            // { x: 3, y: 0, w: 3, h: 10, i: 'memory', immobile: false },
            // { x: 0, y: 1, w: 3, h: 10, i: 'netOut', immobile: false },
            // { x: 3, y: 1, w: 3, h: 10, i: 'netIn', immobile: false },
            // { x: 0, y: 2, w: 6, h: 15, i: 'cpu', immobile: false },
            // { x: 0, y: 3, w: 6, h: 10, i: 'mounts', immobile: false },
            //
            // // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
          ]

        },
        breakpoint: 'lg',
        // slots: [
        //   '<q-btn round />'
        // ],

        // cols: 12,
        // // breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
        // colsAll: { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 },

        cols: 22,
        // breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
        colsAll: { lg: 24, md: 16, sm: 12, xs: 8, xxs: 6 },

        isDraggable: true,
        isResizable: false,
        preview: true
      },

      components: {
        // 'toolbar': [
        //   {
        //     component: Toolbar,
        //     events: {
        //       selected_minute: 'selected_minute'
        //     }
        //   }
        // ],
        'topCountry': [
          {
            component: TopCountry,
            props: {
              type: 'minute',
              // // top_country_counter: {},
              // dark: this.dark,
              // colorScheme: this.colorScheme
            }
          }

        ],
        'worldCountriesMap': [
          {
            component: WorldCountriesMap,
            props: {
              type: 'minute',
            }
          }

        ],
        'worldCitiesMap': [
          {
            component: WorldCitiesMap,
            props: {
              type: 'minute',
              // world_map_cities: [],
              // dark: this.dark,
              // colorScheme: this.colorScheme
            }
          }

        ],
        'topCity': [
          {
            component: TopCity,
            props: {
              type: 'minute',
              // // top_city_counter: {},
              // dark: this.dark,
              // colorScheme: this.colorScheme
            }
          }

        ],

        'continent': [
          {
            component: TopContinent,
            props: {
              type: 'minute',
            }
          }

        ],
        // 'topCitySum': [
        //   {
        //     component: TopCity,
        //     props: {
        //       type: 'minute',
        //       sum: true
        //       // // top_city_counter: {},
        //       // dark: this.dark,
        //       // colorScheme: this.colorScheme
        //     }
        //   }
        //
        // ],

      },

    }
  },

  watch: {
    dark: function () {
      Object.each(this.components, function (gridItem, name) {
        Array.each(this.components[name], function (component, index) {
          this.$set(this.components[name], index, Object.merge(this.components[name][index], {
            props: {
              dark: this.dark,
            }

          }))
        }.bind(this))
      }.bind(this))
    },
    colorScheme: function () {
      Object.each(this.components, function (gridItem, name) {
        Array.each(this.components[name], function (component, index) {
          this.$set(this.components[name], index, Object.merge(this.components[name][index], {
            props: {
              colorScheme: this.colorScheme,
            }

          }))
        }.bind(this))
      }.bind(this))
    },

    historical: {
      handler: function (historical) {
        debug('watch historical', historical)

        if (historical && Object.getLength(historical) > 0) {
          // this.$set(this.components.toolbar[0].props, 'range', historical.range)
          // this.$set(this.components.toolbar[0].props, 'timestamp', historical.timestamp)

          this.infoBarValues = historical

          // this.$set(this.components.topCountry, 0, Object.merge(this.components.topCountry[0], {
          //   id: this.id + '.historical.topCountry.component',
          //   props: {
          //     top_country_counter: historical.top_country_counter
          //   }
          //
          // }))
          this.$set(this.components.topCountry[0].props, 'top_country_counter', historical.top_country_counter)
          // this.$set(this.components.topCountrySum[0].props, 'top_country_counter', historical.top_country_counter)

          // this.$set(this.components.worldCitiesMap, 0, Object.merge(this.components.worldCitiesMap[0], {
          //   id: this.id + '.historical.worldCitiesMap.component',
          //   props: {
          //     world_map_cities: historical.world_map_cities,
          //   }
          //
          // }))

          Array.each(historical.top_world_map_cities, function (value) {
            if (value !== undefined) {
              let city = value.title.substring(0, value.title.indexOf('(')).trim()

              if (!this.cities_color[city]) {
                let index = 0

                // debug('watch historical city', city)

                Object.each(historical.top_city_counter, function (value, city) {
                  this.cities_color[city] = colorSet.getIndex(index).rgba

                  index++
                  if (index > colorSet.list.length) { index = 0 }
                }.bind(this))
              }

              value.color = this.cities_color[city]
            }
          }.bind(this))

          this.$set(this.components.worldCitiesMap[0].props, 'world_map_cities', historical.top_world_map_cities)

          Array.each(historical.top_world_map_countries, function (value) {
            if (value !== undefined) {
              let country = value.name.trim()

              if (!this.countries_color[country]) {
                let index = 0

                // debug('watch historical', colorSet.list)

                Object.each(historical.top_country_counter, function (value, country) {
                  this.countries_color[country] = colorSet.getIndex(index).rgba

                  index++
                  if (index > colorSet.list.length) { index = 0 }
                }.bind(this))
              }

              value.color = this.countries_color[country]
            }
          }.bind(this))
          // Change name => title
          // Array.each(historical.top_world_map_countries, function (value) {
          //   if (value !== undefined) {
          //     value.name = value.title
          //   }
          // })

          this.$set(this.components.worldCountriesMap[0].props, 'world_map_countries', historical.top_world_map_countries)

          // this.$set(this.components.topCity, 0, Object.merge(this.components.topCity[0], {
          //   id: this.id + '.historical.topCity.component',
          //   props: {
          //     top_city_counter: historical.top_city_counter
          //   }
          //
          // }))

          // Object.each(historical.top_city_counter, function (value, city) {
          //   if (!this.cities_color[city]) this.cities_color[city] = colorSet.next()
          // }.bind(this))

          this.$set(this.components.topCity[0].props, 'top_city_counter', historical.top_city_counter)
          // this.$set(this.components.topCitySum[0].props, 'top_city_counter', historical.top_city_counter)

          this.$set(this.components.continent[0].props, 'continent_counter', historical.continent_counter)

          // this.$set(this.components.logs[0].props, 'logs', historical.logs)
          // this.$set(this.components.logs[0].props, 'loading_logs', this.loading_logs)

          // debug('watch historical', historical, this.components)

          // this.$set(this.components.netOut, 0, Object.merge(this.components.netOut[0], {
          //   id: this.host + '.netOut.component',
          //   props: {
          //     net: host_data['os.networkInterfaces.out'],
          //     net_max: host_data['os.networkInterfaces.max.out'],
          //     host: this.host
          //   }
          //
          // }))
          //
          // this.$set(this.components.netIn, 0, Object.merge(this.components.netIn[0], {
          //   id: this.host + '.netIn.component',
          //   props: {
          //     net: host_data['os.networkInterfaces.in'],
          //     net_max: host_data['os.networkInterfaces.max.in'],
          //     host: this.host
          //   }
          //
          // }))
          //
          // this.$set(this.components.cpu, 0, Object.merge(this.components.cpu[0], {
          //   id: this.host + '.cpu.component',
          //   props: {
          //     used: host_data['os.cpus.percentage'],
          //     host: this.host
          //   }
          // }))
          //
          // let index = 0
          // this.$set(this.components, 'mounts', [])
          //
          // Object.each(host_data['os.mounts.used'], function (used, mount) {
          //   if (index <= 1) {
          //     this.components.mounts.push({
          //       style: {
          //         'width': (Object.getLength(host_data['os.mounts.used']) === 1) ? '100%' : '50%',
          //         'float': (Object.getLength(host_data['os.mounts.used']) === 1) ? undefined : (index === 0) ? 'left' : 'right'
          //       },
          //       id: this.host + '.' + mount + '.used.component',
          //       props: {
          //         used: used,
          //         mount: mount,
          //         host: this.host
          //       }
          //
          //     })
          //     this.$set(this.components.mounts[index], 'component', Mount)
          //   }
          //
          //   index++
          // }.bind(this))
          //
          // this.$set(this.components.memory, 0, Object.merge(this.components.memory[0], {
          //   id: this.host + '.memory.component',
          //   props: {
          //     used: host_data['os.memory.percentage'],
          //     host: this.host
          //   }
          //
          // }))
        }
      },
      deep: true
    },

    /** calendar **/
    // selected_day () {
    //   debug('selected_day %s', new Date(moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000))
    //   if (roundHours(moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000) === roundHours(Date.now())) {
    //     this.current_day = undefined
    //   } else {
    //     this.current_day = (moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000) + DAY
    //   }
    //   // this.$nextTick(function () {
    //   this.destroy_pipelines('input.logs.educativa.filter.day')
    //   this.create_pipelines('input.logs.educativa.filter.day')
    //   this.resume_pipelines('input.logs.educativa.filter.day')
    //   // }.bind(this))
    //
    //   // this.convertedDates = `${start} - ${end}`
    //   // debug('startEndDates', this.end)
    // },
    // selected_hour () {
    //   debug('selected_hour %s', new Date(moment(this.selected_hour, 'hh:mm').unix() * 1000))
    //   if (roundMinutes(moment(this.selected_hour, 'hh:mm').unix() * 1000) === roundMinutes(Date.now())) {
    //     this.current_hour = undefined
    //   } else {
    //     this.current_hour = (moment(this.selected_hour, 'hh:mm').unix() * 1000) + HOUR
    //   }
    //   // this.$nextTick(function () {
    //   this.destroy_pipelines('input.logs.web.filter.hour')
    //   this.create_pipelines('input.logs.web.filter.hour')
    //   this.resume_pipelines('input.logs.web.filter.hour')
    //   // }.bind(this))
    //
    //   // this.convertedDates = `${start} - ${end}`
    //   // debug('startEndDates', this.end)
    // },
    // selected_minute () {
    //   debug('selected_minute %s', new Date(moment(this.selected_minute, 'hh:mm').unix() * 1000))
    //   if (roundSeconds(moment(this.selected_minute, 'hh:mm').unix() * 1000) === roundSeconds(Date.now())) {
    //     this.current_minute = undefined
    //   } else {
    //     this.current_minute = (moment(this.selected_minute, 'hh:mm').unix() * 1000) + MINUTE
    //   }
    //   // this.$nextTick(function () {
    //   this.destroy_pipelines('input.logs.web.filter.minute')
    //   this.create_pipelines('input.logs.web.filter.minute')
    //   this.resume_pipelines('input.logs.web.filter.minute')
    //   // }.bind(this))
    //
    //   // this.convertedDates = `${start} - ${end}`
    //   // debug('startEndDates', this.end)
    // }
    /** calendar **/
  },

  computed: {
    ...mapState({
      dark: state => state.layout.dark,
      colorScheme: state => state.layout.dashboardColorScheme
    }),
    'filter': function () {
      // return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
      debug('computed filter QUERY', this.$route.query)
      const allowed_filters = ['domain', 'path', 'host']
      let filter = {}
      if (this.$route && this.$route.query) {
        Object.each(this.$route.query, function (value, prop) {
          // if (allowed_filters.indexOf(prop) > -1 && filter === undefined) filter = {}
          if (allowed_filters.indexOf(prop) > -1) filter[prop] = value
        })
      }
      debug('computed filter', filter)
      return filter
    },
    'filterType': function () {
      debug('computed type', Object.keys(this.filter))
      return (this.filter && Object.getLength(this.filter) > 0) ? Object.keys(this.filter)[0] : undefined
    },
    // 'filter': function () {
    //   // return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
    //   return (this.$route && this.$route.query)
    //     ? this.$route.query
    //     : undefined
    // },
    // 'type': function () {
    //   return (this.filter) ? Object.keys(this.filter)[0] : undefined
    // },
    'web': function () {
      return (this.filter && this.filterType) ? this.filter[this.filterType] : undefined
    }
  },

  // watch: {
  //
  //
  // },
  mounted: function () {
    debug('mounted', this.$refs)
    this.$on('grid.' + this.id + ':height', this.setHeight.bind(this))

    // this.$on('grid.' + this.id + ':destroy_pipelines', function () {
    //   debug('event')
    // })

    Object.each(this.components, function (gridItem, name) {
      Array.each(this.components[name], function (component, index) {
        this.$set(this.components[name], index, Object.merge(this.components[name][index], {
          id: this.id + '.minute.' + name + '.component',
          props: {
            dark: this.dark,
            colorScheme: this.colorScheme,
          }
        }))
      }.bind(this))
    }.bind(this))
  },

  methods: {
    selected_minute: function (selected_minute) {
      debug('selected_minute %s', new Date(moment(selected_minute, 'hh:mm').unix() * 1000))
      if (roundSeconds(moment(selected_minute, 'hh:mm').unix() * 1000) === roundSeconds(Date.now())) {
        this.current_minute = undefined
      } else {
        this.current_minute = (moment(selected_minute, 'hh:mm').unix() * 1000) + MINUTE
      }
      // this.$nextTick(function () {
      this.destroy_pipelines('input.logs.web.filter.minute')
      this.create_pipelines('input.logs.web.filter.minute')
      this.resume_pipelines('input.logs.web.filter.minute')
    },
    setHeight: function (height) {
      debug('setHeight', height)
      // this.height = height + 200 + 'px'
      this.height = height
    },
    apply_zoom: function (data, categoryY, valueX) {
      const min_zoom = 0.5
      const max_zoom = 1
      /* const min_length = 8 */
      const max_length = 15
      let length = data.length
      /* let zoom = 1 */

      if (data.length <= max_length) {
        return max_zoom
      } else {
        // let itemsWithNonZero = 0
        // for (let i = 0; i < max_length; i++) {
        //   if (data[i][valueX] > 0) {
        //     itemsWithNonZero++
        //   }
        // }

        // let zoom = max_length / data.length
        // return (zoom > min_zoom) ? zoom : min_zoom
        return (max_length / data.length < min_zoom) ? min_zoom : max_length / data.length
      }
    },

    format_time: function (timestamp) {
      return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
    },
    format_log: function (log) {
      return (log.length <= 100) ? log : log.substring(0, 96) + '...'
    },
    /**
    * @start pipelines
    **/
    create_pipelines: function (create_id, next) {
      debug('create_pipelines %o', this.$options.pipelines)

      const pipelines = [MinutePipeline]
      Array.each(pipelines, function (Pipeline) {
        let template = Object.clone(Pipeline)

        debug('create_pipelines template %o', template)

        let pipeline_id = template.input[0].poll.id
        if (!create_id || create_id === undefined || create_id === pipeline_id) {
          // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
          Array.each(template.input[0].poll.conn, function (conn, index) {
            template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.$options._logsWebFilterMinute_components, pipeline_id)
          }.bind(this))

          let pipe = new JSPipeline(template)

          this.$options.__pipelines_cfg[pipeline_id] = {
            ids: [],
            connected: [],
            suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
          }

          // this.__after_connect_inputs(
          //   pipe,
          //   this.$options.__pipelines_cfg[pipeline_id],
          //   this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.id, function () {
          //     debug('__resume_pipeline CALLBACK')
          //     pipe.fireEvent('onOnce')
          //   }], this)
          // )

          this.$options.pipelines[pipeline_id] = pipe
        }
      }.bind(this))

      debug('create_pipelines %o', this.$options.pipelines)

      if (next) { next() }
      // }
    },

    /**
    * @end pipelines
    **/

    /**
    * use on requests.callback
    **/
    // end: function () {
    //   // if (this.current_day === undefined) {
    //   return Date.now()
    //   // } else {
    //   // return this.current_day
    //   // }
    // },
    // end_minute: function () {
    //   if (this.current_minute === undefined) {
    //     return Date.now()
    //   } else {
    //     return this.current_minute
    //   }
    // },
    end: function () {
      if (this.current_minute === undefined) {
        return Date.now()
      } else {
        return this.current_minute
      }
    },
    round: roundSeconds,

  }

}
</script>
