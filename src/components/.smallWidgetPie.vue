<template>
  <!-- <q-card>
    <q-card-section> -->
    <!-- <div class="container"> -->
      <div class="widget">
        <div class="section section-graph" :class="bgClass">
          <span class="section-info">{{info}}</span>
          <div class="graph-info">
            <q-icon :name="'mdi-menu-'+trend" />
            <span class="graph-info-big">{{info_value}}</span>
          </div>
          <chart-tabular
            :wrapper="{
              type: 'frappeCharts',
            }"
            :always_update="false"
            :ref="type+'.'+id+'Pie'"
            :id="type+'.'+id+'Pie'"
            :chart="{
              options: {
                /* type: 'percentage', */
                height: 175,
                /* maxSlices: 5, */
                /* style: {
                  'margin-top': '0px',
                  height: '100%',
                  width: '100%',
                } */
              }
            }"
            :stat="{
              data: [
                value
              ],
              length: 1,
              numeric: false
            }"
            :reactive="false"
            :no_buffer="false"
          >

          </chart-tabular>
          <!-- :chart="{
            options: {
              height: 180,
              style: {
                'z-index': 1000,
                float: 'left',
                'margin-top': '0px',
                height: '100%',
                width: '100%',
              }
            }
          }" -->
          <!-- <div class="graph-chart"> -->

          <!-- </div> -->

        </div>
        <!-- <div class="section section-graph" :class="bgClass">
          <chart-tabular
            :wrapper="{
              type: 'frappeCharts',
            }"
            :always_update="false"
            :ref="type+'.'+id+'Pie'"
            :id="type+'.'+id+'Pie'"
            :chart="{
              options: {
                height: 10,
              }
            }"
            :stat="{
              data: [
                value
              ],
              length: 1,
              /* numeric: false */
            }"
            :reactive="false"
            :no_buffer="false"
          >

          </chart-tabular>
        </div> -->

        <!-- <div class="section section-info">
          <span class="info-time">Today 2:25 PM</span>
          <h3 class="info-title">Salt Lake City, Utah</h3>

          <div class="info-block">
            <dl>
              <dt>13.5 M</dt>
              <dd>Shares Traded</dd>
            </dl>
          </div>

          <div class="info-block last">
            <dl>
              <dt>28.44</dt>
              <dd>Market Cap</dd>
            </dl>
          </div>

          <div class="info-aapl">
            <h4>AAPL</h4>
            <ul>
              <li><span class="orange" style="height: 37.5%"></span></li>
              <li><span class="orange" style="height: 47.5%"></span></li>
              <li><span class="orange" style="height: 70%"></span></li>
              <li><span class="orange" style="height: 85%"></span></li>
              <li><span class="orange" style="height: 40%"></span></li>
              <li><span class="green" style="height: 75%"></span></li>
              <li><span class="green" style="height: 50%"></span></li>
              <li><span class="green" style="height: 15%"></span></li>
              <li><span class="green" style="height: 25%"></span></li>
            </ul>
          </div>

          <div class="yearly-change">
            <h4>Yearly Change</h4>
            <span><em>+</em> 127.01</span>
          </div>
        </div>
        <div class="section"></div> -->
      </div>
    <!-- </div> -->

<!-- </q-card-section>
</q-card> -->
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('components:smallWidgetPies')

import chartTabular from '@components/chart.tabular'

export default {

  components: { chartTabular },

  name: 'smallWidgetPies',

  data () {
    return {
      // id: 'smallWidgetPies',
      // prev: {
      //   value: 0,
      // },
      prev: 0,
      trend: 'up',
    }
  },

  props: {
    id: {
      type: String,
      default: ''
    },
    bgClass: {
      type: String,
      default: 'bg-info'
    },
    info_value: {
      type: [String, Number],
      default: undefined
    },
    info: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default: function () {
        // return { value: 0, title: ''}
        return { labels: [], datasets: [] }
      }
    },
    type: {
      type: String,
      default: ''
    },

  },
  watch: {
    'info_value': function (data) {
      if (this.prev < data) {
        this.trend = 'up'
      } else {
        this.trend = 'down'
      }

      this.prev = data
    }
  },

}
</script>
<style scoped lang="scss">
.frappe-chart .legend {
  display: none;
}

// .container {
// width: 283px;
// margin: 0 auto;
// padding-top: 39px;
// }

.widget {
background: white;
border-radius: 5px;
box-shadow: 0 3px 5px rgba(0, 0, 0, .2);
}

.section {
  border-radius: 5px 5px 5px 5px;
  .section-info {
    // margin-top: 20px;
    font-size: 14px;
    font-weight: normal;
    color: rgba(255, 255, 255, .5);
    clear: left;
    margin-left: 10px;
  }
}

// .section:first-child {
// border-radius: 5px 5px 0 0;
// }
//
// .section:last-child {
// border-radius: 0 0 5px 5px;
// }

/*
* Graph section
*/
.section-graph {
position: relative;
// height: 151px;
height: 116px;
color: #fff;
background: #55bc75;
background-image: linear-gradient(color-stops(#55bc75, #55bc75 50%, #4daf7c 50%));

  .graph-info {
    z-index: 99;
    position: absolute;
    font-weight: bold;
    margin-top: 0px;
    margin-left: 21px;
    // width: 100px;

    // .graph-arrow {
    //   width: 0;
    //   height: 0;
    //   margin-top: 18px;
    //   border-left: 4px solid transparent;
    //   border-right: 4px solid transparent;
    //   border-bottom: 4px solid white;
    //   float: left;
    // }

    .graph-info-big {
      font-size: 24px;
      float: left;
      margin-left: 0px;
    }

    .graph-info-small {
      margin-left: 3px;
      font-size: 12px;
      font-weight: normal;
      color: rgba(255, 255, 255, .5);
      clear: left;
      margin-left: 8px;
    }
  }

  .graph-chart {
    // z-index: 99;
    // position: relative;
    // font-weight: bold;
    // clear: both;
    // float: right;
    // margin-top: 0px;
    // margin-left: 40px;

  }
}

/*
* Info Section
*/

// h3 {
// font-size: 18px;
// margin-top: 2px;
// }
//
// h4 {
// font-size: 13px;
// font-weight: normal;
// margin-bottom: 10px;
// }
//
// .section-info {
// padding: 21px 21px 41px;
// color: #8a786a;
// overflow: hidden;
// }
//
// .info-time {
// font-size: 12px;
// }
//
// .info-block {
// background-color: #f5f0ec;
// text-align: center;
// width: 120px;
// border-radius: 3px;
// float: left;
// padding: 4px 0;
//
// &.last {
//   margin-left: 1px;
// }
//
// dt, dd {
//   margin: 0;
//   padding: 0;
// }
//
// dt {
//   font-weight: bold;
// }
//
// dd {
//   font-size: 12px;
// }
// }
//
// .info-aapl {
// float: left;
//
// ul {
//   margin: 0;
//   padding: 0;
// }
//
// li {
//   margin: 0;
//   display: block;
//   width: 9px;
//   height: 40px;
//   margin-right: 6px;
//   background-color: #f5f0ec;
//   float: left;
//   position: relative;
//
//   span {
//     display: block;
//     width: 9px;
//     height: 40px;
//     position: absolute;
//     bottom: 0;
//   }
//
//   span.orange {
//     background-color: #e75e3a;
//   }
//
//   span.green {
//     background-color: #4eaf7c;
//   }
// }
// }
//
// .yearly-change {
// width: 94px;
// float: right;
//
// span {
//   display: block;
//   height: 40px;
//   line-height: 40px;
//   color: white;
//   background-color: #4eaf7c;
//   text-align: center;
//   border-radius: 3px;
//   font-weight: bold;
//
//   em {
//     color: rgba(255, 255, 255, .7);
//   }
// }
// }
</style>
