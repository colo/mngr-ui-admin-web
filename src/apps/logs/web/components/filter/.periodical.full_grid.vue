<template>
  <div>
    <div :style="{height: (height + 100) + 'px', 'margin-top': '25px'}">
      <grid-view
        v-if="grid.layouts && Object.getLength(components) > 0"
        :swap_components="true"
        :id="id+'PeriodicalGrid'"
        :components="components"
        :grid="grid"
        v-on:height="setHeight"
      />
    </div>
    <!-- <world-cities-map :type="'periodical'" :world_map_cities="periodical.world_map_cities" :dark="dark" :colorScheme="colorScheme"/>

    <top-country :type="'periodical'" :top_country_counter="periodical.top_country_counter" :dark="dark" :colorScheme="colorScheme"/>

    <top-country :type="'periodical'" :top_country_counter="periodical.top_country_counter" :dark="dark" :colorScheme="colorScheme" :sum="true"/>

    <top-city :type="'periodical'" :top_city_counter="periodical.top_city_counter" :dark="dark" :colorScheme="colorScheme"/>

    <top-city :type="'periodical'" :top_city_counter="periodical.top_city_counter" :dark="dark" :colorScheme="colorScheme" :sum="true"/> -->

    <!-- <div v-for="(val, prop) in minute" :key="'minute.'+prop">
      minute: {{prop}} - {{val}} <br/>
    </div>
    <hr>

    <div v-for="(val, prop) in hour" :key="'hour.'+prop">
      hour: {{prop}} - {{val}} <br/>
    </div>
    <hr>

    <div v-for="(val, prop) in day" :key="'day.'+prop">
      day: {{prop}} - {{val}} <br/>
    </div>
    <hr> -->

    <!-- periodical.total_bytes_sent: {{ periodical.total_bytes_sent }} <br/>
    periodical.total_requests: {{ periodical.total_requests }} <br/> -->

    <!-- <hr>

    periodical.current_bytes_sent: {{ periodical.current_bytes_sent }} -->

    <!-- <hr>

    <div v-for="(val, status) in periodical.status_counter" :key="'status.'+status">
      periodical.status_counter: {{status}} - {{val}} <br/>
    </div>

    <hr> -->

    <!-- <div v-for="(val, city) in periodical.city_counter" :key="'city.'+city">
      periodical.city_counter: {{city}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, country) in periodical.country_counter" :key="'country.'+country">
      periodical.country_counter: {{country}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, continent) in periodical.continent_counter" :key="'continent.'+continent">
      periodical.continent_counter: {{continent}} - {{val}} <br/>
    </div>

    <hr> -->

    <!-- <div v-for="(val, addr) in periodical.addr_counter" :key="'addr.'+addr">
      periodical.addr_counter: {{addr}} - {{val}} <br/>
    </div> -->

    <!-- <div v-for="(val, addr) in periodical.unique_visitors_by_ip" :key="'addr.'+addr">
      periodical.unique_visitors_by_ip: {{addr}} - {{val}} <br/>
    </div> -->
    <!-- <hr>

    <div v-for="(val, host) in periodical.top_host_counter" :key="'host.'+host">
      periodical.top_host_counter: {{host}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, domain) in periodical.top_domain_counter" :key="'domain.'+domain">
      periodical.top_domain_counter: {{domain}} - {{val}} <br/>
    </div>

    <hr> -->

    <div v-for="(val, user) in periodical.user_counter" :key="'user.'+user">
      periodical.user_counter: {{user}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, referer) in periodical.referer_counter" :key="'referer.'+referer">
      periodical.referer_counter: {{referer}} - {{val}} <br/>
    </div>

    <hr>

    <!-- <div v-for="(val, type) in periodical.type_counter" :key="'type.'+type">
      periodical.type_counter: {{type}} - {{val}} <br/>
    </div>

    <hr> -->

    <div v-for="(val, os) in periodical.user_agent_os_counter" :key="'os.'+os">
      periodical.user_agent_os_counter: {{os}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, os) in periodical.user_agent_os_family_counter" :key="'os_family.'+os+'-'+val">
      periodical.user_agent_os_family_counter: {{os}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, engine) in periodical.user_agent_engine_counter" :key="'engine.'+engine+'-'+val">
      periodical.user_agent_engine_counter: {{engine}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, browser) in periodical.user_agent_browser_counter" :key="'browser.'+browser+'-'+val">
      periodical.user_agent_browser_counter: {{browser}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, device) in periodical.user_agent_device_counter" :key="'device.'+device+'-'+val">
      periodical.user_agent_device_counter: {{device}} - {{val}} <br/>
    </div>

    <!-- <q-table
      class="my-sticky-header-table"
      title="Web Logs"
      :data="periodical.logs"
      :columns="columns"
      :row-key="(row, index) => row.timestamp + row.domain +'.'+ row.host +'.'+ row.path + '.' + index"
      :pagination.sync="pagination"
      virtual-scroll
      :rows-per-page-options="[0]"
      :visible-columns="($q.screen.lt.sm) ? visibleColumns : allColumns"
      :loading="loading_logs"
      :filter="search_filter"
    >
      <template v-slot:top="props">
        <q-select
          v-if="$q.screen.lt.sm"
          v-model="visibleColumns"
          multiple
          borderless
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          style="min-width: 150px"
        />
        <q-space />
        <q-input borderless dense debounce="100" v-model="search_filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
        flat round dense
        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="props.toggleFullscreen"
        class="q-ml-md"
      />
      </template>

      <template v-slot:body="props">
      <q-tr :props="props">

        <q-td key="date" :props="props">
          {{ format_time(props.row.timestamp) }}
        </q-td>

        <q-td key="log" :props="props">
          {{ format_log(props.row.log) }}
        </q-td>

        <q-td key="domain" :props="props">
          {{ props.row.domain }}
          <q-btn v-on:click="destroy_pipelines()" :to="'/logs/web/filter/?domain=' + props.row.domain" flat icon="open_in_new" />
        </q-td>

        <q-td key="host" :props="props">
          {{ props.row.host }}

          <q-btn v-on:click="destroy_pipelines()" :to="'/logs/web/filter/?host=' + props.row.host" flat icon="open_in_new" />
        </q-td>

        <q-td key="path" :props="props">
          {{ props.row.path }}

          <q-btn v-on:click="destroy_pipelines()" :to="'/logs/web/filter/?path=' + props.row.path" flat icon="open_in_new" />
        </q-td>
      </q-tr>
      </template>
    </q-table> -->
  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:web:components:filter:periodical')

import { date } from 'quasar'

import DataSourcesMixin from '@mixins/dataSources'
import chartTabular from '@components/chart.tabular'

import JSPipeline from 'js-pipeline'

import PeriodicalPipeline from '@apps/logs/web/pipelines/filter/periodical'

import * as PeriodicalSources from '@apps/logs/web/sources/filter/periodical/index'

import moment from 'moment'

import { mapState } from 'vuex'

import WorldCitiesMap from '@apps/logs/web/components/worldCitiesMap'
import WorldCountriesMap from '@apps/logs/web/components/worldCountriesMap'
import TopCountry from '@apps/logs/web/components/topCountry'
import TopCity from '@apps/logs/web/components/topCity'
import Toolbar from '@apps/logs/web/components/filter/periodical/toolbar'
import LogsTable from '@apps/logs/web/components/filter/periodical/logsTable'
// import BytesTrend from '@apps/logs/web/components/bytesTrend'
import TopHost from '@apps/logs/web/components/topHost'
import TopDomain from '@apps/logs/web/components/topDomain'

import SmallWidgetBars from '@components/smallWidgetBars'
import MiniWidget from '@components/miniWidget'

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
    TopCountry,
    TopCity,
    LogsTable,
    Toolbar,
    // BytesTrend,
    SmallWidgetBars,
    MiniWidget
  },

  name: 'LogsWebFilterPeriodical',

  _logsWebFilterPeriodical_components: {
    range: {
      source: {
        requests: PeriodicalSources.requests
        // store: store
      }
    }
  },

  data () {
    return {
      id: 'logs.web.filter.periodical',
      path: 'all',
      height: 0,

      top: 15,

      periodical: {
        range: { start: 0, end: 0},

        top_host_counter: {},
        top_domain_counter: {},

        host_counter: {},
        domain_counter: {},

        top_city_counter: {},
        top_country_counter: {},

        logs: [],

        total_bytes_sent: 0,
        total_requests: 0,

        current_bytes_sent: 0,

        status_counter: {},

        city_counter: {},
        country_counter: {},
        continent_counter: {},
        world_map_cities: [],
        top_world_map_cities: [],

        world_map_countries: [],
        top_world_map_countries: [],

        addr_counter: {},
        user_counter: {},
        referer_counter: {},
        type_counter: {},

        user_agent_os_counter: {},
        user_agent_os_family_counter: {},
        user_agent_engine_counter: {},
        user_agent_browser_counter: {},
        user_agent_device_counter: {}

      },

      store: false,
      // pipeline_id: 'input.logs.web.filter',
      pipeline_id: [
        'input.logs.web.filter.periodical',
      ],

      cities_color: {},
      countries_color: {},
      // logs: [],

      // search_filter: '',
      loading_logs: true,

      grid: {
        layouts: {
          'lg': [
            { x: 0, y: 0, w: 24, h: 5, i: 'toolbar', immobile: false },

            { x: 0, y: 1, w: 3, h: 8, i: 'requestsBars', immobile: false },
            { x: 3, y: 1, w: 3, h: 8, i: 'bytesBars', immobile: false },

            { x: 6, y: 1, w: 3, h: 4, i: 'visitorsMini', immobile: false },
            { x: 6, y: 2, w: 3, h: 4, i: 'usersMini', immobile: false },

            { x: 9, y: 1, w: 3, h: 4, i: 'staticMini', immobile: false },
            { x: 9, y: 2, w: 3, h: 4, i: 'dynamicMini', immobile: false },

            { x: 12, y: 1, w: 3, h: 4, i: 'refererMini', immobile: false },

            { x: 21, y: 1, w: 3, h: 4, i: 'validMini', immobile: false },
            { x: 21, y: 2, w: 3, h: 4, i: 'failedMini', immobile: false },
            // { x: 12, y: 1, w: 3, h: 5, i: '4', immobile: false },
            { x: 0, y: 3, w: 12, h: 36, i: 'topHost', immobile: false },
            { x: 12, y: 3, w: 12, h: 36, i: 'topDomain', immobile: false },

            { x: 0, y: 4, w: 12, h: 36, i: 'topCountry', immobile: false },
            { x: 12, y: 4, w: 12, h: 36, i: 'worldCountriesMap', immobile: false },
            { x: 0, y: 5, w: 12, h: 36, i: 'worldCitiesMap', immobile: false },
            { x: 12, y: 5, w: 12, h: 36, i: 'topCity', immobile: false },
            { x: 0, y: 6, w: 12, h: 36, i: 'topCountrySum', immobile: false },
            { x: 12, y: 6, w: 12, h: 36, i: 'topCitySum', immobile: false },
            { x: 0, y: 7, w: 24, h: 50, i: 'logs', immobile: false },
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
        preview: false
      },

      components: {
        'toolbar': [
          {
            component: Toolbar
          }
        ],
        'requestsBars': [
          {
            component: SmallWidgetBars,
            props: {
              type: 'periodical',
              info: 'Reqs.',
            }
          }

        ],
        'bytesBars': [
          {
            component: SmallWidgetBars,
            props: {
              type: 'periodical',
              info: 'MBytes',
            }
          }

        ],
        'visitorsMini': [
          {
            component: MiniWidget,
            props: {
              type: 'periodical',
              info: 'Unique visitors',
              // bgClass: 'bg-indigo-5'
            }
          }

        ],
        'usersMini': [
          {
            component: MiniWidget,
            props: {
              type: 'periodical',
              info: 'Users',
              // bgClass: 'bg-indigo-5'
            }
          }

        ],

        'refererMini': [
          {
            component: MiniWidget,
            props: {
              type: 'periodical',
              info: 'External referers',
              // bgClass: 'bg-indigo-5'
            }
          }

        ],
        'staticMini': [
          {
            component: MiniWidget,
            props: {
              type: 'periodical',
              info: 'Static requests',
              // bgClass: 'bg-indigo-5'
            }
          }

        ],
        'dynamicMini': [
          {
            component: MiniWidget,
            props: {
              type: 'periodical',
              info: 'Dynamic requests',
              // bgClass: 'bg-indigo-5'
            }
          }

        ],
        'validMini': [
          {
            component: MiniWidget,
            props: {
              type: 'periodical',
              info: 'Valid requests',
              bgClass: 'bg-positive'
            }
          }

        ],
        'failedMini': [
          {
            component: MiniWidget,
            props: {
              type: 'periodical',
              info: 'Failed requests',
              bgClass: 'bg-negative'
            }
          }

        ],
        'topHost': [
          {
            component: TopHost,
            props: {
              type: 'periodical',
            }
          }
        ],
        'topDomain': [
          {
            component: TopDomain,
            props: {
              type: 'periodical',
            }
          }
        ],
        'topCountry': [
          {
            component: TopCountry,
            props: {
              type: 'periodical',
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
              type: 'periodical',
            }
          }

        ],
        'worldCitiesMap': [
          {
            component: WorldCitiesMap,
            props: {
              type: 'periodical',
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
              type: 'periodical',
              // // top_city_counter: {},
              // dark: this.dark,
              // colorScheme: this.colorScheme
            }
          }

        ],
        'logs': [
          {
            component: LogsTable,
            // events: {
            //   // destroy_pipelines: 'proxyEvent'
            //   update: 'update'
            // },
          }

        ],
        'topCountrySum': [
          {
            component: TopCountry,
            props: {
              type: 'periodical',
              sum: true
              // // top_country_counter: {},
              // dark: this.dark,
              // colorScheme: this.colorScheme
            }
          }

        ],
        'topCitySum': [
          {
            component: TopCity,
            props: {
              type: 'periodical',
              sum: true
              // // top_city_counter: {},
              // dark: this.dark,
              // colorScheme: this.colorScheme
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

    periodical: {
      handler: function (periodical) {
        debug('watch periodical', periodical)

        if (periodical && Object.getLength(periodical) > 0) {
          this.$set(this.components.toolbar[0].props, 'range', periodical.range)
          this.$set(this.components.toolbar[0].props, 'timestamp', periodical.timestamp)

          // this.$set(this.components.bytesTrend[0].props, 'bytes', periodical.total_bytes_sent)

          this.$set(this.components.requestsBars[0].props, 'value', {
            value: periodical.total_requests,
            title: periodical.total_requests + ' - ' + this.format_timestmap_standar(periodical.timestamp)
          })

          this.$set(this.components.bytesBars[0].props, 'value', {
            value: (periodical.total_bytes_sent / 1024 / 1024).toFixed(0),
            title: (periodical.total_bytes_sent / 1024 / 1024).toFixed(0) + 'Mb -' + this.format_timestmap_standar(periodical.timestamp)
          })

          this.$set(this.components.visitorsMini[0].props, 'value', periodical.unique_visitors)

          let users = 0
          Object.each(periodical.user_counter, function (val, user) {
            if (user !== '-') {
              users += val
            }
          })

          this.$set(this.components.usersMini[0].props, 'value', users)

          let referers = 0
          Object.each(periodical.referer_counter, function (val, referer) {
            if (referer !== 'internal' && referer !== 'unknown') {
              referers += val
            }
          })

          this.$set(this.components.refererMini[0].props, 'value', referers)

          this.$set(this.components.staticMini[0].props, 'value', periodical.type_counter.static)
          this.$set(this.components.dynamicMini[0].props, 'value', periodical.type_counter.dynamic)

          let valid = 0, failed = 0
          Object.each(periodical.status_counter, function (val, status) {
            status *= 1
            if (status < 400) {
              valid += val
            } else {
              failed += val
            }
          })
          this.$set(this.components.validMini[0].props, 'value', valid)
          this.$set(this.components.failedMini[0].props, 'value', failed)

          this.$set(this.components.topHost[0].props, 'top_host_counter', periodical.top_host_counter)
          this.$set(this.components.topDomain[0].props, 'top_domain_counter', periodical.top_domain_counter)

          // this.$set(this.components.topCountry, 0, Object.merge(this.components.topCountry[0], {
          //   id: this.id + '.periodical.topCountry.component',
          //   props: {
          //     top_country_counter: periodical.top_country_counter
          //   }
          //
          // }))
          this.$set(this.components.topCountry[0].props, 'top_country_counter', periodical.top_country_counter)
          this.$set(this.components.topCountrySum[0].props, 'top_country_counter', periodical.top_country_counter)

          // this.$set(this.components.worldCitiesMap, 0, Object.merge(this.components.worldCitiesMap[0], {
          //   id: this.id + '.periodical.worldCitiesMap.component',
          //   props: {
          //     world_map_cities: periodical.world_map_cities,
          //   }
          //
          // }))

          Array.each(periodical.top_world_map_cities, function (value) {
            if (value !== undefined) {
              let city = value.title.substring(0, value.title.indexOf('(')).trim()

              if (!this.cities_color[city]) {
                let index = 0

                // debug('watch periodical', colorSet.list)

                Object.each(periodical.top_city_counter, function (value, city) {
                  this.cities_color[city] = colorSet.getIndex(index).rgba

                  index++
                  if (index > colorSet.list.length) { index = 0 }
                }.bind(this))
              }

              value.color = this.cities_color[city]
            }
          }.bind(this))

          this.$set(this.components.worldCitiesMap[0].props, 'world_map_cities', periodical.top_world_map_cities)

          Array.each(periodical.top_world_map_countries, function (value) {
            if (value !== undefined) {
              let country = value.name.trim()

              if (!this.countries_color[country]) {
                let index = 0

                // debug('watch periodical', colorSet.list)

                Object.each(periodical.top_country_counter, function (value, country) {
                  this.countries_color[country] = colorSet.getIndex(index).rgba

                  index++
                  if (index > colorSet.list.length) { index = 0 }
                }.bind(this))
              }

              value.color = this.countries_color[country]
            }
          }.bind(this))
          // Change name => title
          // Array.each(periodical.top_world_map_countries, function (value) {
          //   if (value !== undefined) {
          //     value.name = value.title
          //   }
          // })

          this.$set(this.components.worldCountriesMap[0].props, 'world_map_countries', periodical.top_world_map_countries)

          // this.$set(this.components.topCity, 0, Object.merge(this.components.topCity[0], {
          //   id: this.id + '.periodical.topCity.component',
          //   props: {
          //     top_city_counter: periodical.top_city_counter
          //   }
          //
          // }))

          // Object.each(periodical.top_city_counter, function (value, city) {
          //   if (!this.cities_color[city]) this.cities_color[city] = colorSet.next()
          // }.bind(this))

          this.$set(this.components.topCity[0].props, 'top_city_counter', periodical.top_city_counter)
          this.$set(this.components.topCitySum[0].props, 'top_city_counter', periodical.top_city_counter)

          this.$set(this.components.logs[0].props, 'logs', periodical.logs)
          this.$set(this.components.logs[0].props, 'loading_logs', this.loading_logs)

          // debug('watch periodical', periodical, this.components)

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
    },

    end: function () {
      // if (this.current_day === undefined) {
      return Date.now()
      // } else {
      // return this.current_day
      // }
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
    format_timestmap_standar: function (timestamp) {
      return moment(timestamp).format('h:mm:ss')
    },
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

      const pipelines = [PeriodicalPipeline]
      Array.each(pipelines, function (Pipeline) {
        let template = Object.clone(Pipeline)

        debug('create_pipelines template %o', template)

        let pipeline_id = template.input[0].poll.id
        if (!create_id || create_id === undefined || create_id === pipeline_id) {
          // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
          Array.each(template.input[0].poll.conn, function (conn, index) {
            template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.$options._logsWebFilterPeriodical_components, pipeline_id)
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

  }

}
</script>
