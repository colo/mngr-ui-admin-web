<template>
    <q-toolbar class="text-primary">
      <q-toolbar-title>
        From: {{ format_time(range.start) }} - To: {{ format_time(range.end) }} / Updated on: {{ format_time(timestamp) }}
      </q-toolbar-title>
    </q-toolbar>
</template>
<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:web:components:filter:periodical:toolbar')

import moment from 'moment'

export default {

  name: 'LogsWebFilterPeriodicalToolbar',

  data () {
    return {
      id: 'logs.web.filter.periodical.toolbar',

    }
  },

  props: {
    timestamp: {
      type: Number,
      default: 0
    },
    range: {
      type: Object,
      default: function () {
        return {
          start: 0,
          end: 0
        }
      }
    }

  },
  methods: {
    format_time: function (timestamp) {
      return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
    },
  }
}
</script>
