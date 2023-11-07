<template>
  <v-menu offset-y bottom center content-class="mt-4 elevation-1 rounded-lg" transition="slide-y-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-btn :color="$vuetify.theme.dark ? '' : 'blue lighten-4'" elevation="0" icon v-bind="attrs" v-on="on">
        <v-icon :color="$vuetify.theme.dark ? '' : 'grey darken-1'">
          mdi-view-grid-outline
        </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-row no-gutters>
        <v-col cols="12" md="6" sm="12">
          <v-card-text>
            <v-list class="pa-0 rounded-menu" rounded>
              <v-list-item-group color="blue lighten-1">
                <v-list-item :color="$vuetify.theme.dark ? '' : 'deep-purple lighten-4'" :to="item.to" :disabled="item.disable" v-for="(item, index) in items.left" :key="index">
                  <v-list-item-icon class="mr-2" size="30">
                    <v-icon :color="$vuetify.theme.dark ? '' : 'grey darken-2'" v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title :class="$vuetify.theme.dark ? 'ml-2' : 'ml-2 brown--text'">
                      {{ $vuetify.lang.t(`$vuetify.${item.title}`) }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action class="d-block text-right">
                    <template v-if="item.status === 0">
                      <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'blue lighten-5 blue--text') + ' text-caption'" label small outlined>
                        SOON
                      </v-chip>
                    </template>
                    <template v-else-if="item.status === 1">
                      <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'red lighten-5 red--text') + ' text-caption'" label small outlined>
                        BETA
                      </v-chip>
                    </template>
                    <template v-else-if="item.status === 2">
                      <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'green lighten-5 green--text') + ' text-caption'" label small outlined>
                        NEW
                      </v-chip>
                    </template>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-col>
        <v-divider vertical />
        <v-col cols="12" md="6" sm="12">
          <v-card-text>
            <v-list class="pa-0 rounded-menu" rounded>
              <v-list-item-group color="blue lighten-1">
                <v-list-item :to="item.to" :disabled="item.disable" v-for="(item, index) in items.right" :key="index">
                  <v-list-item-icon class="mr-2" size="30">
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title >
                      {{ $vuetify.lang.t(`$vuetify.${item.title}`) }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action class="d-block text-right">
                    <template v-if="item.status === 0">
                      <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'blue lighten-5 blue--text') + ' text-caption'" label small outlined>
                        SOON
                      </v-chip>
                    </template>
                    <template v-else-if="item.status === 1">
                      <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'red lighten-5 red--text') + ' text-caption'" label small outlined>
                        BETA
                      </v-chip>
                    </template>
                    <template v-else-if="item.status === 2">
                      <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'green lighten-5 green--text') + ' text-caption'" label small outlined>
                        NEW
                      </v-chip>
                    </template>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<script>

  export default {
    name: "v-component-menu-default",
    data() {
      return {
        items: {
          left: [
            {icon: 'mdi-rhombus-split-outline', title: 'lang_365', to: '/trade/eth-usd?type=future', status: 1, disable: false},
            {icon: 'mdi-rhombus-split-outline', title: 'lang_31', to: '/trade/eth-usd?type=spot', status: 1, disable: false},
            {icon: 'mdi-format-rotate-90', title: 'lang_361', to: '/trade/goog-usd?type=stock', status: 1, disable: false}
          ],
          right: [
            {icon: 'mdi-handshake-outline', title: 'lang_362', to: '/', status: 0, disable: true},
            {icon: 'mdi-elevator', title: 'lang_363', to: '/', status: 0, disable: true}
          ]
        }
      }
    }
  }

</script>

<style>

</style>
