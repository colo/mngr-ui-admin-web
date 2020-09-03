<template>
  <!-- <q-card>
    <q-card-section> -->
  <chart-tabular
    :wrapper="{
      type: 'amchartsBarRace',
      props:{
        categoryY: 'city',
        label: (sum === true) ? 'Per CITY count (sum)' : 'Per CITY count',
        zoom: apply_zoom,
        colorScheme: colorScheme,
        dark: dark,
        sum: sum
      }
    }"
    :always_update="false"
    :ref="type+'.top_city_counter'+ ((sum === true) ? '_sum' : '')"
    :id="type+'.top_city_counter' + ((sum === true) ? '_sum' : '')"
    :key="$route.path +'.'+ JSON.stringify($route.query)+'.'+type+'.top_city_counter'+ ((sum === true) ? '_sum' : '')"
    :stat="{
      data: [
        top_city_counter
      ],
      length: 1,
      numeric: false
    }"
    :reactive="false"
    :no_buffer="false"
  >
  </chart-tabular>
<!-- </q-card-section>
</q-card> -->
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:web:components:topCity')

import chartTabular from '@components/chart.tabular'

export default {

  components: { chartTabular },

  name: 'LogsWebTopCity',

  data () {
    return {
      id: 'logs.web.top.city',

    }
  },

  props: {
    top_city_counter: {
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
