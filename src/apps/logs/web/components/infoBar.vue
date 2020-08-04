<template>
  <div :style="{height: height + 'px'}">
    <grid-view
      v-if="grid.layouts && Object.getLength(components) > 0"
      :swap_components="true"
      :id="id+'InfoBarGrid'"
      :components="components"
      :grid="grid"
      v-on:height="setHeight"
    />
    <!-- :gridStyle="{margin: 0, padding: 0}" -->
  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:web:components:infoBar')

// import { date } from 'quasar'
//
// import DataSourcesMixin from '@mixins/dataSources'
// import chartTabular from '@components/chart.tabular'
//
// import JSPipeline from 'js-pipeline'
//
// import PeriodicalPipeline from '@apps/logs/web/pipelines/filter/periodical'
//
// import * as PeriodicalSources from '@apps/logs/web/sources/filter/periodical/index'
//
import moment from 'moment'
//
import { mapState } from 'vuex'
//
// import WorldCitiesMap from '@apps/logs/web/components/worldCitiesMap'
// import WorldCountriesMap from '@apps/logs/web/components/worldCountriesMap'
// import TopCountry from '@apps/logs/web/components/topCountry'
// import TopCity from '@apps/logs/web/components/topCity'
// import Toolbar from '@apps/logs/web/components/filter/periodical/toolbar'
// import LogsTable from '@apps/logs/web/components/filter/periodical/logsTable'
// // import BytesTrend from '@apps/logs/web/components/bytesTrend'
// import TopHost from '@apps/logs/web/components/topHost'
// import TopDomain from '@apps/logs/web/components/topDomain'
//
import SmallWidgetBars from '@components/smallWidgetBars'
import SmallWidgetPie from '@components/smallWidgetPie'
// import SmallWidgetTest from '@components/smallWidgetTest'
import MiniWidget from '@components/miniWidget'

import GridView from '@components/gridView'

// import * as am4core from '@amcharts/amcharts4/core'
// const colorSet = new am4core.ColorSet()

// const roundMilliseconds = function (timestamp) {
//   let d = new Date(timestamp)
//   d.setMilliseconds(0)
//
//   return d.getTime()
// }
//
// const roundSeconds = function (timestamp) {
//   timestamp = roundMilliseconds(timestamp)
//   let d = new Date(timestamp)
//   d.setSeconds(0)
//
//   return d.getTime()
// }
//
// const roundMinutes = function (timestamp) {
//   timestamp = roundSeconds(timestamp)
//   let d = new Date(timestamp)
//   d.setMinutes(0)
//
//   return d.getTime()
// }
// const roundHours = function (timestamp) {
//   timestamp = roundMinutes(timestamp)
//   let d = new Date(timestamp)
//   d.setHours(0)
//
//   return d.getTime()
// }
// const SECOND = 1000
// const MINUTE = 60 * SECOND
// const HOUR = 60 * MINUTE
// const DAY = HOUR * 24
// const WEEK = DAY * 7

export default {
  // mixins: [DataSourcesMixin],

  components: {
    // chartTabular,
    GridView,
    // WorldCitiesMap,
    // TopCountry,
    // TopCity,
    // LogsTable,
    // Toolbar,
    // // BytesTrend,
    SmallWidgetBars,
    MiniWidget
  },

  name: 'LogsWebInfoBar',

  // _logsWebFilterPeriodical_components: {
  //   range: {
  //     source: {
  //       requests: PeriodicalSources.requests
  //       // store: store
  //     }
  //   }
  // },

  props: {
    values: {
      type: Object,
      default: function () { return {} }
    },
    type: {
      type: String,
      default: 'periodical'
    }
    // requests: {
    //   type: Object,
    //   default: function () { return {} }
    // },
    // bytes: {
    //   type: Object,
    //   default: function () { return {} }
    // },
    // visitors: {
    //   type: Number,
    //   default: 0
    // },
    // users: {
    //   type: Number,
    //   default: 0
    // },
    // referers: {
    //   type: Number,
    //   default: 0
    // },
    // static: {
    //   type: Number,
    //   default: 0
    // },
    // dynamic: {
    //   type: Number,
    //   default: 0
    // },
    // valid: {
    //   type: Number,
    //   default: 0
    // },
    // failed: {
    //   type: Number,
    //   default: 0
    // }
  },

  data () {
    return {
      id: 'logs.web.infoBar',
      // path: 'all',
      height: 0,

      // top: 15,

      // periodical: {
      //   range: { start: 0, end: 0},
      //
      //   top_host_counter: {},
      //   top_domain_counter: {},
      //
      //   host_counter: {},
      //   domain_counter: {},
      //
      //   top_city_counter: {},
      //   top_country_counter: {},
      //
      //   logs: [],
      //
      //   total_bytes_sent: 0,
      //   total_requests: 0,
      //
      //   current_bytes_sent: 0,
      //
      //   status_counter: {},
      //
      //   city_counter: {},
      //   country_counter: {},
      //   continent_counter: {},
      //   world_map_cities: [],
      //   top_world_map_cities: [],
      //
      //   world_map_countries: [],
      //   top_world_map_countries: [],
      //
      //   addr_counter: {},
      //   user_counter: {},
      //   referer_counter: {},
      //   type_counter: {},
      //
      //   user_agent_os_counter: {},
      //   user_agent_os_family_counter: {},
      //   user_agent_engine_counter: {},
      //   user_agent_browser_counter: {},
      //   user_agent_device_counter: {}
      //
      // },
      //
      // store: false,
      // // pipeline_id: 'input.logs.web.filter',
      // pipeline_id: [
      //   'input.logs.web.filter.periodical',
      // ],
      //
      // cities_color: {},
      // countries_color: {},
      // // logs: [],
      //
      // // search_filter: '',
      // loading_logs: true,

      grid: {
        layouts: {
          'lg': [

            { x: 0, y: 0, w: 3, h: 8, i: 'requestsBars', immobile: false },
            { x: 3, y: 0, w: 3, h: 8, i: 'bytesBars', immobile: false },

            { x: 6, y: 0, w: 3, h: 4, i: 'visitorsMini', immobile: false },
            { x: 6, y: 4, w: 3, h: 4, i: 'usersMini', immobile: false },

            { x: 9, y: 0, w: 3, h: 4, i: 'staticMini', immobile: false },
            { x: 9, y: 4, w: 3, h: 4, i: 'dynamicMini', immobile: false },

            { x: 12, y: 0, w: 3, h: 4, i: 'refererMini', immobile: false },
            { x: 12, y: 4, w: 3, h: 4, i: 'topDomainMini', immobile: false },

            { x: 15, y: 0, w: 3, h: 8, i: 'osPie', immobile: false },
            { x: 18, y: 0, w: 3, h: 8, i: 'browserPie', immobile: false },

            { x: 21, y: 0, w: 3, h: 4, i: 'validMini', immobile: false },
            { x: 21, y: 4, w: 3, h: 4, i: 'failedMini', immobile: false },

          ],
          'md': [
            { x: 0, y: 0, w: 4, h: 8, i: 'requestsBars', immobile: false },
            { x: 4, y: 0, w: 4, h: 8, i: 'bytesBars', immobile: false },
            { x: 8, y: 0, w: 4, h: 4, i: 'visitorsMini', immobile: false },
            { x: 8, y: 4, w: 4, h: 4, i: 'usersMini', immobile: false },
            { x: 12, y: 0, w: 4, h: 4, i: 'staticMini', immobile: false },
            { x: 12, y: 4, w: 4, h: 4, i: 'dynamicMini', immobile: false },

            { x: 0, y: 8, w: 4, h: 4, i: 'refererMini', immobile: false },
            { x: 4, y: 8, w: 4, h: 4, i: 'topDomainMini', immobile: false },
            { x: 8, y: 8, w: 4, h: 4, i: 'validMini', immobile: false },
            { x: 12, y: 8, w: 4, h: 4, i: 'failedMini', immobile: false },

            { x: 0, y: 12, w: 4, h: 8, i: 'osPie', immobile: false },
            { x: 4, y: 12, w: 4, h: 8, i: 'browserPie', immobile: false },

          ],
          'sm': [
            { x: 0, y: 0, w: 3, h: 8, i: 'requestsBars', immobile: false },
            { x: 3, y: 0, w: 3, h: 8, i: 'bytesBars', immobile: false },
            { x: 6, y: 0, w: 3, h: 4, i: 'visitorsMini', immobile: false },
            { x: 6, y: 4, w: 3, h: 4, i: 'usersMini', immobile: false },
            { x: 9, y: 0, w: 3, h: 4, i: 'staticMini', immobile: false },
            { x: 9, y: 4, w: 3, h: 4, i: 'dynamicMini', immobile: false },

            { x: 0, y: 8, w: 3, h: 4, i: 'refererMini', immobile: false },
            { x: 3, y: 8, w: 3, h: 4, i: 'topDomainMini', immobile: false },
            { x: 6, y: 8, w: 3, h: 4, i: 'validMini', immobile: false },
            { x: 9, y: 8, w: 3, h: 4, i: 'failedMini', immobile: false },

            { x: 0, y: 12, w: 6, h: 8, i: 'osPie', immobile: false },
            { x: 6, y: 12, w: 6, h: 8, i: 'browserPie', immobile: false },

          ],
          'xs': [
            { x: 0, y: 0, w: 3, h: 8, i: 'requestsBars', immobile: false },
            { x: 3, y: 0, w: 3, h: 8, i: 'bytesBars', immobile: false },
            { x: 6, y: 0, w: 3, h: 4, i: 'visitorsMini', immobile: false },
            { x: 6, y: 4, w: 3, h: 4, i: 'usersMini', immobile: false },

            { x: 0, y: 8, w: 3, h: 4, i: 'staticMini', immobile: false },
            { x: 3, y: 8, w: 3, h: 4, i: 'dynamicMini', immobile: false },
            { x: 6, y: 8, w: 3, h: 4, i: 'refererMini', immobile: false },

            { x: 0, y: 12, w: 3, h: 4, i: 'topDomainMini', immobile: false },
            { x: 3, y: 12, w: 3, h: 4, i: 'validMini', immobile: false },
            { x: 6, y: 12, w: 3, h: 4, i: 'failedMini', immobile: false },

            { x: 0, y: 16, w: 4, h: 8, i: 'osPie', immobile: false },
            { x: 5, y: 16, w: 4, h: 8, i: 'browserPie', immobile: false },

          ],
          'xxs': [
            { x: 0, y: 0, w: 3, h: 8, i: 'requestsBars', immobile: false },
            { x: 3, y: 0, w: 3, h: 8, i: 'bytesBars', immobile: false },

            { x: 0, y: 8, w: 3, h: 4, i: 'visitorsMini', immobile: false },
            { x: 3, y: 8, w: 3, h: 4, i: 'usersMini', immobile: false },

            { x: 0, y: 12, w: 3, h: 4, i: 'staticMini', immobile: false },
            { x: 3, y: 12, w: 3, h: 4, i: 'dynamicMini', immobile: false },

            { x: 0, y: 16, w: 3, h: 4, i: 'refererMini', immobile: false },
            { x: 3, y: 16, w: 3, h: 4, i: 'topDomainMini', immobile: false },

            { x: 0, y: 20, w: 3, h: 8, i: 'osPie', immobile: false },
            { x: 3, y: 20, w: 3, h: 8, i: 'browserPie', immobile: false },

            { x: 0, y: 28, w: 3, h: 4, i: 'validMini', immobile: false },
            { x: 3, y: 28, w: 3, h: 4, i: 'failedMini', immobile: false },
          ]

        },
        breakpoint: 'lg',
        // slots: [
        //   '<q-btn round />'
        // ],

        // cols: 12,
        // // breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
        // colsAll: { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 },

        cols: 24,
        // breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
        colsAll: { lg: 24, md: 16, sm: 12, xs: 9, xxs: 6 },

        isDraggable: true,
        isResizable: false,
        preview: true,

        // items: {
        //   style: {transform: 'translate(0px, 0px)'}
        // }
      },

      components: {
        'requestsBars': [
          {
            component: SmallWidgetBars,
            props: {
              type: this.type,
              info: 'Reqs.',
              value: this.requests
            }
          }

        ],
        'bytesBars': [
          {
            component: SmallWidgetBars,
            props: {
              type: this.type,
              // info: 'MBytes',
            }
          }

        ],
        'visitorsMini': [
          {
            component: MiniWidget,
            props: {
              type: this.type,
              info: 'Unique visitors',
              // bgClass: 'bg-indigo-5'
            }
          }

        ],
        'usersMini': [
          {
            component: MiniWidget,
            props: {
              type: this.type,
              info: 'Users',
              // bgClass: 'bg-indigo-5'
            }
          }

        ],

        'staticMini': [
          {
            component: MiniWidget,
            props: {
              type: this.type,
              info: 'Static requests',
              // bgClass: 'bg-indigo-5'
            }
          }

        ],
        'dynamicMini': [
          {
            component: MiniWidget,
            props: {
              type: this.type,
              info: 'Dynamic requests',
              // bgClass: 'bg-indigo-5'
            }
          }

        ],
        'refererMini': [
          {
            component: MiniWidget,
            props: {
              type: this.type,
              info: 'External referers',
              // bgClass: 'bg-indigo-5'
            }
          }

        ],
        'topDomainMini': [
          {
            component: MiniWidget,
            props: {
              type: this.type,
              // info: 'External referers',
              // bgClass: 'bg-indigo-5'
            }
          }

        ],
        'osPie': [
          {
            component: SmallWidgetPie,
            props: {
              id: 'os',
              type: this.type,
              bgClass: 'bg-primary',
              categoryY: 'os',
              valueX: 'sum'
              // info: 'OS',
              // bgClass: 'bg-indigo-5'
            }
          }

        ],
        'browserPie': [
          {
            component: SmallWidgetPie,
            props: {
              id: 'browser',
              type: this.type,
              bgClass: 'bg-primary',
              categoryY: 'browser',
              valueX: 'sum'
              // info: 'OS',
              // bgClass: 'bg-indigo-5'
            }
          }

        ],
        'validMini': [
          {
            component: MiniWidget,
            props: {
              type: this.type,
              info: 'Valid requests',
              bgClass: 'bg-positive'
            }
          }

        ],
        'failedMini': [
          {
            component: MiniWidget,
            props: {
              type: this.type,
              info: 'Failed requests',
              bgClass: 'bg-negative'
            }
          }

        ],

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

    values: {
      handler: function (values) {
        debug('watch values', values)

        if (values && Object.getLength(values) > 0) {
          // this.$set(this.components.toolbar[0].props, 'range', values.range)
          // this.$set(this.components.toolbar[0].props, 'timestamp', values.timestamp)

          // this.$set(this.components.bytesTrend[0].props, 'bytes', values.total_bytes_sent)

          this.$set(this.components.requestsBars[0].props, 'value', {
            value: values.total_requests,
            title: values.total_requests + ' - ' + this.format_timestmap_standar(values.timestamp)
          })

          if (values.total_bytes_sent && values.total_bytes_sent >= 0) {
            let info = 'Bytes'
            let unit = 'bytes'
            let divider = 1
            if (values.total_bytes_sent > 1048576) {
              unit = 'MB'
              info = 'MBytes'
              divider = 1048576
            } else if (values.total_bytes_sent > 1024) {
              unit = 'KB'
              info = 'KBytes'
              divider = 1024
            }

            this.$set(this.components.bytesBars[0].props, 'info', info)
            this.$set(this.components.bytesBars[0].props, 'info_value', (values.total_bytes_sent / divider).toFixed(0))
            this.$set(this.components.bytesBars[0].props, 'value', {
              value: values.total_bytes_sent,
              title: (values.total_bytes_sent / divider).toFixed(0) + unit + ' - ' + this.format_timestmap_standar(values.timestamp)
            })
          }

          this.$set(this.components.visitorsMini[0].props, 'value', values.unique_visitors)

          let users = 0
          if (values.user_counter) {
            Object.each(values.user_counter, function (val, user) {
              if (user !== '-') {
                users += val
              }
            })
          }

          this.$set(this.components.usersMini[0].props, 'value', users)

          let referers = 0
          if (values.referer_counter) {
            Object.each(values.referer_counter, function (val, referer) {
              if (referer !== 'internal' && referer !== 'unknown') {
                referers += val
              }
            })
          }

          this.$set(this.components.refererMini[0].props, 'value', referers)

          if (values.top_domain) {
            this.$set(this.components.topDomainMini[0].props, 'info', values.top_domain.domain)
            this.$set(this.components.topDomainMini[0].props, 'value', values.top_domain.value)
          }

          if (values.user_agent_os_counter) {
            let info = ''
            let _top_os = 0
            let total = 0
            // let labels = []
            // // let datasets = [{ values: []}]
            // let datasets = [{ data: []}]
            let dataset = []
            Object.each(values.user_agent_os_counter, function (value, os) {
              if (value > _top_os) {
                _top_os = value
                info = os
              }
              dataset.push({
                os: os,
                sum: value
              })
              // labels.push(os)
              // datasets[0].data.push(value)
            })

            this.$set(this.components.osPie[0].props, 'info', info)
            this.$set(this.components.osPie[0].props, 'info_value', _top_os)
            // this.$set(this.components.osPie[0].props, 'value', {labels: labels, datasets: datasets})
            this.$set(this.components.osPie[0].props, 'value', dataset)
          }

          if (values.user_agent_browser_counter) {
            let info = ''
            let _top_browser = 0
            let total = 0
            // let labels = []
            // // let datasets = [{ values: []}]
            // let datasets = [{ data: []}]
            let dataset = []
            Object.each(values.user_agent_browser_counter, function (value, browser) {
              if (value > _top_browser) {
                _top_browser = value
                info = browser
              }
              dataset.push({
                browser: browser,
                sum: value
              })
              // labels.push(browser)
              // datasets[0].data.push(value)
            })

            this.$set(this.components.browserPie[0].props, 'info', info)
            this.$set(this.components.browserPie[0].props, 'info_value', _top_browser)
            // this.$set(this.components.browserPie[0].props, 'value', {labels: labels, datasets: datasets})
            this.$set(this.components.browserPie[0].props, 'value', dataset)
          }

          if (values.type_counter) {
            this.$set(this.components.staticMini[0].props, 'value', values.type_counter.static)
            this.$set(this.components.dynamicMini[0].props, 'value', values.type_counter.dynamic)
          }

          let valid = 0, failed = 0
          if (values.status_counter) {
            Object.each(values.status_counter, function (val, status) {
              status *= 1
              if (status < 400) {
                valid += val
              } else {
                failed += val
              }
            })
          }
          this.$set(this.components.validMini[0].props, 'value', valid)
          this.$set(this.components.failedMini[0].props, 'value', failed)
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
    // 'filter': function () {
    //   // return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
    //   debug('computed filter QUERY', this.$route.query)
    //   const allowed_filters = ['domain', 'path', 'host']
    //   let filter = {}
    //   if (this.$route && this.$route.query) {
    //     Object.each(this.$route.query, function (value, prop) {
    //       // if (allowed_filters.indexOf(prop) > -1 && filter === undefined) filter = {}
    //       if (allowed_filters.indexOf(prop) > -1) filter[prop] = value
    //     })
    //   }
    //   debug('computed filter', filter)
    //   return filter
    // },
    // 'type': function () {
    //   debug('computed type', Object.keys(this.filter))
    //   return (this.filter && Object.getLength(this.filter) > 0) ? Object.keys(this.filter)[0] : undefined
    // },
    // // 'filter': function () {
    // //   // return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
    // //   return (this.$route && this.$route.query)
    // //     ? this.$route.query
    // //     : undefined
    // // },
    // // 'type': function () {
    // //   return (this.filter) ? Object.keys(this.filter)[0] : undefined
    // // },
    // 'web': function () {
    //   return (this.filter && this.type) ? this.filter[this.type] : undefined
    // }
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
          id: this.id + '.periodical.' + name + '.component',
          props: {
            dark: this.dark,
            colorScheme: this.colorScheme,
          }
        }))
      }.bind(this))
    }.bind(this))
  },

  methods: {
    // onResizeActions: function (size) {
    //   debug('onResizeActions', size)
    //   this.actionsSize = size
    // },
    // update: function () {
    //   debug('udpate')
    //   // this.destroy_pipelines()
    //   // this.create_pipelines()
    //   // this.resume_pipelines()
    //   // this.$forceUpdate()
    // },
    setHeight: function (height) {
      debug('setHeight', height)
      // this.height = height + 200 + 'px'
      this.height = height
      this.$emit('height', height)
    },

    // end: function () {
    //   // if (this.current_day === undefined) {
    //   return Date.now()
    //   // } else {
    //   // return this.current_day
    //   // }
    // },
    //
    // // apply_zoom: function (data, categoryY, valueX) {
    // //   const min_zoom = 0.5
    // //   const max_zoom = 1
    // //   /* const min_length = 8 */
    // //   const max_length = 15
    // //   let length = data.length
    // //   /* let zoom = 1 */
    // //
    // //   if (data.length <= max_length) {
    // //     return max_zoom
    // //   } else {
    // //     // let itemsWithNonZero = 0
    // //     // for (let i = 0; i < max_length; i++) {
    // //     //   if (data[i][valueX] > 0) {
    // //     //     itemsWithNonZero++
    // //     //   }
    // //     // }
    // //
    // //     // let zoom = max_length / data.length
    // //     // return (zoom > min_zoom) ? zoom : min_zoom
    // //     return (max_length / data.length < min_zoom) ? min_zoom : max_length / data.length
    // //   }
    // // },
    format_timestmap_standar: function (timestamp) {
      return moment(timestamp).format('h:mm:ss')
    },
    // // format_time: function (timestamp) {
    // //   return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
    // // },
    // // format_log: function (log) {
    // //   return (log.length <= 100) ? log : log.substring(0, 96) + '...'
    // // },
    // /**
    // * @start pipelines
    // **/
    // create_pipelines: function (create_id, next) {
    //   debug('create_pipelines %o', this.$options.pipelines)
    //
    //   const pipelines = [PeriodicalPipeline]
    //   Array.each(pipelines, function (Pipeline) {
    //     let template = Object.clone(Pipeline)
    //
    //     debug('create_pipelines template %o', template)
    //
    //     let pipeline_id = template.input[0].poll.id
    //     if (!create_id || create_id === undefined || create_id === pipeline_id) {
    //       // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
    //       Array.each(template.input[0].poll.conn, function (conn, index) {
    //         template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.$options._logsWebFilterPeriodical_components, pipeline_id)
    //       }.bind(this))
    //
    //       let pipe = new JSPipeline(template)
    //
    //       this.$options.__pipelines_cfg[pipeline_id] = {
    //         ids: [],
    //         connected: [],
    //         suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
    //       }
    //
    //       // this.__after_connect_inputs(
    //       //   pipe,
    //       //   this.$options.__pipelines_cfg[pipeline_id],
    //       //   this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.id, function () {
    //       //     debug('__resume_pipeline CALLBACK')
    //       //     pipe.fireEvent('onOnce')
    //       //   }], this)
    //       // )
    //
    //       this.$options.pipelines[pipeline_id] = pipe
    //     }
    //   }.bind(this))
    //
    //   debug('create_pipelines %o', this.$options.pipelines)
    //
    //   if (next) { next() }
    //   // }
    // },

    /**
    * @end pipelines
    **/

  }

}
</script>
