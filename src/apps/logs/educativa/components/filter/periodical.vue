<template>
<div>
  <!-- <q-toolbar class="text-primary">
    <q-toolbar-title>
      From: {{ format_time(periodical.range.start) }} - To: {{ format_time(periodical.range.end) }} / Updated on: {{ format_time(periodical.timestamp) }}
    </q-toolbar-title>
  </q-toolbar> -->

  <!-- <component
    :is="'chart-tabular'"
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'cgi',
        valueX: 'count',
        label: 'Per CGI count (last 5 secs)',
        zoom: apply_zoom,
        colorScheme: colorScheme,
        dark: dark
      }
    }"
    :always_update="false"
    :ref="'periodical.cgi_count'"
    :id="'periodical.cgi_count'"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.cgi_count'"
    :stat="{
      data: [
        periodical.top_cgi_count
      ],
      length: 1,
      numeric: false
    }"
    :reactive="false"
    :no_buffer="false"
  >
  </component> -->

  <!-- <component
    :is="'chart-tabular'"
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'cgi',
        valueX: 'count',
        label: 'Per CGI count (sum)',
        zoom: apply_zoom,
        colorScheme: colorScheme,
        dark: dark,
        sum: true
      }
    }"
    :always_update="false"
    :ref="'periodical.cgi_count_sum'"
    :id="'periodical.cgi_count_sum'"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.cgi_count_sum'"
    :stat="{
      data: [
        periodical.top_cgi_count
      ],
      length: 1,
      numeric: false
    }"
    :reactive="false"
    :no_buffer="false"
  >
  </component> -->

  <!-- <component
    :is="'chart-tabular'"
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'domain',
        valueX: 'count',
        label: 'Per DOMAIN - CGI count (last 5 secs)',
        zoom: apply_zoom,
        colorScheme: colorScheme,
        dark: dark
      }
    }"
    :always_update="false"
    :ref="'periodical.per_domain_count'"
    :id="'periodical.per_domain_count'"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.per_domain_count'"
    :stat="{
      data: [
        periodical.top_per_domain
      ],
      length: 1,
      numeric: false
    }"
    :reactive="false"
    :no_buffer="false"
  >
  </component> -->

  <!-- <component
    :is="'chart-tabular'"
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'domain',
        valueX: 'count',
        label: 'Per DOMAIN - CGI count (sum)',
        zoom: apply_zoom,
        colorScheme: colorScheme,
        dark: dark,
        sum: true
      }
    }"
    :always_update="false"
    :ref="'periodical.per_domain_count_sum'"
    :id="'periodical.per_domain_count_sum'"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.per_domain_count_sum'"
    :stat="{
      data: [
        periodical.top_per_domain
      ],
      length: 1,
      numeric: false
    }"
    :reactive="false"
    :no_buffer="false"
  >
  </component> -->

  <!-- <component
    :is="'chart-tabular'"
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'host',
        valueX: 'count',
        label: 'Per HOST - CGI count (last 5 secs)',
        zoom: apply_zoom,
        colorScheme: colorScheme,
        dark: dark,
      }
    }"
    :always_update="false"
    :ref="'periodical.per_host_count'"
    :id="'periodical.per_host_count'"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.per_host_count'"
    :stat="{
      data: [
        periodical.top_per_host
      ],
      length: 1,
      numeric: false
    }"
    :reactive="false"
    :no_buffer="false"
  >
  </component> -->

  <!-- <component
    :is="'chart-tabular'"
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'host',
        valueX: 'count',
        label: 'Per HOST - CGI count (sum)',
        zoom: apply_zoom,
        colorScheme: colorScheme,
        dark: dark,
        sum: true,
      }
    }"
    :always_update="false"
    :ref="'periodical.per_host_count_sum'"
    :id="'periodical.per_host_count_sum'"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.per_host_count_sum'"
    :stat="{
      data: [
        periodical.top_per_host
      ],
      length: 1,
      numeric: false
    }"
    :reactive="false"
    :no_buffer="false"
  >
  </component> -->

  <!-- <component
    :is="'chart-tabular'"
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'domain',
        valueX: 'sum',
        label: 'Per DOMAIN - total duration (last 5 secs)',
        zoom: apply_zoom,
        colorScheme: colorScheme,
        dark: dark
      }
    }"
    :always_update="false"
    :ref="'periodical.per_domain_total'"
    :id="'periodical.per_domain_total'"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.per_domain_total'"
    :stat="{
      data: [
        periodical.top_per_domain
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
      :id="id+'PeriodicalGrid'"
      :components="components"
      :grid="grid"
      v-on:height="setHeight"
    />
  </div>

  <div v-for="(count, cgi) in periodical.cgi_count" :key="'cgi_count.'+cgi">
    periodical.cgi_count: {{cgi}} - {{count}} <br/>
  </div>

  <hr>

  <div v-for="(val, domain) in periodical.per_domain" :key="'per_domain.'+domain">
    periodical.per_domain: {{domain}} - {{val}} <br/>
  </div>

  <hr>

  <div v-for="(val, stat) in periodical.duration_stats" :key="'duration_stats.'+stat">
    periodical.duration_stats: {{stat}} - {{val}} <br/>
  </div>

  <hr>

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
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.table'"
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
        <q-btn v-on:click="destroy_pipelines()" :to="'/logs/educativa/filter/?domain=' + props.row.domain" flat icon="open_in_new" />
      </q-td>

      <q-td key="host" :props="props">
        {{ props.row.host }}

        <q-btn v-on:click="destroy_pipelines()" :to="'/logs/educativa/filter/?host=' + props.row.host" flat icon="open_in_new" />
      </q-td>

      <q-td key="path" :props="props">
        {{ props.row.path }}

        <q-btn v-on:click="destroy_pipelines()" :to="'/logs/educativa/filter/?path=' + props.row.path" flat icon="open_in_new" />
      </q-td>
    </q-tr>
    </template>
  </q-table> -->
</div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:educativa:components:filter:periodical')

import { date } from 'quasar'

// import amchartsBarRace from '@components/wrappers/amchartsBarRace'

import DataSourcesMixin from '@mixins/dataSources'
import chartTabular from '@components/chart.tabular'
// import chart from '@components/chart'

import JSPipeline from 'js-pipeline'

import PeriodicalPipeline from '@apps/logs/educativa/pipelines/filter/periodical'

import * as PeriodicalSources from '@apps/logs/educativa/sources/filter/periodical/index'

// const MAX_FEED_DATA = 10
import moment from 'moment'

import { mapState } from 'vuex'

import CgiCount from '@apps/logs/educativa/components/cgiCount'
import DomainCgiCount from '@apps/logs/educativa/components/domainCgiCount'
import DomainTotalDuration from '@apps/logs/educativa/components/domainTotalDuration'
import HostCgiCount from '@apps/logs/educativa/components/hostCgiCount'
import Toolbar from '@apps/logs/educativa/components/filter/periodical/toolbar'
import LogsTable from '@apps/logs/educativa/components/filter/periodical/logsTable'

import GridView from '@components/gridView'

// import * as am4core from '@amcharts/amcharts4/core'
// const colorSet = new am4core.ColorSet()

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
    CgiCount,
    DomainCgiCount,
    DomainTotalDuration,
    HostCgiCount,
    LogsTable,
    Toolbar
  },

  name: 'LogsEducativaFilterPeriodical',

  _logsEducativaFilterPeriodical_components: {
    range: {
      source: {
        requests: PeriodicalSources.requests
        // store: store
      }
    }
  },

  data () {
    return {
      id: 'logs.educativa.filter.periodical',
      path: 'all',
      height: 0,

      top: 15,

      showCalendar: false,

      periodical: {
        top_per_domain: {},
        top_per_host: {},
        top_cgi_count: {},
        // date: undefined,
        // timestamp: 0,
        logs: [],

        cgi_count: {},
        // domain_count: {},
        per_domain: {},

        per_host: {},
        range: { start: 0, end: 0},
        timestamp: 0,

      },

      store: false,
      pipeline_id: [
        'input.logs.educativa.filter.periodical',
      ],

      // logs: [],

      // search_filter: '',
      loading_logs: true,
      // allColumns: ['date', 'log', 'domain', 'host', 'path'],
      // visibleColumns: ['log'],
      // pagination: {
      //   rowsPerPage: 10
      // },
      //
      // columns: [
      //   // { name: 'schema', label: 'Schema', field: 'schema', sortable: true, align: 'left' },
      //   {
      //     name: 'date',
      //     required: true,
      //     label: 'Date',
      //     align: 'left',
      //     field: 'timestamp',
      //     sortable: true
      //   },
      //   {
      //     name: 'log',
      //     required: true,
      //     label: 'Log',
      //     align: 'left',
      //     field: 'log',
      //     sortable: true
      //   },
      //   {
      //     name: 'domain',
      //     required: true,
      //     label: 'Domain',
      //     align: 'left',
      //     field: 'domain',
      //     sortable: true
      //   },
      //   { name: 'host', align: 'left', label: 'Host', field: 'host', sortable: true },
      //   // {
      //   //   name: 'timestamp',
      //   //   align: 'left',
      //   //   label: 'Last Update',
      //   //   field: 'timestamp',
      //   //   sortable: true
      //   // },
      //   { name: 'path', align: 'left', label: 'Type', field: 'path', sortable: true }
      // ],

      grid: {
        layouts: {
          'lg': [
            { x: 0, y: 0, w: 24, h: 5, i: 'toolbar', immobile: false },
            { x: 0, y: 5, w: 12, h: 36, i: 'domainCgiCount', immobile: false },
            { x: 12, y: 5, w: 12, h: 36, i: 'domainCgiCountSum', immobile: false },
            { x: 0, y: 41, w: 12, h: 36, i: 'hostCgiCount', immobile: false },
            { x: 12, y: 41, w: 12, h: 36, i: 'hostCgiCountSum', immobile: false },
            { x: 0, y: 77, w: 12, h: 36, i: 'domainTotalDuration', immobile: false },
            { x: 12, y: 77, w: 12, h: 36, i: 'domainTotalDurationSum', immobile: false },
            { x: 0, y: 113, w: 12, h: 36, i: 'cgiCount', immobile: false },
            { x: 12, y: 113, w: 12, h: 36, i: 'cgiCountSum', immobile: false },
            { x: 0, y: 149, w: 24, h: 50, i: 'logs', immobile: false },
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
            component: Toolbar
          }
        ],
        'domainCgiCount': [
          {
            component: DomainCgiCount,
            props: {
              type: 'periodical',
            }
          }

        ],
        'domainCgiCountSum': [
          {
            component: DomainCgiCount,
            props: {
              type: 'periodical',
              sum: true
            }
          }

        ],
        'hostCgiCount': [
          {
            component: HostCgiCount,
            props: {
              type: 'periodical',
            }
          }

        ],
        'hostCgiCountSum': [
          {
            component: HostCgiCount,
            props: {
              type: 'periodical',
              sum: true
            }
          }

        ],
        'domainTotalDuration': [
          {
            component: DomainTotalDuration,
            props: {
              type: 'periodical',
            }
          }

        ],
        'domainTotalDurationSum': [
          {
            component: DomainTotalDuration,
            props: {
              type: 'periodical',
              sum: true
            }
          }

        ],
        'cgiCount': [
          {
            component: CgiCount,
            props: {
              type: 'periodical',
            }
          }

        ],
        'cgiCountSum': [
          {
            component: CgiCount,
            props: {
              type: 'periodical',
              sum: true
            }
          }

        ],

        'logs': [
          {
            component: LogsTable,

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
        if (periodical && Object.getLength(periodical) > 0) {
          debug('watch periodical', periodical)
          this.$set(this.components.toolbar[0].props, 'range', periodical.range)
          this.$set(this.components.toolbar[0].props, 'timestamp', periodical.timestamp)

          this.$set(this.components.domainCgiCount[0].props, 'top_per_domain', periodical.top_per_domain)
          this.$set(this.components.domainCgiCountSum[0].props, 'top_per_domain', periodical.top_per_domain)

          this.$set(this.components.hostCgiCount[0].props, 'top_per_host', periodical.top_per_host)
          this.$set(this.components.hostCgiCountSum[0].props, 'top_per_host', periodical.top_per_host)

          this.$set(this.components.domainTotalDuration[0].props, 'top_per_domain', periodical.top_per_domain)
          this.$set(this.components.domainTotalDurationSum[0].props, 'top_per_domain', periodical.top_per_domain)

          this.$set(this.components.cgiCount[0].props, 'top_cgi_count', periodical.top_cgi_count)
          this.$set(this.components.cgiCountSum[0].props, 'top_cgi_count', periodical.top_cgi_count)

          // this.$set(this.components.hostCgiCount[0].props, 'top_per_host', periodical.top_per_host)

          //   Array.each(periodical.top_world_map_cities, function (value) {
          //     if (value !== undefined) {
          //       let city = value.title.substring(0, value.title.indexOf('(')).trim()
          //
          //       if (!this.cities_color[city]) {
          //         let index = 0
          //
          //         // debug('watch periodical', colorSet.list)
          //
          //         Object.each(periodical.top_city_counter, function (value, city) {
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
          //   this.$set(this.components.worldCitiesMap[0].props, 'world_map_cities', periodical.top_world_map_cities)
          //
          //   Array.each(periodical.top_world_map_countries, function (value) {
          //     if (value !== undefined) {
          //       let country = value.name.trim()
          //
          //       if (!this.countries_color[country]) {
          //         let index = 0
          //
          //         // debug('watch periodical', colorSet.list)
          //
          //         Object.each(periodical.top_country_counter, function (value, country) {
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
          //   this.$set(this.components.worldCountriesMap[0].props, 'world_map_countries', periodical.top_world_map_countries)
          //
          //
          //   this.$set(this.components.topCity[0].props, 'top_city_counter', periodical.top_city_counter)
          //   this.$set(this.components.topCitySum[0].props, 'top_city_counter', periodical.top_city_counter)
          //
          this.$set(this.components.logs[0].props, 'logs', periodical.logs)
          this.$set(this.components.logs[0].props, 'loading_logs', this.loading_logs)
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
            template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.$options._logsEducativaFilterPeriodical_components, pipeline_id)
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

  }

}
</script>
