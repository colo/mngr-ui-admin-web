<template>
  <chart-tabular
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'cgi',
        valueX: 'count',
        label: '',
        label: (sum === true) ? 'Per CGI count (sum)' : 'Per CGI count',
        zoom: apply_zoom,
        colorScheme: colorScheme,
        dark: dark,
        sum: sum
      }
    }"
    :always_update="false"
    :ref="type+'.cgi_count'+ ((sum === true) ? '_sum' : '')"
    :id="type+'.cgi_count' + ((sum === true) ? '_sum' : '')"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.'+type+'.cgi_count'+ ((sum === true) ? '_sum' : '')"
    :stat="{
      data: [
        top_cgi_count
      ],
      length: 1,
      numeric: false
    }"
    :reactive="false"
    :no_buffer="false"
  >
  </chart-tabular>

</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:educativa:components:cgiCount')

import chartTabular from '@components/chart.tabular'

export default {

  components: { chartTabular },

  name: 'LogsEducativaCgiCount',

  data () {
    return {
      id: 'logs.educativa.cgiCount',

    }
  },

  props: {
    top_cgi_count: {
      type: Object,
      default: function () {
        return {}
      }
    },
    type: {
      type: String,
      default: ''
    },
    sum: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    },
    colorScheme: {
      type: String,
      default: 'default'
    },
  },

  methods: {
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
        return (max_length / data.length < min_zoom) ? min_zoom : max_length / data.length
      }
    },

  }

}
</script>
