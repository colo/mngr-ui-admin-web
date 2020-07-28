import dbColors from '@dashblocks/src/components/dbcolors'
import netdata from '@libs/netdata/themes'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  let dbc = dbColors

  // this.testColors = dbColors.getColors(true); // TEMP TODO REMOVE
  let cSteps = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]

  dbColors.setColorScheme('default', {
    light: dbColors.d3ScaleChromatic.schemeTableau10,
    dark: dbColors.grafanaColors
  })

  dbColors.setColorScheme('Grafana', {
    light: dbColors.grafanaColors,
    dark: dbColors.grafanaColors
  })

  dbColors.setColorScheme('Tableau', {
    light: dbColors.d3ScaleChromatic.schemeTableau10,
    dark: dbColors.d3ScaleChromatic.schemeTableau10
  })

  dbColors.setColorScheme('Diverging', {
    light: dbColors.d3ScaleChromatic.schemeRdYlBu[10],
    dark: dbColors.d3ScaleChromatic.schemeRdYlBu[10]
  })

  dbColors.setColorScheme('Categorical', {
    light: dbColors.d3ScaleChromatic.schemeDark2,
    dark: dbColors.d3ScaleChromatic.schemeSet3 // schemeBuGn[9],
  })

  dbColors.setColorScheme('Warm', {
    light: cSteps.map(x => dbColors.d3ScaleChromatic.interpolateWarm(x)),
    dark: cSteps.map(x => dbColors.d3ScaleChromatic.interpolateWarm(x))
  })

  dbColors.setColorScheme('Cool', {
    light: cSteps.map(x => dbColors.d3ScaleChromatic.interpolateCool(x)),
    dark: cSteps.map(x => dbColors.d3ScaleChromatic.interpolateCool(x))
  })

  dbColors.setColorScheme('Calm', {
    light: ['#912e4d', '#00bd56', '#f02192', '#acd36d', '#8079ff', '#919200', '#f1adff', '#547600', '#ff8241', '#f8ba7a'],
    dark: ['#ce4c3a', '#60b14d', '#8162cb', '#bab141', '#c964b5', '#4bb092', '#c25874', '#717e37', '#688ccd', '#c78344']
  })
  // ['#cc4ba2', '#64ac48', '#8361cd', '#9a963f', '#5f8cce', '#cd5136', '#4aac8d', '#c7596d', '#c78543', '#b578b6']
  // ['#ce4c3a', '#60b14d', '#8162cb', '#bab141', '#c964b5', '#4bb092', '#c25874', '#717e37', '#688ccd', '#c78344']

  dbColors.setColorScheme('Fancy', {
    light: ['#38646f', '#4e2300', '#274f8e', '#6b5e1f', '#794f81', '#2a2e00', '#00485e', '#7c553f', '#2e0a06', '#2b2219'],
    dark: ['#b1d8a0', '#74aff3', '#dbcd9d', '#7bcaed', '#ebaba7', '#74d6e0', '#deb1e0', '#a1e9d1', '#adbce9', '#8dc4af']
  })

  dbColors.setColorScheme('Colorblind Friendly', {
    light: ['#37efab', '#58006c', '#b3e370', '#9a73ec', '#b1a200', '#0051ab', '#ff9e6a', '#601016', '#685d00', '#de3357'],
    dark: ['#78a563', '#666fe8', '#c1b01b', '#014ca6', '#ffca5e', '#e2b1ff', '#008418', '#ff77bf', '#811e00', '#ff8c56']
  })

  dbColors.setColorScheme('Netdata', {
    light: netdata.white.colors,
    dark: netdata.slate.colors
  })
}
