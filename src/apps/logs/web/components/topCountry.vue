<template>
  <!-- <div>
    {{top_country_counter}} -->
  <chart-tabular
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'country',
        label: (sum === true) ? 'Per COUNTRY count (sum)' : 'Per COUNTRY count',
        zoom: apply_zoom,
        colorScheme: colorScheme,
        dark: dark,
        sum: sum
      }
    }"
    :always_update="false"
    :ref="type+'.top_country_counter'+ ((sum === true) ? '_sum' : '')"
    :id="type+'.top_country_counter' + ((sum === true) ? '_sum' : '')"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.'+type+'.top_country_counter'+ ((sum === true) ? '_sum' : '')"
    :stat="{
      data: [
        top_country_counter
      ],
      length: 1,
      numeric: false
    }"
    :reactive="false"
    :no_buffer="false"
  >
  </chart-tabular>
<!-- </div> -->
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:web:components:topCountry')

import chartTabular from '@components/chart.tabular'

export default {

  components: { chartTabular },

  name: 'LogsWebTopCountry',

  data () {
    return {
      id: 'logs.web.top.country',

    }
  },

  props: {
    top_country_counter: {
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
