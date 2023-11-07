<template>
  <v-card class="ma-1 rounded-lg" height="500" elevation="0">

    <!-- Start: app bar element -->
    <v-app-bar v-if="!header" color="transparent" height="50" flat>
      <v-tabs fixed-tabs color="primary" v-model="eyelet" show-arrows>
        <v-tab class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_136') }}</v-tab>
        <v-tab class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_137') }}</v-tab>
        <v-tab class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_296') }}</v-tab>
      </v-tabs>
    </v-app-bar>
    <!-- End: app bar element -->

    <v-divider />

    <template v-if="order.items.length">

      <template v-if="this.$vuetify.breakpoint.mobile">
        <v-virtual-scroll @mouseover="hover = true" @mouseleave="hover = false" :class="hover ? '' : 'overflow-y-hidden'" bench="0" :items="order.items" height="386" :item-height="eyelet ? 289 : 337">
          <template v-slot:default="{ item }">

            <!-- Start: data table -->
            <v-simple-table style="border-bottom: 1px solid #ececec">
              <template v-slot:default>
                <tbody>
                <tr>
                  <td><b>{{ $vuetify.lang.t("$vuetify.lang_132") }}</b></td>
                  <td class="text-right">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                          <span v-bind="attrs" v-on="on">
                            <template v-if="item.assigning === 'sell'">
                              <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'red lighten-5 red--text') + ' ml-0 mr-2'" label small>
                                <v-icon color="red" size="15">
                                  mdi-arrow-top-left
                                </v-icon>
                                {{ $vuetify.lang.t('$vuetify.lang_58') }}
                              </v-chip>
                            </template>
                            <template v-else>
                              <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'blue lighten-5 blue--text') + ' ml-0 mr-2'" label small>
                                <v-icon color="blue" size="15">
                                  mdi-arrow-bottom-left
                                </v-icon>
                                {{ $vuetify.lang.t('$vuetify.lang_57') }}
                              </v-chip>
                            </template>
                          </span>
                      </template>
                      <span>
                          <div>
                            {{ $moment(item.create_at).format('DD MMM') }}
                          </div>
                          <div>
                            <small>{{ $moment(item.create_at).format('hh:mm:ss') }}</small>
                          </div>
                        </span>
                    </v-tooltip>
                  </td>
                </tr>
                <tr>
                  <td>{{ $vuetify.lang.t("$vuetify.lang_133") }}</td>
                  <td class="text-right">
                    <b class="text-uppercase">{{ item.base_unit }}/{{ item.quote_unit }}</b>
                  </td>
                </tr>
                <tr>
                  <td>{{ $vuetify.lang.t("$vuetify.lang_53") }}</td>
                  <td class="text-right">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                          <span v-bind="attrs" v-on="on">
                            {{ $decimal.format(item.quantity, order.base_decimal) }} {{ item.base_unit.toUpperCase() }}
                          </span>
                      </template>
                      <span>
                          <template v-if="item.value">
                            {{ $decimal.format(item.value, order.base_decimal) }} / {{ $decimal.format(item.quantity, order.base_decimal) }}
                          </template>
                          <template v-else>
                            {{ $vuetify.lang.t('$vuetify.lang_303') }}
                          </template>
                        </span>
                    </v-tooltip>
                  </td>
                </tr>
                <tr>
                  <td>{{ $vuetify.lang.t("$vuetify.lang_52") }}</td>
                  <td class="text-right">
                    {{ $decimal.format(item.price, 8) }} {{ item.quote_unit.toUpperCase() }}
                  </td>
                </tr>
                <tr>
                  <td>{{ $vuetify.lang.t("$vuetify.lang_56") }}</td>
                  <td class="text-right">
                    {{ $decimal.format($decimal.mul(item.quantity, item.price), order.quote_decimal) }} {{ item.quote_unit.toUpperCase() }}
                  </td>
                </tr>
                <tr>
                  <td>{{ $vuetify.lang.t("$vuetify.lang_81") }}</td>
                  <td class="text-right">
                    <template v-if="item.status === 'pending'">
                      <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
                        {{ $vuetify.lang.t('$vuetify.lang_131') }}
                      </v-chip>
                    </template>
                    <template v-if="item.status === 'filled'">
                      <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
                        {{ $vuetify.lang.t('$vuetify.lang_129') }}
                      </v-chip>
                    </template>
                    <template v-if="item.status === 'cancel'">
                      <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
                        {{ $vuetify.lang.t('$vuetify.lang_130') }}
                      </v-chip>
                    </template>
                  </td>
                </tr>
                <tr v-if="!eyelet">
                  <td>{{ $vuetify.lang.t("$vuetify.lang_222") }}</td>
                  <td class="text-right">
                    <v-icon color="red" @click="cancelOrder(item.id)">
                      mdi-trash-can-outline
                    </v-icon>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <!-- End: data table -->

          </template>
        </v-virtual-scroll>
      </template>
      <template v-else>

        <!-- Start: data table -->
        <v-simple-table>
          <template v-slot:default>
            <thead v-if="header" style="height: 50px">
            <tr>
              <th class="text-left">
                {{ $vuetify.lang.t('$vuetify.lang_132') }}
              </th>
              <th class="text-left">
                {{ $vuetify.lang.t('$vuetify.lang_133') }}
              </th>
              <th class="text-left">
                {{ $vuetify.lang.t('$vuetify.lang_53') }}
              </th>
              <th class="text-left">
                {{ $vuetify.lang.t('$vuetify.lang_52') }}
              </th>
              <th class="text-left">
                {{ $vuetify.lang.t('$vuetify.lang_56') }}
              </th>
              <th class="text-center">
                {{ $vuetify.lang.t('$vuetify.lang_81') }}
              </th>
              <th v-if="eyelet === 0" class="text-center">
                x
              </th>
            </tr>
            </thead>
            <tbody @mouseover="header = true" @mouseleave="header = false">
            <tr v-for="item in order.items" :key="item.id">
              <td>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">
                        <template v-if="item.assigning === 'sell'">
                          <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'red lighten-5 red--text') + ' ml-0 mr-2'" label small>
                            <v-icon color="red" size="15">
                              mdi-arrow-top-left
                            </v-icon>
                            {{ $vuetify.lang.t('$vuetify.lang_58') }}
                          </v-chip>
                        </template>
                        <template v-else>
                          <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'blue lighten-5 blue--text') + ' ml-0 mr-2'" label small>
                            <v-icon color="blue" size="15">
                              mdi-arrow-bottom-left
                            </v-icon>
                            {{ $vuetify.lang.t('$vuetify.lang_57') }}
                          </v-chip>
                        </template>
                      </span>
                  </template>
                  <span>
                      <div>
                        {{ $moment(item.create_at).format('DD MMM') }}
                      </div>
                      <div>
                        <small>{{ $moment(item.create_at).format('hh:mm:ss') }}</small>
                      </div>
                    </span>
                </v-tooltip>
              </td>
              <td>
                <b class="text-uppercase">{{ item.base_unit }}/{{ item.quote_unit }}</b>
              </td>
              <td>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">
                        {{ $decimal.format(item.quantity, order.base_decimal) }} {{ item.base_unit.toUpperCase() }}
                      </span>
                  </template>
                  <span>
                      <template v-if="item.value">
                        {{ $decimal.format(item.value, order.base_decimal) }} / {{ $decimal.format(item.quantity, order.base_decimal) }}
                      </template>
                      <template v-else>
                        {{ $vuetify.lang.t('$vuetify.lang_303') }}
                      </template>
                    </span>
                </v-tooltip>
              </td>
              <td>
                {{ $decimal.format(item.price, 8) }} {{ item.quote_unit.toUpperCase() }}
              </td>
              <td>
                {{ $decimal.format($decimal.mul(item.quantity, item.price), order.quote_decimal) }} {{ item.quote_unit.toUpperCase() }}
              </td>
              <td class="text-center">
                <template v-if="item.status === 'pending'">
                  <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
                    {{ $vuetify.lang.t('$vuetify.lang_131') }}
                  </v-chip>
                </template>
                <template v-if="item.status === 'filled'">
                  <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
                    {{ $vuetify.lang.t('$vuetify.lang_129') }}
                  </v-chip>
                </template>
                <template v-if="item.status === 'cancel'">
                  <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
                    {{ $vuetify.lang.t('$vuetify.lang_130') }}
                  </v-chip>
                </template>
              </td>
              <td class="text-center" v-if="item.status === 'pending'">
                <v-icon color="red" @click="cancelOrder(item.id)">
                  mdi-trash-can-outline
                </v-icon>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
        <!-- End: data table -->

      </template>

      <v-divider v-if="count > limit" />

      <!-- Start: pagination -->
      <v-container v-if="length > 1" class="max-width" style="margin-top: -2px;">
        <v-row justify="center">
          <v-col cols="8">
            <v-pagination v-model="page" @input="getMore()" :length="length"></v-pagination>
          </v-col>
        </v-row>
      </v-container>
      <!-- End: pagination -->

    </template>
    <template v-else-if="!overlay">

      <v-layout style="height: 449px" wrap>
        <v-flex/>
        <v-flex class="text-center mx-5" align-self-center>
          <div>
            <v-icon size="50">
              mdi-database-remove-outline
            </v-icon>
          </div>
          <h4 class="text-overline">{{ $vuetify.lang.t('$vuetify.lang_135') }}</h4>
        </v-flex>
        <v-flex/>
      </v-layout>

      <v-overlay v-if="!$auth.loggedIn" :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" absolute>
        <v-btn color="black--text yellow darken-1 text-capitalize" to="/signin" large elevation="0">{{ $vuetify.lang.t('$vuetify.lang_29') }}</v-btn>
      </v-overlay>
    </template>

    <template v-if="$auth.loggedIn">
      <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" :value="overlay">
        <v-progress-circular color="yellow darken-3" indeterminate size="50" />
      </v-overlay>
    </template>

  </v-card>
</template>

<script>
export default {
  name: "v-component-history",
  data() {
    return {
      eyelet: 0,
      status: null,
      overlay: true,
      header: false,
      hover: false,
      query: '',
      limit: 8,
      count: 0,
      length: 0,
      page: 1,
      order: {
        base_decimal: 2,
        quote_decimal: 8,
        items: [],
      }
    }
  },
  watch: {
    $route() {
      this.eyelet = 0;
      this.getOrders("pending");
    },
    eyelet(e) {
      let index = null;
      switch (e) {
        case 0:
          index = "pending";
          break
        case 1:
          index = "filled";
          break
        case 2:
          index = "cancel";
          break
      }
      this.getOrders(index)
    }
  },
  mounted() {
    this.getOrders("pending");

    /**
     * Отслеживаем события нового ордера.
     * @return {callback}:
     * @object {base_unit: string},
     * @object {id: int},
     * @object {assigning: string}
     * @object {price: float},
     * @object {quantity: float},
     * @object {quote_unit: string},
     * @object {create_at: int},
     * @object {user_id: int},
     * @object {value: float}
     */
    this.$publish.bind('order/create', (data) => {
      if (

        this.eyelet === 0 &&

        // Сверяем локальный штат пользователя
        // это у нас пользовательский [id] с полученным из события пользовательским [user_id],
        // если аргументы совпадают то это значит что ордер сработал частично или полностью.
        data.user_id === Number(this.$auth.$state.user.fields[0].id) &&

        // Сверяем принадлежат ли новые события к данному активу,
        // если аргументы совпадают то привязываем полученные данные из события к данному активу.
        data.base_unit === this.parse.base() &&
        data.quote_unit === this.parse.quote()

      ) {

        this.count += 1;
        this.length = Math.ceil(this.count / this.limit);

        // Добавляем новый ордер в массив.
        this.order.items.unshift(Object.assign({}, data));

        if (this.order.items.length > this.limit) {
          this.order.items.splice(-1)
        }
      }
    });

    /**
     * Отслеживаем статус ордера.
     * @return {callback}:
     * @object {base_unit: string},
     * @object {id: int},
     * @object {assigning: string}
     * @object {price: float},
     * @object {quantity: float},
     * @object {quote_unit: string},
     * @object {create_at: int},
     * @object {user_id: int},
     * @object {value: float}
     */
    this.$publish.bind('order/status', (data) => {
      if (!this.$auth.loggedIn) {
        return false;
      }
      if (
        // Сверяем принадлежат ли новые события к данному активу,
        // если аргументы совпадают то привязываем полученные данные из события к данному активу.
        data.base_unit === this.parse.base() &&
        data.quote_unit === this.parse.quote()
      ) {
        let index = this.order.items.map((o) => Number(o.id)).indexOf(data.id);
        let matching = this.order.items.some((o) => Number(o.id) === data.id);
        if (matching) {
          switch (data.status) {
            case "filled":
              // Удаляем ордер с массива по идентификатору.
              this.order.items.splice(index, 1);
              break;
            case "pending":
              // Обновляем количество монет ордера.
              this.order.items[index].value = data.value;
              break
          }
          // Озвучиваем действие звуковым сопровождением.
          this.$single.play('trade');
        }
      }
    });

  },
  methods: {

    /**
     *
     */
    getPair() {
      this.$axios.$post(this.$api.stock.getPair, {base_unit: this.parse.base(), quote_unit: this.parse.quote()}).then((response) => {
        this.order.base_decimal = response.fields[0].base_decimal ?? 2;
        this.order.quote_decimal = response.fields[0].quote_decimal ?? 8;
      });
    },

    /**
     * @param status
     * @returns {boolean}
     */
    getOrders(status) {
      this.status = status;

      this.getPair();

      if (!this.$auth.loggedIn) {
        this.overlay = false;
      } else {
        this.overlay = true;

        this.$axios.$post(this.$api.stock.getOrders, {
          // Назначение [sell:1] - [buy:0] - [default:null].
          assigning: null,
          // Имя актива (symbol-base).
          base_unit: this.parse.base(),
          // Имя актива (symbol-quote).
          quote_unit: this.parse.quote(),
          // Показывать количество записей в массиве.
          limit: this.limit,
          // Показывать страницу по номеру.
          page: this.page,
          // Показывать записи только если я их владелец.
          owner: true,
          // Показывать записи если они со статусом в ожидании.
          status: status
        }).then((response) => {

          // Записываем список ордеров в ожидании в массив.
          this.order.items = response.fields ?? [];
          this.count = response.count ?? 0;
          this.length = Math.ceil(this.count / this.limit);
          this.overlay = false;
        });
      }
    },

    /**
     *
     */
    getMore() {
      this.getOrders(this.status);
    },

    /**
     * @param item
     * @returns {*|number}
     */
    getFees(item) {
      if (item.assigning) {
        return this.$decimal.truncate(this.$decimal.mul(this.$decimal.div(this.$decimal.mul(item.quantity, item.price), 100), item.fees), 0);
      } else {
        return this.$decimal.truncate(this.$decimal.mul(this.$decimal.div(item.quantity, 100), item.fees), 0);
      }
    },

    /**
     * @param id
     */
    cancelOrder(id) {
      this.$axios.$post(this.$api.stock.cancelOrder, {
        // Идентификатор ордера для удаления.
        id: id
      }).then(() => {

        // Удаляем ордер с массива по идентификатору.
        this.count -= 1;
        this.length = Math.ceil(this.count / this.limit);

        let index = this.order.items.map((o) => Number(o.id)).indexOf(Number(id));
        if (index !== -1) {
          this.order.items.splice(index, 1);
        }

        this.$nuxt.$emit('order/cancel', null);
        this.$single.play('delete');

        if (!this.order.items.length && this.count > 0) {
          this.getMore();
        }

        if (!this.order.items.length) {
          this.header = false;
        }
      }).catch((error) => {
        this.$snackbar.open({
          content: `${error.response.data.code}: ${error.response.data.message}`,
          color: 'red darken-2'
        });
      });
    },
  },
  computed: {

    /**
     * @returns {{quote: (function(): string), base: (function(): string)}}
     */
    parse() {
      return {
        base: () => {
          return this.$route.params.unit.split('-')[0]
        },
        quote: () => {
          return this.$route.params.unit.split('-')[1]
        }
      }
    }
  }
}
</script>

<style scoped>

</style>