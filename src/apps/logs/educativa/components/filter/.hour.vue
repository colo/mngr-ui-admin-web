<template>
  <div>
    <!-- <q-toolbar class="text-primary">
      <q-toolbar-title>
        From: {{ format_time(hour.range.start) }} - To: {{ format_time(hour.range.end) }} / Updated on: {{ format_time(hour.timestamp) }}
      </q-toolbar-title>
      <template>
        <div class="q-pa-md">

          <q-btn flat dense icon="access_time" />
          <q-popup-proxy v-model="showHour" ref="qHourProxy" transition-show="scale" transition-hide="scale">
              <q-time
                v-model="selected_hour"
                :options="disabled_hours"
                now-btn
                />
          </q-popup-proxy>

        </div>
      </template>
    </q-toolbar>
    <component
      :is="'chart-tabular'"
      :wrapper="{
        type: 'amchartsBarRace',
        props:{
          categoryY: 'domain',
          valueX: 'hits',
          label: 'Hour Per DOMAIN - CGI count',
          zoom: apply_zoom,
          colorScheme: colorScheme,
          dark: dark,
        }
      }"
      :always_update="false"
      :ref="'hour_per_domain_sum'"
      :id="'hour_per_domain_sum'"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour_per_domain_sum'"
      :stat="{
        data: [
          hour.top_per_domain
        ],
        length: 1,
        numeric: false
      }"
      :reactive="false"
      :no_buffer="false"
    >
    </component>

    <component
      :is="'chart-tabular'"
      :wrapper="{
        type: 'amchartsBarRace',
        props:{
          categoryY: 'host',
          valueX: 'hits',
          label: 'Hour Per HOST - CGI count',
          zoom: apply_zoom,
          colorScheme: colorScheme,
          dark: dark,
        }
      }"
      :always_update="false"
      :ref="'hour_per_host_sum'"
      :id="'hour_per_host_sum'"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour_per_host_sum'"
      :stat="{
        data: [
          hour.top_per_host
        ],
        length: 1,
        numeric: false
      }"
      :reactive="false"
      :no_buffer="false"
    >
    </component> -->
    <div :style="{height: (height + 100) + 'px', 'margin-top': '25px'}">
      <grid-view
        v-if="grid.layouts && Object.getLength(components) > 0"
        :swap_components="true"
        :id="id+'HourGrid'"
        :components="components"
        :grid="grid"
        v-on:height="setHeight"
      />
    </div>
  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:educativa:components:filter:hour')

import { date } from 'quasar'

import DataSourcesMixin from '@mixins/dataSources'
import chartTabular from '@components/chart.tabular'
// import chart from '@components/chart'

import JSPipeline from 'js-pipeline'

import HourPipeline from '@apps/logs/educativa/pipelines/filter/hour'

import * as HourSources from '@apps/logs/educativa/sources/filter/hour/index'

import moment from 'moment'

import { mapState } from 'vuex'

import CgiCount from '@apps/logs/educativa/components/cgiCount'
import DomainCgiCount from '@apps/logs/educativa/components/domainCgiCount'
import DomainTotalDuration from '@apps/logs/educativa/components/domainTotalDuration'
import HostTotalDuration from '@apps/logs/educativa/components/hostTotalDuration'
import HostCgiCount from '@apps/logs/educativa/components/hostCgiCount'
import Toolbar from '@apps/logs/educativa/components/filter/hour/toolbar'

import GridView from '@components/gridView'

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
  d.setHours(0)

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
    CgiCount,
    DomainCgiCount,
    DomainTotalDuration,
    HostTotalDuration,
    HostCgiCount,
    Toolbar
  },

  name: 'LogsEducativaFilterHour',

  _logsEducativaFilterHour_components: {
    range: {
      source: {
        requests: HourSources.requests
        // store: store
      }
    }
  },

  data () {
    return {
      id: 'logs.educativa.filter.hour',
      path: 'all',
      height: 0,

      current_hour: undefined,

      top: 15,

      // selected_hour: date.formatDate(Date.now(), 'HH') + ':00',

      showCalendar: false,
      showHour: false,

      hour: {
        top_per_domain: {},
        top_per_host: {},
        per_domain: {},
        per_host: {},
        range: { start: 0, end: 0},
        timestamp: 0,
        cgi_count: {},
        top_cgi_count: {},
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
      pipeline_id: [
        'input.logs.educativa.filter.hour',
      ],

      grid: {
        layouts: {
          'lg': [
            { x: 0, y: 0, w: 24, h: 5, i: 'toolbar', immobile: false },
            { x: 0, y: 5, w: 12, h: 36, i: 'domainCgiCount', immobile: false },
            // { x: 12, y: 1, w: 12, h: 36, i: 'domainCgiCountSum', immobile: false },
            { x: 12, y: 5, w: 12, h: 36, i: 'hostCgiCount', immobile: false },
            // { x: 12, y: 2, w: 12, h: 36, i: 'hostCgiCountSum', immobile: false },
            { x: 0, y: 41, w: 12, h: 36, i: 'domainTotalDuration', immobile: false },
            { x: 12, y: 41, w: 12, h: 36, i: 'hostTotalDuration', immobile: false },
            // { x: 12, y: 3, w: 12, h: 36, i: 'domainTotalDurationSum', immobile: false },
            { x: 0, y: 77, w: 12, h: 36, i: 'cgiCount', immobile: false },
            // { x: 12, y: 4, w: 12, h: 36, i: 'cgiCountSum', immobile: false },
            // { x: 0, y: 5, w: 24, h: 50, i: 'logs', immobile: false },
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
        'toolbar': [
          {
            component: Toolbar,
            events: {
              selected_hour: 'selected_hour'
            }
          }
        ],
        'domainCgiCount': [
          {
            component: DomainCgiCount,
            props: {
              type: 'hour',
              valueX: 'hits'
            }
          }

        ],
        // 'domainCgiCountSum': [
        //   {
        //     component: DomainCgiCount,
        //     props: {
        //       type: 'hour',
        //       sum: true
        //     }
        //   }
        //
        // ],
        'hostCgiCount': [
          {
            component: HostCgiCount,
            props: {
              type: 'hour',
              valueX: 'hits'
            }
          }

        ],
        // 'hostCgiCountSum': [
        //   {
        //     component: HostCgiCount,
        //     props: {
        //       type: 'hour',
        //       sum: true
        //     }
        //   }
        //
        // ],
        'domainTotalDuration': [
          {
            component: DomainTotalDuration,
            props: {
              type: 'hour',
              valueX: 'duration'
            }
          }

        ],
        'hostTotalDuration': [
          {
            component: HostTotalDuration,
            props: {
              type: 'hour',
              valueX: 'duration'
            }
          }

        ],
        // 'domainTotalDurationSum': [
        //   {
        //     component: DomainTotalDuration,
        //     props: {
        //       type: 'hour',
        //       sum: true
        //     }
        //   }
        //
        // ],
        'cgiCount': [
          {
            component: CgiCount,
            props: {
              type: 'hour',
            }
          }

        ],
        // 'cgiCountSum': [
        //   {
        //     component: CgiCount,
        //     props: {
        //       type: 'hour',
        //       sum: true
        //     }
        //   }
        //
        // ],

        // 'logs': [
        //   {
        //     component: LogsTable,
        //
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

    hour: {
      handler: function (hour) {
        if (hour && Object.getLength(hour) > 0) {
          debug('watch hour', hour)
          this.$set(this.components.toolbar[0].props, 'range', hour.range)
          this.$set(this.components.toolbar[0].props, 'timestamp', hour.timestamp)

          this.$set(this.components.domainCgiCount[0].props, 'top_per_domain', hour.top_per_domain)
          // this.$set(this.components.domainCgiCountSum[0].props, 'top_per_domain', hour.top_per_domain)

          this.$set(this.components.hostCgiCount[0].props, 'top_per_host', hour.top_per_host)
          // this.$set(this.components.hostCgiCountSum[0].props, 'top_per_host', hour.top_per_host)

          this.$set(this.components.domainTotalDuration[0].props, 'top_per_domain', hour.top_per_domain)
          this.$set(this.components.hostTotalDuration[0].props, 'top_per_host', hour.top_per_host)
          // this.$set(this.components.domainTotalDurationSum[0].props, 'top_per_domain', hour.top_per_domain)

          this.$set(this.components.cgiCount[0].props, 'top_cgi_count', hour.top_cgi_count)

          // this.$set(this.components.cgiCountSum[0].props, 'top_cgi_count', hour.top_cgi_count)

          // this.$set(this.components.hostCgiCount[0].props, 'top_per_host', hour.top_per_host)

          //   Array.each(hour.top_world_map_cities, function (value) {
          //     if (value !== undefined) {
          //       let city = value.title.substring(0, value.title.indexOf('(')).trim()
          //
          //       if (!this.cities_color[city]) {
          //         let index = 0
          //
          //         // debug('watch hour', colorSet.list)
          //
          //         Object.each(hour.top_city_counter, function (value, city) {
          //           this.cities_color[city] = colorSet.getIndex(index).rgba
          //
          //           index++
          //           if (index > colorSet.list.length) { index = 0 }
          //         }.bind(this))
          //       }
          //
          //       value.color = this.cities_color[city]
          //     }
          //   }.bind(this))
          //
          //   this.$set(this.components.worldCitiesMap[0].props, 'world_map_cities', hour.top_world_map_cities)
          //
          //   Array.each(hour.top_world_map_countries, function (value) {
          //     if (value !== undefined) {
          //       let country = value.name.trim()
          //
          //       if (!this.countries_color[country]) {
          //         let index = 0
          //
          //         // debug('watch hour', colorSet.list)
          //
          //         Object.each(hour.top_country_counter, function (value, country) {
          //           this.countries_color[country] = colorSet.getIndex(index).rgba
          //
          //           index++
          //           if (index > colorSet.list.length) { index = 0 }
          //         }.bind(this))
          //       }
          //
          //       value.color = this.countries_color[country]
          //     }
          //   }.bind(this))
          //
          //   this.$set(this.components.worldCountriesMap[0].props, 'world_map_countries', hour.top_world_map_countries)
          //
          //
          //   this.$set(this.components.topCity[0].props, 'top_city_counter', hour.top_city_counter)
          //   this.$set(this.components.topCitySum[0].props, 'top_city_counter', hour.top_city_counter)
          //
          // this.$set(this.components.logs[0].props, 'logs', hour.logs)
          // this.$set(this.components.logs[0].props, 'loading_logs', this.loading_logs)
        }
      },
      deep: true
    }
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
    'type': function () {
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
      return (this.filter && this.type) ? this.filter[this.type] : undefined
    }
  },

  created: function () {
    debug('created')
    // this.$on('grid.' + this.id + ':height', this.setHeight.bind(this))
  },

  mounted: function () {
    debug('mounted', this.$refs)
    this.$on('grid.' + this.id + ':height', this.setHeight.bind(this))
    // this.$on('grid.' + this.id + ':destroy_pipelines', function () {
    //   debug('event')
    // })

    Object.each(this.components, function (gridItem, name) {
      Array.each(this.components[name], function (component, index) {
        this.$set(this.components[name], index, Object.merge(this.components[name][index], {
          id: this.id + '.hour.' + name + '.component',
          props: {
            dark: this.dark,
            colorScheme: this.colorScheme,
          }
        }))
      }.bind(this))
    }.bind(this))
  },
  methods: {
    selected_hour: function (selected_hour) {
      debug('selected_hour %s', new Date(moment(selected_hour, 'hh:mm').unix() * 1000))
      if (roundMinutes(moment(selected_hour, 'hh:mm').unix() * 1000) === roundMinutes(Date.now())) {
        this.current_hour = undefined
      } else {
        this.current_hour = (moment(selected_hour, 'hh:mm').unix() * 1000) + HOUR
      }
      // this.$nextTick(function () {
      this.destroy_pipelines('input.logs.educativa.filter.hour')
      this.create_pipelines('input.logs.educativa.filter.hour')
      this.resume_pipelines('input.logs.educativa.filter.hour')
      // }.bind(this))

      // this.convertedDates = `${start} - ${end}`
      // debug('startEndDates', this.end)
    },
    setHeight: function (height) {
      debug('setHeight', height)
      // this.height = height + 200 + 'px'
      this.height = height
    },

    end_hour: function () {
      if (this.current_hour === undefined) {
        return Date.now()
      } else {
        return this.current_hour
      }
    },

    // apply_zoom: function (data, categoryY, valueX) {
    //   const min_zoom = 0.5
    //   const max_zoom = 1
    //   /* const min_length = 8 */
    //   const max_length = 15
    //   let length = data.length
    //   /* let zoom = 1 */
    //
    //   if (data.length <= max_length) {
    //     return max_zoom
    //   } else {
    //     // let itemsWithNonZero = 0
    //     // for (let i = 0; i < max_length; i++) {
    //     //   if (data[i][valueX] > 0) {
    //     //     itemsWithNonZero++
    //     //   }
    //     // }
    //
    //     // let zoom = max_length / data.length
    //     // return (zoom > min_zoom) ? zoom : min_zoom
    //     return (max_length / data.length < min_zoom) ? min_zoom : max_length / data.length
    //   }
    // },
    // format_time: function (timestamp) {
    //   return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
    // },
    // format_log: function (log) {
    //   return (log.length <= 100) ? log : log.substring(0, 96) + '...'
    // },
    /**
    * @start pipelines
    **/
    create_pipelines: function (create_id, next) {
      debug('create_pipelines %o', this.$options.pipelines)

      // if (
      //   this.$options.pipelines['input.logs.educativa.filter.periodical'] &&
      //   this.$options.pipelines['input.logs.educativa.filter.periodical'].get_input_by_id('input.logs.educativa.filter.periodical')
      // ) {
      //   // let requests = this.__components_sources_to_requests(this.components)
      //   // if (requests.once) {
      //   //   this.$options.pipelines['input.logs.educativa.filter'].get_input_by_id('input.system').conn_pollers[0].options.requests.once.combine(requests.once)
      //   //   this.$options.pipelines['input.logs.educativa.filter'].get_input_by_id('input.system').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
      //   // }
      //   //
      //   // if (requests.periodical) {
      //   //   this.$options.pipelines['input.logs.educativa.filter'].get_input_by_id('input.system').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
      //   //   this.$options.pipelines['input.logs.educativa.filter'].get_input_by_id('input.system').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
      //   // }
      // } else {
      const pipelines = [HourPipeline]
      Array.each(pipelines, function (Pipeline) {
        let template = Object.clone(Pipeline)

        debug('create_pipelines template %o', template)

        let pipeline_id = template.input[0].poll.id
        if (!create_id || create_id === undefined || create_id === pipeline_id) {
          // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
          Array.each(template.input[0].poll.conn, function (conn, index) {
            template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.$options._logsEducativaFilterHour_components, pipeline_id)
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

    // disabled_hours (hr, min, sec) {
    //   debug('disabled_hours ', hr, min, sec)
    //   if (hr) {
    //     if (min) {
    //       return false
    //     }
    //     return hr <= moment().format('HH')
    //   }
    //
    //   // if (sec !== null && sec % 10 !== 0) {
    //   //   return false
    //   // }
    //   return true
    // },

  }

}
</script>
