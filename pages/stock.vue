<template>
  <div>
    <template v-if="create">
      <v-container>
        <v-component-stock-agent-create @back="back" />
      </v-container>
    </template>
    <template v-else>
      <section class="pa-0 main-role">

        <v-row class="ma-1">

          <!-- Start: assets list component -->
          <v-col class="pa-1" cols="12" md="3" sm="12">
            <v-card class="fill-height rounded-lg" elevation="0">

              <template v-if="agent.type === 'agent'">

                <v-list dense>
                  <v-list-item>
                    <v-list-item-icon class="mt-3 mr-3">
                      <v-icon>mdi-shield-account-variant-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      Счет агента <small><i>{{ agent.name }}</i></small>
                    </v-list-item-content>
                    <v-list-item-action>
                      <template v-if="agent.status === 'rejected'">
                        <v-chip class="ml-0 mr-2 black--text" label small>
                          {{ agent.status }}
                        </v-chip>
                      </template>
                      <template v-else-if="agent.status === 'pending'">
                        <v-chip class="ml-0 mr-2 black--text" label small>
                          {{ agent.status }}
                        </v-chip>
                      </template>
                      <template v-else-if="agent.status === 'access'">
                        <v-chip class="ml-0 mr-2 black--text" label small>
                          {{ agent.status }}
                        </v-chip>
                      </template>
                      <template v-else-if="agent.status === 'blocked'">
                        <v-chip class="ml-0 mr-2 black--text" label small>
                          {{ agent.status }}
                        </v-chip>
                      </template>
                    </v-list-item-action>

                    <v-list-item-action v-if="agent.status === 'rejected' || agent.status === 'pending' || agent.status === 'access'">
                      <v-menu offset-x offset-y bottom center :nudge-left="80" content-class="elevation-1" transition="slide-y-transition">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-cog
                          </v-icon>
                        </template>
                        <v-list>
                          <v-list-item @click="deleteAgent" link>
                            <v-list-item-title>Удалить агента</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-list-item-action>

                  </v-list-item>
                </v-list>

              </template>
              <template v-else-if="agent.type === 'broker'">

                <v-list dense>
                  <v-list-item>
                    <v-list-item-icon class="mt-3 mr-3">
                      <v-icon>mdi-police-badge-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      Счет брокера
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-chip class="ml-0 mr-2 black--text" label small>
                        {{ agent.name }}
                      </v-chip>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>

              </template>
              <template v-else>
                <v-card-actions>
                  <v-btn style="text-transform: none !important;" color="black--text yellow darken-1 text-capitalize" @click="create = true" block large elevation="0">
                    Открыть торговый счет
                  </v-btn>
                </v-card-actions>
              </template>

              <v-divider />

              <template v-if="agent.type === 'broker'">
                <v-card-text>
                  <v-list class="pa-0 rounded-menu" rounded>
                    <v-list-group color="primary">
                      <template v-slot:activator>
                        <v-list-item-icon class="mr-3">
                          <v-icon>mdi-contain</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title class="text-uppercase mr-2">Брокер</v-list-item-title>
                      </template>
                      <v-list-item v-for="(item, i) in navs.broker" :key="i" :to="`/stock/${item.to}`" exact link>
                        <v-list-item-icon class="mr-3">
                          <v-icon v-text="item.icon"></v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          {{ item.title }}
                        </v-list-item-content>
                        <v-list-item-action>
                          <template v-if="item.to === 'requests'">
                            <v-badge v-if="counts.request" class="mt-3" color="black--text yellow darken-1" :content="counts.request"></v-badge>
                          </template>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list-group>
                  </v-list>
                </v-card-text>
                <v-divider />
              </template>

              <v-component-stock-assets />
            </v-card>
          </v-col>
          <!-- End: assets list component -->

          <!-- Start: child container -->
          <v-col class="pa-1" cols="12" md="9" sm="12">
            <v-card class="fill-height rounded-lg" elevation="0">
              <template v-if="this.agent.id">
                <nuxt-child />
              </template>
              <template v-else>
                <v-layout fill-height wrap>
                  <v-flex/>
                  <v-flex align-self-center class="text-center my-16" md4 mx5 sm6 xl3>
                    <v-img class="ma-auto" width="250" src="/asset/3.png" />
                    <h2>Создайте торговый счет что бы начать торговать.</h2>
                  </v-flex>
                  <v-flex/>
                </v-layout>
              </template>
            </v-card>
          </v-col>
          <!-- End: child container -->

        </v-row>

      </section>
    </template>
  </div>
</template>

<script>

  import Create from "../components/Stock/Create";
  import Assets from "../components/Stock/Assets";

  export default {
    auth: true,
    components: {
      'v-component-stock-agent-create': Create,
      'v-component-stock-assets': Assets
    },
    data() {
      return {
        create: false,
        agent: {
          id: 0,
          user_id: 0,
          broker_id: 0,
          name: null,
          type: 0,
          status: null,
        },
        counts: {
          request: 0
        }
      }
    },
    mounted() {

      this.$publish.bind('status/agent', (data) => {
        if (Number(this.agent.user_id) === data.user_id) {
          this.agent.status = data.status;
        }
      });

      this.$publish.bind('create/agent', (data) => {
        if (Number(this.agent.id) === data.broker_id) {
          this.counts.request +=1;
        }
        if (Number(this.$auth.$state.user.fields[0].id) === data.user_id) {
          this.agent = Object.assign(this.agent, data);
        }
      });

      this.$nuxt.$on('agent/count', () => {
        this.counts.request -=1;
      });

      this.getAgent();
    },
    methods: {

      /**
       * @param b
       */
      back(b) {
        this.create = b;
      },

      /**
       *
       */
      deleteAgent() {
        this.$axios.$post(this.$api.stock.deleteAgent, {id: this.agent.id}).then(() => {
          this.agent.id = 0;
          this.agent.user_id = 0;
          this.agent.broker_id = 0;
          this.agent.name = null;
          this.agent.type = null;
          this.agent.status = null;
        });
      },

      /**
       *
       */
      getRequests() {
        this.$axios.$post(this.$api.stock.getRequests).then((response) => {
          this.counts.request = response.count ?? 0;
        });
      },

      /**
       *
       */
      getAgent() {
        this.$axios.$post(this.$api.stock.getAgent).then((response) => {
          let fields = response.fields ?? [];
          if (fields.length > 0) {
            this.agent.id = fields[0].id;
            this.agent.user_id = fields[0].user_id;
            this.agent.broker_id = fields[0].broker_id ?? 0;
            this.agent.name = fields[0].name ?? null;
            this.agent.type = fields[0].type;
            this.agent.status = fields[0].status;
          }

          this.getRequests();
        });
      },

    },
    computed: {
      navs() {
        return {
          broker: [
            {
              title: 'Запросы',
              icon: "mdi-account-multiple-plus-outline",
              to: 'requests'
            },
            {
              title: 'Мои агенты',
              icon: "mdi-account-multiple-outline",
              to: 'agents'
            },
            {
              title: 'Запросы на вывод',
              icon: "mdi-credit-card-check-outline",
              to: 'withdrawals'
            }
          ]
        }
      }
    }
  }
</script>

<style scoped>

</style>