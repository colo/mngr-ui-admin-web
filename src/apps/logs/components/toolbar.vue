<template>
  <q-toolbar>
    <q-btn flat class="q-mr-xs" label="Web" :to="{name : 'logs_web'}"/>
    <q-btn flat class="q-mr-xs" label="Qmail" :to="{name : 'logs_qmail'}"/>
    <q-btn flat class="q-mr-xs" label="Educativa" :to="{name : 'logs_educativa'}"/>
  </q-toolbar>

</template>

<script>

export default {

  name: 'LogsToolbar',

}
</script>
