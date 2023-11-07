<template>
  <div class="stock">
    <div>

      <div class="text-center mb-6">
        <div>
          <v-img style="margin: 0 auto;" max-width="400" src="/png/2.png"></v-img>
        </div>
        Биржи ценных бумаг являются важными инструментами финансового рынка, так как они обеспечивают доступ к капиталу для компаний и предоставляют инвесторам возможность заработать на росте ценных бумаг.
        <div class="mt-2">
          <v-btn @click="handleBack" color="black--text yellow darken-1 text-capitalize" large elevation="0">
            Назад
          </v-btn>
        </div>
      </div>

      <template v-if="agent.item.status === 'pending'">
        <v-alert icon="mdi-information-outline">
          Ожидайте вашу заявку отправлено на рассмотрения брокеру <b>№{{ agent.item.id }} - {{ agent.item.name }}</b>, после того как заявка будет одобрена, вам будет доступно торговая площадка ценными бумагами.
        </v-alert>
      </template>

      <template v-else-if="agent.item.status === 'access'">

        <template v-if="agent.item.type === 0">
          <v-alert text type="success" icon="mdi-check-circle-outline">
            Вы успешно создали торговый счет, брокер <b>№{{ agent.item.id }} - {{ agent.item.name }}</b> одобрил вашу заявку, удачной вам торговли, и спасибо что выбрали именно нас.
          </v-alert>
        </template>
        <template v-else>
          <v-alert text type="success" icon="mdi-check-circle-outline">
            Вы успешно создали торговый счет брокера <b>№{{ agent.item.id }} - {{ agent.item.name }}</b>, удачной вам торговли, и спасибо что выбрали именно нас.
          </v-alert>
        </template>

      </template>

      <template v-else>

        <!-- Start: app bar element -->
        <v-app-bar class="transparent" height="50" flat>
          <v-tabs fixed-tabs color="primary" v-model="eyelet">
            <v-tab class="text-capitalize">Открыть торговый счет агента</v-tab>
            <v-tab class="text-capitalize">Открыть торговый счет брокера</v-tab>
          </v-tabs>
        </v-app-bar>
        <!-- End: app bar element -->

        <v-divider />

        <v-tabs-items class="transparent mt-8" v-model="eyelet">
          <v-tab-item :value="0">

            <v-stepper max-width="400" class="transparent ma-auto" v-model="next.agent" vertical flat>
              <v-stepper-step color="yellow darken-1" :complete="next.agent > 1" step="1">
                Пройдите верификацию (KYC Premium).
                <small>Ето может занять некоторое время</small>
              </v-stepper-step>

              <v-stepper-content step="1">

                <template v-if="blocks.premium.secure">
                  <v-btn style="text-transform: none !important;" color="black--text yellow darken-1 text-capitalize" @click="next.agent = 2" large elevation="0">
                    Продолжить
                  </v-btn>
                </template>
                <template v-else>
                  <v-btn :disabled="process" to="/kyc" style="text-transform: none !important;" color="black--text yellow darken-1 text-capitalize" large elevation="0">
                    Начать проверку личности
                  </v-btn>
                </template>

              </v-stepper-content>

              <v-stepper-step color="yellow darken-1" :complete="next.agent > 2" step="2">
                Выберите своего брокера.
                <small>Список только с проверенными брокерами</small>
              </v-stepper-step>

              <v-stepper-content step="2">

                <v-card>
                  <v-card-actions>
                    <v-text-field color="primary" v-model="search" v-on:keyup="getBrokers"  dense hide-details outlined label="Названия брокера" prepend-inner-icon="mdi-layers-search-outline" />
                  </v-card-actions>
                  <v-divider />
                  <template v-if="agent.items.length > 0">

                    <v-list class="py-0">
                      <v-list-item-group v-model="broker">
                        <v-virtual-scroll bench="0" :items="agent.items" height="250" :item-height="48">
                          <template v-slot:default="{ item }">
                            <v-list-item :key="item.id">
                              <template v-slot:default="{ active }">
                                <v-list-item-content>
                                  <v-list-item-title>{{ item.id }} - {{ item.name }}</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-action>
                                  <v-icon v-if="!active" color="grey lighten-1">
                                    mdi-star-outline
                                  </v-icon>
                                  <v-icon v-else color="yellow darken-3">
                                    mdi-star
                                  </v-icon>
                                </v-list-item-action>
                              </template>
                            </v-list-item>
                          </template>
                        </v-virtual-scroll>
                      </v-list-item-group>
                    </v-list>

                  </template>
                  <template v-else>
                    <v-card-text class="text-center">
                      <template v-if="search.length > 0">
                        По вашому запросу ({{ search }}) нечего не найдено.
                      </template>
                      <template v-else>
                        Брокеры не найдены.
                      </template>
                    </v-card-text>
                  </template>

                  <template v-if="agent.items[broker]">
                    <v-divider />
                    <v-card-actions>
                      <v-btn style="text-transform: none !important;" color="black--text yellow darken-1 text-capitalize" @click="next.agent = 3" block large elevation="0">
                        Продолжить
                      </v-btn>
                    </v-card-actions>
                  </template>

                </v-card>

              </v-stepper-content>

              <v-stepper-step color="yellow darken-1" step="3">
                Открыть торговый счет (Агента).
                <small>Завершение процедуры открытия торгового счета</small>
              </v-stepper-step>
              <v-stepper-content step="3">
                <v-btn style="text-transform: none !important;" color="black--text yellow darken-1 text-capitalize" @click="setAgent('agent')" large elevation="0">
                  Открыть торговый счет
                </v-btn>
              </v-stepper-content>
            </v-stepper>

          </v-tab-item>
          <v-tab-item :value="1">

            <v-stepper max-width="400" class="transparent ma-auto" v-model="next.broker" vertical flat>
              <v-stepper-step color="yellow darken-1" :complete="next.broker > 1" step="1">
                Пройдите верификацию (KYC Corporate).
                <small>Ето может занять некоторое время</small>
              </v-stepper-step>

              <v-stepper-content step="1">

                <template v-if="blocks.corporate.secure">
                  <v-btn style="text-transform: none !important;" color="black--text yellow darken-1 text-capitalize" @click="next.broker = 2" large elevation="0">
                    Продолжить
                  </v-btn>
                </template>
                <template v-else>
                  <v-btn :disabled="process" to="/kyc" style="text-transform: none !important;" color="black--text yellow darken-1 text-capitalize" large elevation="0">
                    Начать проверку личности
                  </v-btn>
                </template>

              </v-stepper-content>

              <v-stepper-step color="yellow darken-1" :complete="next.broker > 2" step="2">
                Названия для списка брокеров.
                <small>Например: Invest Groups LTD</small>
              </v-stepper-step>

              <v-stepper-content step="2">
                <v-text-field class="mt-1 mb-2" color="primary" outlined label="Названия брокера" v-model="name" hide-details></v-text-field>
                <template v-if="name.length > 5">
                  <v-btn style="text-transform: none !important;" color="black--text yellow darken-1 text-capitalize" @click="next.broker = 3" large elevation="0">
                    Продолжить
                  </v-btn>
                </template>
              </v-stepper-content>

              <v-stepper-step color="yellow darken-1" step="3">
                Открыть торговый счет (Брокера).
                <small>Завершение процедуры открытия торгового счета</small>
              </v-stepper-step>
              <v-stepper-content step="3">
                <v-btn style="text-transform: none !important;" color="black--text yellow darken-1 text-capitalize" @click="setAgent('broker')" large elevation="0">
                  Открыть торговый счет
                </v-btn>
              </v-stepper-content>
            </v-stepper>

          </v-tab-item>
        </v-tabs-items>

      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: "v-component-stock-agent-create",
    data() {
      return {
        process: false,
        eyelet: 0,
        limit: 50,
        page: 1,
        next: {
          agent: 1,
          broker: 1
        },
        broker: 0,
        search: '',
        name: '',
        agent: {
          items: [],
          item: {
            id: 0,
            user_id: 0,
            broker_id: 0,
            name: null,
            type: 0,
            status: null
          }
        },
        blocks: {
          premium: {
            secure: false
          },
          corporate: {
            secure: false
          }
        },
        back: false
      }
    },
    mounted() {
      this.getAgent();
    },
    methods: {

      handleBack() {
        this.$emit('back', this.back)
      },

      /**
       * @param type
       */
      setAgent(type) {
        this.$axios.$post(this.$api.stock.setAgent, {name: this.name, type: type, broker_id: this.broker ? this.agent.items[this.broker].id : 0}).then((response) => {
          let fields = response.fields ?? [];
          if (fields.length > 0) {
            this.agent.item.id = fields[0].id;
            this.agent.item.user_id = fields[0].user_id;
            this.agent.item.broker_id = fields[0].broker_id ?? 0;
            this.agent.item.name = fields[0].name ?? null;
            this.agent.item.type = fields[0].type;
            this.agent.item.status = fields[0].status;
          }
        }).catch((error) => {
          this.$snackbar.open({
            content: `${error.response.data.code}: ${error.response.data.message}`,
            color: 'red darken-2'
          });
        });
      },

      /**
       *
       */
      getBrokers() {
        this.$axios.$post(this.$api.stock.getBroker, {
          search: this.search,
          limit: this.limit,
          page: this.page
        }).then((response) => {
          this.agent.items = response.fields ?? [];
        });
      },

      /**
       *
       */
      getAgent() {
        this.$axios.$post(this.$api.stock.getAgent).then((response) => {
          let fields = response.fields ?? [];
          if (fields.length > 0) {
            this.agent.item.id = fields[0].id;
            this.agent.item.user_id = fields[0].user_id;
            this.agent.item.broker_id = fields[0].broker_id ?? 0;
            this.agent.item.name = fields[0].name ?? null;
            this.agent.item.type = fields[0].type ?? 0;
            this.agent.item.status = fields[0].status;
          }
        });

        this.getStatus();
        this.getBrokers();
      },

      /**
       *
       */
      getStatus() {
        this.$axios.$post(this.$api.kyc.getStatus, {id: this.$auth.$state.user.fields[0].id}).then((response) => {
          if (Object.keys(response).length > 0) {
            this.process = response.process ?? false;
            let type = String(response.type).toLowerCase();

            if (type !== 'undefined') {
              if (response.secure) {
                switch (type) {
                  case 'premium':
                    this.blocks[type].secure = response.secure;
                    break
                  case 'corporate':
                    this.blocks[type].secure = response.secure;
                    this.blocks['premium'].secure = response.secure;
                    break
                }
              }
            }
          }
        });
      }
    }
  }
</script>

<style scoped>
  .stock {
    height: calc(100vh - 64px);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media only screen and (max-width: 960px) {
    .stock {
      height: auto !important;
    }
  }
</style>