<template>
  <v-app>
    <v-content>
      <v-container fill-height>
        <v-switch
          v-model="enabled"
          label="Enabled"
        />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      switch1: true
    }
  },
  computed: {
    enabled: {
      get () {
        return this.$store.state.enabled
      },
      set (value) {
        this.$store.dispatch('setEnabled', { enabled: value })
      }
    }
  },
  async mounted () {
    await this.$store.dispatch('init')
  }
}
</script>

<style>
@import '~vuetify/dist/vuetify.min.css';
</style>

<style scoped>
.application {
  min-width: 256px;
}
</style>
