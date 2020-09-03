<template>
  <q-page>
     <!-- :key="$route.path +'.'+ JSON.stringify($route.query)+'.'+end()+'.page'" -->
    <div class="q-pa-md">
      <div class="bg-primary text-white">
        <q-toolbar >
          <q-breadcrumbs active-color="white" style="font-size: 16px">
            <q-breadcrumbs-el label="Home" icon="home" to="/"/>
            <q-breadcrumbs-el label="Logs" :to="{name : 'logs'}"/>
            <q-breadcrumbs-el label="Educativa" :to="{name : 'logs_educativa'}"/>
            <q-breadcrumbs-el label="Filter" v-if="type"/>
            <q-breadcrumbs-el :label="type +':'+ web" v-if="type && web" />
          </q-breadcrumbs>
        </q-toolbar>
        <logs-toolbar/>
      </div>
      <!-- -->
      <q-tabs
        v-model="range_tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="periodical" label="Now" />
        <q-tab name="minute" label="Minute" />
        <q-tab name="hour" label="Hourly" />
        <q-tab name="day" label="Daily" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="range_tab">
        <!-- animated -->
        <q-tab-panel name="periodical">
          <!-- :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical'" -->
          <logs-educativa-filter-periodical/>
        </q-tab-panel>

        <q-tab-panel name="minute">
           <!-- :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute'" -->
          <!-- <logs-educativa-filter-minute/> -->
          <logs-educativa-filter-historical :type="'minute'"/>
        </q-tab-panel>

        <q-tab-panel name="hour">
           <!-- :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour'" -->
          <!-- <logs-educativa-filter-hour/> -->
          <logs-educativa-filter-historical :type="'hour'"/>
        </q-tab-panel>

        <q-tab-panel name="day">
          <!-- :key="$route.path +'.'+ JSON.stringify($route.query)+'.day'" -->
          <!-- <logs-educativa-filter-day/> -->
          <logs-educativa-filter-historical :type="'day'"/>
        </q-tab-panel>
      </q-tab-panels>

    </div>

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]" :duration="50">
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>

  </q-page>
</template>

<script>
/* eslint handle-callback-err: "off" */
import * as Debug from 'debug'
const debug = Debug('apps:logs:educativa:pages:filter')

import LogsToolbar from '@apps/logs/components/toolbar.vue'

import { date } from 'quasar'

import LogsEducativaFilterPeriodical from '@apps/logs/educativa/components/filter/periodical'
import LogsEducativaFilterHistorical from '@apps/logs/educativa/components/filter/historical'
// import LogsEducativaFilterMinute from '@apps/logs/educativa/components/filter/minute'
// import LogsEducativaFilterHour from '@apps/logs/educativa/components/filter/hour'
// import LogsEducativaFilterDay from '@apps/logs/educativa/components/filter/day'

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

  components: {
    LogsToolbar,
    LogsEducativaFilterPeriodical,
    LogsEducativaFilterHistorical,
    // LogsEducativaFilterMinute,
    // LogsEducativaFilterHour,
    // LogsEducativaFilterDay
  },

  name: 'LogsEducativaFilter',

  data () {
    return {
      id: 'logs.educativa.filter',
      path: 'all',

      range_tab: 'minute',

    }
  },

  created () {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.range_tab = tab
    }
  },
  watch: {

    range_tab: function (val) {
      this.$router.push({ path: this.$route.path, query: Object.merge(Object.clone(this.$route.query), { tab: val }) }).catch(err => {})// catch 'NavigationDuplicated' error
      // this.$router.push(`${this.$route.path}?tab=${val}`).catch(err => {})// catch 'NavigationDuplicated' error
    },

  },

  computed: {
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
    'web': function () {
      return (this.filter && this.type) ? this.filter[this.type] : undefined
    },

  },

}
</script>
