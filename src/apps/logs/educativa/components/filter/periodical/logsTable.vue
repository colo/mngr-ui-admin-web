<template>
  <q-table
    class="my-sticky-header-table"
    title="Web Logs"
    :data="logs"
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
        <!-- <q-btn type="a" :href="props.row.schema+'://'+props.row.uri+':'+props.row.port" target="_blank" flat icon="open_in_new" /> -->
        <q-btn :to="'/logs/educativa/filter/?domain=' + props.row.domain" flat icon="open_in_new" />
        <!-- v-on:click="destroy_pipelines()" -->
      </q-td>

      <q-td key="host" :props="props">
        {{ props.row.host }}

        <q-btn :to="'/logs/educativa/filter/?host=' + props.row.host" flat icon="open_in_new" />
        <!-- v-on:click="destroy_pipelines()" -->
      </q-td>

      <q-td key="path" :props="props">
        {{ props.row.path }}

        <q-btn :to="'/logs/educativa/filter/?path=' + props.row.path" flat icon="open_in_new" />
        <!-- v-on:click="destroy_pipelines()" -->
      </q-td>
    </q-tr>
    </template>
  </q-table>

</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:educativa:components:filter:periodical:logsTable')

// import { date } from 'quasar'
//
// import DataSourcesMixin from '@mixins/dataSources'
// import chartTabular from '@components/chart.tabular'
//
// import JSPipeline from 'js-pipeline'
//
// import PeriodicalPipeline from '@apps/logs/educativa/pipelines/filter/periodical'
//
// import * as PeriodicalSources from '@apps/logs/educativa/sources/filter/periodical/index'
//
import moment from 'moment'
//
// import { mapState } from 'vuex'
//
// import WorldCitiesMap from '@apps/logs/educativa/components/worldCitiesMap'
// import TopCountry from '@apps/logs/educativa/components/topCountry'
// import TopCity from '@apps/logs/educativa/components/topCity'
// import Toolbar from '@apps/logs/educativa/components/filter/periodical/toolbar'
//
// import GridView from '@components/gridView'

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
  // mixins: [DataSourcesMixin],

  // components: {
  //   chartTabular,
  //   GridView,
  //   WorldCitiesMap,
  //   TopCountry,
  //   TopCity,
  // },

  name: 'LogsWebFilterPeriodicalLogsTable',

  // _logsWebFilterPeriodical_components: {
  //   range: {
  //     source: {
  //       requests: PeriodicalSources.requests
  //       // store: store
  //     }
  //   }
  // },
  props: {
    timestamp: {
      type: Number,
      default: 0
    },
    logs: {
      type: Array,
      default: function () {
        return []
      }
    },
    loading_logs: {
      type: Boolean,
      default: true
    }

  },

  data () {
    return {
      id: 'logs.educativa.filter.periodical.logs.table',

      search_filter: '',
      // loading_logs: true,
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

  methods: {
    format_time: function (timestamp) {
      return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
    },
    format_log: function (log) {
      return (log.length <= 100) ? log : log.substring(0, 96) + '...'
    },

  }

}
</script>
