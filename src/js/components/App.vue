<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-switch
          v-model="enabled"
          label="Enabled"
        />
        <v-layout row>
          <v-flex xs6>
            <v-subheader class="pl-0">Owner</v-subheader>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-model="ownerColor"
              placeholder="transparent"
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs6>
            <v-subheader class="pl-0">Moderator</v-subheader>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-model="moderatorColor"
              placeholder="transparent"
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs6>
            <v-subheader class="pl-0">Member</v-subheader>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-model="memberColor"
              placeholder="transparent"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  computed: {
    enabled: {
      get () {
        return this.$store.state.enabled
      },
      set (value) {
        this.$store.dispatch('setEnabled', { enabled: value })
      }
    },
    ownerColor: {
      get () {
        return this.$store.state.ownerColor
      },
      set (value) {
        this.$store.dispatch('setOwnerColor', { ownerColor: value })
      }
    },
    moderatorColor: {
      get () {
        return this.$store.state.moderatorColor
      },
      set (value) {
        this.$store.dispatch('setModeratorColor', { moderatorColor: value })
      }
    },
    memberColor: {
      get () {
        return this.$store.state.memberColor
      },
      set (value) {
        this.$store.dispatch('setMemberColor', { memberColor: value })
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
