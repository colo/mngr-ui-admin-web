<template>
  <q-card :style="{height: (height + actionsSize.height + 100) + 'px'}">
    <!-- {{height + actionsSize.height}} -->
    <q-card-section>
      <q-btn
        flat
        :to="{
          name: 'system_host',
          params: { host: host },
        }"
      >
        {{host}}
      </q-btn>
    </q-card-section>

    <q-card-section>
      <div class="netdata-chart-row" :style="{height: height + 'px'}">
        <template v-if="Object.getLength(host_data) > 0">
          <grid-view
            v-if="grid.layouts && Object.getLength(components) > 0"
            :swap_components="true"
            :id="host+'HostCardGrid'"
            :components="components"
            :grid="grid"
            v-on:height="setHeight"
          />

        </template>
      </div>
    </q-card-section>

    <q-separator dark />

    <q-card-actions>
      <q-resize-observer @resize="onResizeActions" />
      <q-btn
        v-for="category in categories"
        :key="host+'.'+category"
        flat
        :to="{
          name: 'system_host',
          params: { host: host },
          hash: '#'+category
        }"
      >{{category}}</q-btn>
    </q-card-actions>
  </q-card>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:system:components:hostCard')

// import JSPipeline from 'js-pipeline'
// import Pipeline from '@apps/system/pipelines/index'

// import DataSourcesMixin from '@mixins/dataSources'

// import { requests, store } from './sources/index'

// import vGaugeWrapper from '@components/wrappers/vGauge'
// import vueEasyPieChartWrapper from './wrappers/vueEasyPieChart'
import chartTabular from '@components/chart.tabular'

import Mount from '@apps/system/components/hostCard/mount'
import Loadavg from '@apps/system/components/hostCard/loadavg'
import Memory from '@apps/system/components/hostCard/memory'
import NetOut from '@apps/system/components/hostCard/netOut'
import NetIn from '@apps/system/components/hostCard/netIn'
import Cpu from '@apps/system/components/hostCard/cpu'

import GridView from '@components/gridView'

export default {
  // mixins: [DataSourcesMixin],
  // extends: DataSourcesMixin,
  components: {
    // vGaugeWrapper,
    // vueEasyPieChartWrapper,
    chartTabular,
    GridView,
    Mount
  },

  name: 'SystemHostCard',

  // __mount_template_component: {
  //   props: {
  //     wrapper: {
  //       type: 'vueEasyPieChart',
  //     },
  //     always_update: false,
  //     reactive: false,
  //     no_buffer: false,
  //     stat: {
  //       data: [],
  //       length: 1
  //     },
  //     chart: {
  //       class: 'netdata-chart netdata-easypiechart-chart',
  //       params: {
  //         'bar-color': '#AD69AD',
  //         'size': 150,
  //         // 'title': 'Used: ' + mount,
  //         /* unit: 'kilobits/s', */
  //       }
  //     }
  //
  //   }
  // },

  data () {
    return {
      actionsSize: {
        height: 0,
        width: 0,
      },
      default_stat: {
        data: [0],
        length: 1
      },

      height: 0,

      id: 'system.hostCard',

      grid: {
        layouts: {
          'lg': [
            { x: 0, y: 0, w: 3, h: 10, i: 'loadavg', immobile: false },
            { x: 3, y: 0, w: 3, h: 10, i: 'netOut', immobile: false },
            { x: 6, y: 0, w: 3, h: 10, i: 'netIn', immobile: false },
            { x: 9, y: 0, w: 6, h: 15, i: 'cpu', immobile: false },
            { x: 15, y: 0, w: 6, h: 10, i: 'mounts', immobile: false },
            { x: 21, y: 0, w: 3, h: 10, i: 'memory', immobile: false },
            // { x: 0, y: 1, w: 12, h: 2, i: 'separator' }
          ],
          'md': [
            { x: 0, y: 0, w: 4, h: 10, i: 'loadavg', immobile: false },
            { x: 4, y: 0, w: 4, h: 10, i: 'netOut', immobile: false },
            { x: 8, y: 0, w: 4, h: 10, i: 'netIn', immobile: false },
            { x: 12, y: 0, w: 4, h: 10, i: 'memory', immobile: false },

            { x: 0, y: 10, w: 8, h: 15, i: 'cpu', immobile: false },
            { x: 8, y: 10, w: 8, h: 10, i: 'mounts', immobile: false },

            // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
          ],
          'sm': [
            { x: 0, y: 0, w: 3, h: 10, i: 'loadavg', immobile: false },
            { x: 3, y: 0, w: 3, h: 10, i: 'netOut', immobile: false },
            { x: 6, y: 0, w: 3, h: 10, i: 'netIn', immobile: false },
            { x: 9, y: 0, w: 3, h: 10, i: 'memory', immobile: false },

            { x: 0, y: 10, w: 6, h: 15, i: 'cpu', immobile: false },
            { x: 6, y: 10, w: 6, h: 10, i: 'mounts', immobile: false },

            // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
          ],
          'xs': [
            { x: 0, y: 0, w: 4, h: 10, i: 'loadavg', immobile: false },
            { x: 4, y: 0, w: 4, h: 10, i: 'memory', immobile: false },
            { x: 0, y: 10, w: 4, h: 10, i: 'netOut', immobile: false },
            { x: 4, y: 10, w: 4, h: 10, i: 'netIn', immobile: false },
            { x: 0, y: 20, w: 8, h: 15, i: 'cpu', immobile: false },
            { x: 0, y: 35, w: 8, h: 10, i: 'mounts', immobile: false },

            // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
          ],
          'xxs': [
            { x: 0, y: 0, w: 3, h: 10, i: 'loadavg', immobile: false },
            { x: 3, y: 0, w: 3, h: 10, i: 'memory', immobile: false },
            { x: 0, y: 10, w: 3, h: 10, i: 'netOut', immobile: false },
            { x: 3, y: 10, w: 3, h: 10, i: 'netIn', immobile: false },
            { x: 0, y: 20, w: 6, h: 15, i: 'cpu', immobile: false },
            { x: 0, y: 35, w: 6, h: 10, i: 'mounts', immobile: false },

            // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
          ]

        },
        breakpoint: 'lg',
        // slots: [
        //   '<q-btn round />'
        // ],

        // cols: 12,
        // // breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
        // colsAll: { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 },

        cols: 24,
        // breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
        colsAll: { lg: 24, md: 16, sm: 12, xs: 8, xxs: 6 },

        isDraggable: false,
        isResizable: false,
        preview: true
      },

      components: {
        'loadavg': [
          {
            component: Loadavg,
            // props: {
            //   wrapper: {
            //     type: 'vueEasyPieChart',
            //   },
            //   always_update: false,
            //   reactive: false,
            //   no_buffer: false,
            //   stat: {
            //     data: [],
            //     length: 1
            //   },
            //   chart: {
            //     class: 'netdata-chart netdata-easypiechart-chart',
            //     params: {
            //       'bar-color': '#66AA00',
            //       'size': 130,
            //       'title': 'Load',
            //       'unit': '1min avg',
            //
            //     }
            //   },
            //
            // },
          }

        ],
        'netOut': [
          {
            component: NetOut,
          }
        ],
        'netIn': [
          {
            component: NetIn
          }
        ],
        'cpu': [
          {
            component: Cpu,
          }
        ],
        'mounts': [

        ],
        'memory': [
          {
            component: Memory,
          }

        ],
      },

    }
  },

  props: {
    host: {
      type: String,
      default: ''
    },
    host_data: {
      type: Object,
      default: () => ({})
    },
    categories: {
      type: Array,
      default: function () { return [] }
    }
  },

  created: function () {
    this.$on('grid.' + this.id + ':height', this.setHeight.bind(this))
  },
  watch: {
    host_data: {
      handler: function (host_data) {
        if (host_data && Object.getLength(host_data) > 0) {
          this.$set(this.components.loadavg, 0, Object.merge(this.components.loadavg[0], {
            id: this.host + '.loadavg.component',
            props: {
              loadavg: host_data['os.loadavg']['1_min'],
              loadavg_max: host_data['os.loadavg.max'],
              host: this.host
            }

          }))
          debug('watch host_data', host_data, this.components)

          this.$set(this.components.netOut, 0, Object.merge(this.components.netOut[0], {
            id: this.host + '.netOut.component',
            props: {
              net: host_data['os.networkInterfaces.out'],
              net_max: host_data['os.networkInterfaces.max.out'],
              host: this.host
            }

          }))

          this.$set(this.components.netIn, 0, Object.merge(this.components.netIn[0], {
            id: this.host + '.netIn.component',
            props: {
              net: host_data['os.networkInterfaces.in'],
              net_max: host_data['os.networkInterfaces.max.in'],
              host: this.host
            }

          }))

          this.$set(this.components.cpu, 0, Object.merge(this.components.cpu[0], {
            id: this.host + '.cpu.component',
            props: {
              used: host_data['os.cpus.percentage'] || 0,
              host: this.host
            }
          }))

          let index = 0
          this.$set(this.components, 'mounts', [])

          Object.each(host_data['os.mounts.used'], function (used, mount) {
            if (index <= 1) {
              this.components.mounts.push({
                style: {
                  'width': (Object.getLength(host_data['os.mounts.used']) === 1) ? '100%' : '50%',
                  'float': (Object.getLength(host_data['os.mounts.used']) === 1) ? undefined : (index === 0) ? 'left' : 'right'
                },
                id: this.host + '.' + mount + '.used.component',
                props: {
                  used: used,
                  mount: mount,
                  host: this.host
                }

              })
              this.$set(this.components.mounts[index], 'component', Mount)
            }

            index++
          }.bind(this))

          this.$set(this.components.memory, 0, Object.merge(this.components.memory[0], {
            id: this.host + '.memory.component',
            props: {
              used: host_data['os.memory.percentage'],
              host: this.host
            }

          }))
        }
      },
      deep: true
    }
  },
  methods: {
    onResizeActions: function (size) {
      debug('onResizeActions', size)
      this.actionsSize = size
    },
    setHeight: function (height) {
      debug('setHeight', height)
      // this.height = height + 200 + 'px'
      this.height = height
    },
  }

}
</script>

<style>

.netdata-chart-alignment {
    margin-left: 55px;
}

.netdata-chart-row {
    width: 100%;
    text-align: center;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    align-items: baseline;
    -moz-align-items: baseline;
    -webkit-align-items: baseline;
    justify-content: center;
    -webkit-justify-content: center;
    -moz-justify-content: center;
    padding-top: 10px;
}

.netdata-container {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge:after {
    padding-top: 60%;
    display: block;
    content: '';
}

.netdata-container-easypiechart {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-easypiechart:after {
    padding-top: 100%;
    display: block;
    content: '';
}

.netdata-aspect {
    position: relative;
    width: 100%;
    padding: 0px;
    margin: 0px;
}

.netdata-container-with-legend {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* fix minimum scrollbar issue in firefox */
    min-height: 99px;

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-legend-resize-handler {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0px;
    height: 15px;
    width: 20px;
    background-color: White;
    font-size: 15px;
    vertical-align: middle;
    line-height: 15px;
    cursor: ns-resize;
    color: #DDDDDD;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;
}

.netdata-legend-toolbox {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 30px;
    height: 15px;
    width: 110px;
    background-color: White;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #DDDDDD;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-legend-toolbox-button {
    display: inline-block;
    position: relative;
    height: 15px;
    width: 18px;
    background-color: White;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #CDCDCD;
    text-align: center;
    overflow: hidden;
    z-index: 21;
    padding: 0px;
    margin: 0px;
    cursor: pointer;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-message {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: left;
    vertical-align: top;
    font-weight: bold;
    font-size: x-small;
    overflow: hidden;
    background: inherit;
    z-index: 0;
}

.netdata-message.hidden {
    display: none;
}

.netdata-message.icon {
    color: #F8F8F8;
    text-align: center;
    vertical-align: middle;
}

.netdata-chart-legend {
    position: absolute; /* within .netdata-container */
    top: 0;
    right: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14px;
    display: block;
    width: 140px; /* --legend-width */
    height: calc(100% - 15px); /* 10px for the resize handler and 5px for the top margin */
    font-size: 10px;
    margin-top: 5px;
    text-align: left;
    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-legend-title-date {
    font-size: 10px;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-time {
    font-size: 11px;
    font-weight: bold;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-units {
    position: absolute;
    right: 10px;
    float: right;
    font-size: 11px;
    vertical-align: top;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-series {
    position: absolute;
    width: 140px; /* legend-width */
    height: calc(100% - 50px);
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14.5px; /* line spacing at the legend */
    display: block;
    font-size: 10px;
    margin-top: 0px;
}

.netdata-legend-name-table-line {
    display: inline-block;
    width: 13px;
    height: 4px;
    border-width: 0px;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: white;
}

.netdata-legend-name-table-area {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-table-stacked {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-tr {
}

.netdata-legend-name-td {
}

.netdata-legend-name {
    text-align: left;
    font-size: 11px; /* legend: dimension name size */
    font-weight: bold;
    vertical-align: bottom;
    margin-top: 0px;
    z-index: 9;
    padding: 0px;
    width: 100px !important;
    max-width: 100px !important;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    cursor: pointer;
    -webkit-print-color-adjust: exact;
}

.netdata-legend-value {
    /*margin-left: 14px;*/
    position: absolute;
    right: 10px;
    float: right;
    text-align: right;
    font-size: 11px; /* legend: dimension value size */
    font-weight: bold;
    vertical-align: bottom;
    background-color: White;
    margin-top: 0px;
    z-index: 10;
    padding: 0px;
    padding-left: 15px;
    cursor: pointer;
    /* -webkit-font-smoothing: none; */
}

.netdata-legend-name.not-selected {
    font-weight: normal;
    opacity: 0.3;
}

.netdata-chart {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: inline-block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    z-index: 5;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-chart-with-legend-right {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: block;
    overflow: hidden;
    margin-right: 140px; /* --legend-width */
    width: calc(100% - 140px); /* --legend-width */
    height: 100%;
    z-index: 5;
    flex-grow: 1;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-peity-chart {

}

.netdata-sparkline-chart {

}

.netdata-dygraph-chart {

}

.netdata-morris-chart {

}

.netdata-google-chart {

}

.dygraph-ylabel {
}

.dygraph-axis-label-x {
    overflow-x: hidden;
}

.dygraph-label-rotate-left {
    text-align: center;
    /* See http://caniuse.com/#feat=transforms2d */
    transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
}

/* For y2-axis label */
.dygraph-label-rotate-right {
    text-align: center;
    /* See http://caniuse.com/#feat=transforms2d */
    transform: rotate(-90deg);
    -webkit-transform: rotate(-90deg);
    -moz-transform: rotate(-90deg);
    -o-transform: rotate(-90deg);
    -ms-transform: rotate(-90deg);
}

.dygraph-title {
    text-indent: 56px;
    text-align: left;
    position: absolute;
    left: 0px;
    top: 4px;
    font-size: 11px;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

/* fix for sparkline tooltip under bootstrap */
.jqstooltip {
    width: auto !important;
    height: auto !important;
}

.easyPieChart {
    position: relative;
    text-align: center;
}

.easyPieChart canvas {
    position: absolute;
    top: 0;
    left: 0;
}

.easyPieChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #666;
    font-weight: normal;
    text-shadow: #BBB 0px 0px 1px;
    /* -webkit-font-smoothing: none; */
}

.easyPieChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 104%;
    margin-left: 18% !important;
    text-align: center;
    color: #999999;
    font-weight: bold;
}

.easyPieChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    margin-left: 20% !important;
    text-align: center;
    color: #999999;
    font-weight: normal;
}

.gaugeChart {
    position: relative;
    text-align: center;
}

.gaugeChart canvas {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
}

.gaugeChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #FFFFFF;
    font-weight: bold;
    z-index: 1;
    text-shadow: #777 0px 0px 1px;
    /* text-shadow: #CCC 1px 1px 0px, #CCC -1px -1px 0px, #CCC 1px -1px 0px, #CCC -1px 1px 0px; */
    /* -webkit-text-stroke: 1px #777; */
    /* -webkit-font-smoothing: none; */
}

.gaugeChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #999999;
    font-weight: bold;
}

.gaugeChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: left;
    margin-left: 5%;
    color: #999999;
    font-weight: normal;
}

.gaugeChartMin {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 92%;
    margin-left: 8%;
    text-align: left;
    color: #999999;
    font-weight: normal;
}

.gaugeChartMax {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 95%;
    margin-right: 5%;
    text-align: right;
    color: #999999;
    font-weight: normal;
}

.popover-title {
    font-weight: bold;
    font-size: 12px;
}

.popover-content {
    font-size: 11px;
}

/* ----------------------------------------------------------------------------
   perfect-scrollbar settings
 */

.ps-container {
    -ms-touch-action: auto;
    touch-action: auto;
    overflow: hidden !important;
    -ms-overflow-style: none;
}

@supports (-ms-overflow-style: none) {
    .ps-container {
        overflow: auto !important;
    }
}

@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    .ps-container {
        overflow: auto !important;
    }
}

.ps-container.ps-active-x > .ps-scrollbar-x-rail,
.ps-container.ps-active-y > .ps-scrollbar-y-rail {
    display: block;
    background-color: transparent;
}

.ps-container.ps-in-scrolling.ps-x > .ps-scrollbar-x-rail {
    background-color: transparent; /* background color when dragged away */
    opacity: 0.9;
}

.ps-container.ps-in-scrolling.ps-x > .ps-scrollbar-x-rail > .ps-scrollbar-x {
    background-color: #aaa; /* scrollbar color when dragged away */
    height: 5px;
}

.ps-container.ps-in-scrolling.ps-y > .ps-scrollbar-y-rail {
    background-color: transparent; /* background color when dragged away */
    opacity: 0.9;
}

.ps-container.ps-in-scrolling.ps-y > .ps-scrollbar-y-rail > .ps-scrollbar-y {
    background-color: #aaa; /* scrollbar color when dragged away */
    width: 5px;
}

.ps-container > .ps-scrollbar-x-rail {
    display: none;
    position: absolute;
    /* please don't change 'position' */
    opacity: 0.2; /* the opacity when not on hover of the content */
    -webkit-transition: background-color .2s linear, opacity .2s linear;
    -o-transition: background-color .2s linear, opacity .2s linear;
    -moz-transition: background-color .2s linear, opacity .2s linear;
    transition: background-color .2s linear, opacity .2s linear;
    bottom: 0px;
    /* there must be 'bottom' for ps-scrollbar-x-rail */
    height: 15px;
}

.ps-container > .ps-scrollbar-x-rail > .ps-scrollbar-x {
    position: absolute;
    /* please don't change 'position' */
    background-color: #666; /* #aaa; the color on content hover */
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    -webkit-transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, -webkit-border-radius .2s ease-in-out;
    transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, -webkit-border-radius .2s ease-in-out;
    -o-transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out;
    -moz-transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out, -moz-border-radius .2s ease-in-out;
    transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out;
    transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out, -webkit-border-radius .2s ease-in-out, -moz-border-radius .2s ease-in-out;
    bottom: 2px;
    /* there must be 'bottom' for ps-scrollbar-x */
    height: 5px; /* the width of the scrollbar */
}

.ps-container > .ps-scrollbar-x-rail:hover > .ps-scrollbar-x, .ps-container > .ps-scrollbar-x-rail:active > .ps-scrollbar-x {
    height: 4px;
}

.ps-container > .ps-scrollbar-y-rail {
    display: none;
    position: absolute;
    /* please don't change 'position' */
    opacity: 0.2; /* the opacity when not on hover of the content */
    -webkit-transition: background-color .2s linear, opacity .2s linear;
    -o-transition: background-color .2s linear, opacity .2s linear;
    -moz-transition: background-color .2s linear, opacity .2s linear;
    transition: background-color .2s linear, opacity .2s linear;
    right: 0;
    /* there must be 'right' for ps-scrollbar-y-rail */
    width: 15px;
}

.ps-container > .ps-scrollbar-y-rail > .ps-scrollbar-y {
    position: absolute;
    /* please don't change 'position' */
    background-color: #666; /* #aaa; the color on content hover */
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    -webkit-transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, -webkit-border-radius .2s ease-in-out;
    transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, -webkit-border-radius .2s ease-in-out;
    -o-transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out;
    -moz-transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out, -moz-border-radius .2s ease-in-out;
    transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out;
    transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out, -webkit-border-radius .2s ease-in-out, -moz-border-radius .2s ease-in-out;
    right: 2px;
    /* there must be 'right' for ps-scrollbar-y */
    width: 5px; /* the width of the scrollbar */
}

.ps-container > .ps-scrollbar-y-rail:hover > .ps-scrollbar-y, .ps-container > .ps-scrollbar-y-rail:active > .ps-scrollbar-y {
    width: 5px;
}

.ps-container:hover.ps-in-scrolling.ps-x > .ps-scrollbar-x-rail {
    background-color: transparent; /* background color when dragged */
    opacity: 0.9;
}

.ps-container:hover.ps-in-scrolling.ps-x > .ps-scrollbar-x-rail > .ps-scrollbar-x {
    background-color: #bbb; /* scrollbar color when dragged */
    height: 5px;
}

.ps-container:hover.ps-in-scrolling.ps-y > .ps-scrollbar-y-rail {
    background-color: transparent; /* background color when dragged */
    opacity: 0.9;
}

.ps-container:hover.ps-in-scrolling.ps-y > .ps-scrollbar-y-rail > .ps-scrollbar-y {
    background-color: #bbb; /* scrollbar color when dragged */
    width: 5px;
}

.ps-container:hover > .ps-scrollbar-x-rail,
.ps-container:hover > .ps-scrollbar-y-rail {
    opacity: 0.6;
}

.ps-container:hover > .ps-scrollbar-x-rail:hover {
    background-color: transparent; /* the background color on hover of the scrollbar */
    opacity: 0.9;
}

.ps-container:hover > .ps-scrollbar-x-rail:hover > .ps-scrollbar-x {
    background-color: #999; /* scrollbar color on hover */
}

.ps-container:hover > .ps-scrollbar-y-rail:hover {
    background-color: transparent; /* the background color on hover of the scrollbar */
    opacity: 0.9;
}

.ps-container:hover > .ps-scrollbar-y-rail:hover > .ps-scrollbar-y {
    background-color: #999; /* scrollbar color on hover */
}

.dygraph__history-tip {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: none; /* overriden in js */
    margin-right: 25px;
    direction: rtl;
    overflow: hidden;
    pointer-events: none;
}

.dygraph__history-tip-content {
    display: inline-block;
    white-space: nowrap;
    direction: ltr;
    pointer-events: auto;
}
</style>
