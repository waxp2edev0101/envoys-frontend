<template>
  <v-card class="ma-1 rounded-lg" height="500" elevation="0">

    <!-- Start: app bar element -->
    <v-app-bar v-if="!header" color="transparent" height="50" flat>
      <v-tabs fixed-tabs color="primary" v-model="eyelet" show-arrows>
        <v-tab class="text-capitalize">{{ $vuetify.lang.t('Position') }}</v-tab>
        <v-tab class="text-capitalize">{{ $vuetify.lang.t('Following Orders') }} ({{ order.following }})</v-tab>
        <v-tab class="text-capitalize">{{ $vuetify.lang.t('Open Orders') }} ({{ order.open }})</v-tab>
        <v-tab class="text-capitalize">{{ $vuetify.lang.t('Order History') }}</v-tab>
        <!-- <v-tab class="text-capitalize">{{ $vuetify.lang.t('Order Details') }}</v-tab> -->
        <v-tab class="text-capitalize">{{ $vuetify.lang.t('Fund Record') }}</v-tab>
      </v-tabs>
    </v-app-bar>
    <!-- End: app bar element -->

    <v-divider />

    <template>
      <v-tabs-items v-model="eyelet">
        <v-tab-item>
          <v-component-future-position />
        </v-tab-item>
        <v-tab-item>Following Orders</v-tab-item>
        <v-tab-item>Open Orders</v-tab-item>
        <v-tab-item>
          <v-component-future-history
            :length="length"
            :header="header"
            :order="order"
            :count="count"
            :overlay="overlay"
            :page="page"
            :hover="hover"
            :limit="limit"
          />
        </v-tab-item>
        <v-tab-item>Order Details</v-tab-item>
        <v-tab-item>Fund Record</v-tab-item>
      </v-tabs-items>
    </template>
    <v-overlay v-if="!$auth.loggedIn" :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" absolute>
      <v-btn color="black--text yellow darken-1 text-capitalize" to="/signin" large elevation="0">{{ $vuetify.lang.t('$vuetify.lang_29') }}</v-btn>
    </v-overlay>

    <template v-if="$auth.loggedIn">
      <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" :value="overlay">
        <v-progress-circular color="yellow darken-3" indeterminate size="50" />
      </v-overlay>
    </template>

  </v-card>
</template>

<script>
  import FuturePostion from './Portfolio/Position.vue'
  import FutureHistory from './Portfolio/History.vue'

  export default {
    name: "v-component-future-portfolio",
    components: {
      'v-component-future-history': FutureHistory,
      'v-component-future-position': FuturePostion,
    },
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
          following: 0,
          open: 0,
        },
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
        this.$axios.$post(this.$api.provider.getPair, {base_unit: this.parse.base(), quote_unit: this.parse.quote()}).then((response) => {
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

          this.$axios.$post(this.$api.future.getOrders, {
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
            console.log('future order history', response)
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
        this.$axios.$post(this.$api.spot.cancelOrder, {
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