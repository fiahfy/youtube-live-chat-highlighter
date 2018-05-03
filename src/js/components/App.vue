<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-switch
          v-model="enabled"
          label="Enabled"
        />
        <v-subheader class="pl-0">Author Type</v-subheader>
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
        <!-- <v-subheader class="pl-0">Author Name</v-subheader>
        <v-list dense>
          <v-list>
            <v-list-tile
              v-for="rule in rules"
              :key="rule.id"
            >
              <v-layout row>
                <v-flex xs6>
                  <v-text-field
                    placeholder="transparent"
                  />
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    placeholder="transparent"
                  />
                </v-flex>
              </v-layout>
            </v-list-tile>
          </v-list>
          <v-list-tile
            class="mt-3"
            @click="addRule"
          >
            <v-list-tile-action>
              <v-icon color="grey darken-1">add_circle_outline</v-icon>
            </v-list-tile-action>
            <v-list-tile-title class="grey--text text--darken-1">Add rule</v-list-tile-title>
          </v-list-tile>
        </v-list> -->
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
    },
    rules () {
      return this.$store.state.rules
    }
  },
  async mounted () {
    await this.$store.dispatch('init')
  },
  methods: {
    addRule () {
      this.$store.commit('addRule')
    }
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
