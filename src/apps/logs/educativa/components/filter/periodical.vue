<template>
<div>
  <q-toolbar class="text-primary">
    <!-- <q-btn flat round dense icon="menu" /> -->
    <q-toolbar-title>
      From: {{ format_time(periodical.range.start) }} - To: {{ format_time(periodical.range.end) }} / Updated on: {{ format_time(periodical.timestamp) }}
    </q-toolbar-title>
    <!-- <q-space class="text-primary"/> -->

  </q-toolbar>

  <component
    :is="'chart-tabular'"
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'cgi',
        valueX: 'count',
        label: 'Per CGI count (last 5 secs)',
        zoom: apply_zoom
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
  </component>

  <!-- <amcharts-bar-race
    :categoryY="'cgi'"
    :valueX="'count'"
    :values="periodical.top_cgi_count"
    :label="'Per CGI count (last 5 secs)'"
    :id="'cgi_count'"
    :zoom="apply_zoom"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.cgi_count'"
  /> -->

  <component
    :is="'chart-tabular'"
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'cgi',
        valueX: 'count',
        label: 'Per CGI count (sum)',
        zoom: apply_zoom,
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
  </component>

  <!-- <amcharts-bar-race
    :categoryY="'cgi'"
    :valueX="'count'"
    :values="periodical.top_cgi_count"
    :label="'Per CGI count (sum)'"
    :id="'cgi_count_sum'"
    :zoom="apply_zoom"
    :sum="true"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.cgi_count_sum'"
  /> -->
  <!-- :label="format_time(periodical.timestamp)" -->

  <component
    :is="'chart-tabular'"
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'domain',
        valueX: 'count',
        label: 'Per DOMAIN - CGI count (last 5 secs)',
        zoom: apply_zoom
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
  </component>

  <!-- <amcharts-bar-race
    :categoryY="'domain'"
    :valueX="'count'"
    :values="periodical.top_per_domain"
    :label="'Per DOMAIN - CGI count (last 5 secs)'"
    :id="'per_domain_count'"
    :zoom="apply_zoom"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.per_domain_count'"
  /> -->

  <component
    :is="'chart-tabular'"
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'domain',
        valueX: 'count',
        label: 'Per DOMAIN - CGI count (sum)',
        zoom: apply_zoom,
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
  </component>

  <!-- <amcharts-bar-race
    :categoryY="'domain'"
    :valueX="'count'"
    :values="periodical.top_per_domain"
    :label="'Per DOMAIN - CGI count (sum)'"
    :id="'per_domain_count_sum'"
    :zoom="apply_zoom"
    :sum="true"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.per_domain_count_sum'"
  /> -->

  <component
    :is="'chart-tabular'"
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'host',
        valueX: 'count',
        label: 'Per HOST - CGI count (last 5 secs)',
        zoom: apply_zoom,
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
  </component>

  <!-- <amcharts-bar-race
    :categoryY="'host'"
    :valueX="'count'"
    :values="periodical.top_per_host"
    :label="'Per HOST - CGI count (last 5 secs)'"
    :id="'per_host_count'"
    :zoom="apply_zoom"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.per_host_count'"
  /> -->

  <component
    :is="'chart-tabular'"
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'host',
        valueX: 'count',
        label: 'Per HOST - CGI count (sum)',
        zoom: apply_zoom,
        sum: true
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
  </component>

  <!-- <amcharts-bar-race
    :categoryY="'host'"
    :valueX="'count'"
    :values="periodical.top_per_host"
    :label="'Per HOST - CGI count (sum)'"
    :id="'per_host_count_sum'"
    :zoom="apply_zoom"
    :sum="true"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.per_host_count_sum'"
  /> -->

  <component
    :is="'chart-tabular'"
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'domain',
        valueX: 'sum',
        label: 'Per DOMAIN - total duration (last 5 secs)',
        zoom: apply_zoom,
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
  </component>

  <!-- <amcharts-bar-race
    :categoryY="'domain'"
    :valueX="'sum'"
    :values="periodical.top_per_domain"
    :label="'Per DOMAIN - total duration (last 5 secs)'"
    :id="'per_domain_total'"
    :zoom="apply_zoom"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.per_domain_total'"
  /> -->

  <!-- <amcharts-bar-race :categoryY="'host'" :valueX="'sum'" :values="periodical.per_host" :label="'Per HOST - total duration'" :id="'per_host_sum'" :zoom="apply_zoom" :sum="true"/> -->

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

  <q-table
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
  <!-- dark
  color="amber" -->
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
      <!-- <div v-if="$q.screen.gt.xs" class="col">
        <q-toggle v-model="visibleColumns" val="schema" label="Schema" />
        <q-toggle v-model="visibleColumns" val="uri" label="URI" />
        <q-toggle v-model="visibleColumns" val="port" label="Port" />
        <q-toggle v-model="visibleColumns" val="host" label="Host" />
        <q-toggle v-model="visibleColumns" val="timestamp" label="Last Update" />
        <q-toggle v-model="visibleColumns" val="path" label="Type" />
      </div> -->

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
        <!-- <q-btn type="a" :href="props.row.schema+'://'+props.row.uri+':'+props.row.port" target="_blank" flat icon="open_in_new" /> -->
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
  </q-table>
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

// import QCalendar from '@quasar/quasar-ui-qcalendar'

// function leftClick (e) {
//   return e.button === 0
// }

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

  components: { chartTabular },

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

        // total_bytes_sent: 0,
        // hits: 0,
        //
        // current_bytes_sent: 0,
        //
        // status_counter: {},
        //
        // city_counter: {},
        // country_counter: {},
        // continent_counter: {},
        // world_map_cities: [],
        //
        // addr_counter: {},
        // user_counter: {},
        // referer_counter: {},
        // type_counter: {},
        //
        // user_agent_os_counter: {},
        // user_agent_os_family_counter: {},
        // user_agent_engine_counter: {},
        // user_agent_browser_counter: {},
        // user_agent_device_counter: {}

      },

      store: false,
      pipeline_id: [
        'input.logs.educativa.filter.periodical',
      ],

      // logs: [],

      search_filter: '',
      loading_logs: true,
      allColumns: ['date', 'log', 'domain', 'host', 'path'],
      visibleColumns: ['log'],
      pagination: {
        rowsPerPage: 10
      },

      columns: [
        // { name: 'schema', label: 'Schema', field: 'schema', sortable: true, align: 'left' },
        {
          name: 'date',
          required: true,
          label: 'Date',
          align: 'left',
          field: 'timestamp',
          sortable: true
        },
        {
          name: 'log',
          required: true,
          label: 'Log',
          align: 'left',
          field: 'log',
          sortable: true
        },
        {
          name: 'domain',
          required: true,
          label: 'Domain',
          align: 'left',
          field: 'domain',
          sortable: true
        },
        { name: 'host', align: 'left', label: 'Host', field: 'host', sortable: true },
        // {
        //   name: 'timestamp',
        //   align: 'left',
        //   label: 'Last Update',
        //   field: 'timestamp',
        //   sortable: true
        // },
        { name: 'path', align: 'left', label: 'Type', field: 'path', sortable: true }
      ],

    }
  },

  computed: {
    'filter': function () {
      // return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
      return (this.$route && this.$route.query)
        ? this.$route.query
        : undefined
    },
    'type': function () {
      return (this.filter) ? Object.keys(this.filter)[0] : undefined
    },
    'web': function () {
      return (this.filter && this.type) ? this.filter[this.type] : undefined
    },

  },

  methods: {
    end: function () {
      // if (this.current_day === undefined) {
      return Date.now()
      // } else {
      // return this.current_day
      // }
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

<style lang="sass">
.my-sticky-header-table
  /* max height is important */
  .q-table__middle
    max-height: 600px
    // min-height: 600px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    // background-color: #1d1d1d

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
