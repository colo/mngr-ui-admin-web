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
    // values: {
    //   type: Object,
    //   default: function () { return {} }
    // },
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

    // values: {
    //   handler: function (values) {
    //     debug('watch values', values)
    //
    //     if (values && Object.getLength(values) > 0) {
    //       this.$set(this.components.toolbar[0].props, 'range', values.range)
    //       this.$set(this.components.toolbar[0].props, 'timestamp', values.timestamp)
    //
    //
    //     }
    //   },
    //   deep: true
    // }
  },
  methods: {
    format_time: function (timestamp) {
      return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
    },
  }
}
</script>
