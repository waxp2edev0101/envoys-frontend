<template>
  <div>
    <v-data-table :class="count > limit ? 'none-radius ' : ''" :items="items" :headers="headlines" :page.sync="page" item-key="id" :server-items-length="length" :items-per-page="limit" hide-default-footer>
      <template v-slot:item.status="{ item }">
        <template v-if="item.status === 'pending'">
          <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
            {{ $vuetify.lang.t('$vuetify.lang_131') }}
          </v-chip>
        </template>
        <template v-else-if="item.status === 'filled'">
          <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
            {{ $vuetify.lang.t('$vuetify.lang_129') }}
          </v-chip>
        </template>
        <template v-else>
          <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
            {{ $vuetify.lang.t('$vuetify.lang_130') }}
          </v-chip>
        </template>
      </template>
      <template v-slot:item.value="{ item }">
        {{ $decimal.format(item.value, 8) }} <b>{{ item.symbol.toUpperCase() }}</b>
      </template>
      <template v-slot:item.create_at="{ item }">
        <div>
          {{ $moment(item.create_at).format('DD MMM') }}
        </div>
        <div>
          <small class="grey--text">{{ $moment(item.create_at).format('hh:mm:ss') }}</small>
        </div>
      </template>
      <template v-slot:item.setting="{ item }">
        <template v-if="item.status === 'pending'">
          <v-menu offset-x offset-y bottom center :nudge-left="80" content-class="elevation-1" transition="slide-y-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">
                mdi-cog
              </v-icon>
            </template>
            <v-list>
              <v-list-item @click="cancelWithdraw(item.id)" link>
                <v-list-item-title>Отменить</v-list-item-title>
              </v-list-item>
              <v-list-item @click="" link>
                <v-list-item-title>Одобрить</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-else-if="item.status === 'filled'">
          <v-icon>
            mdi-check-circle-outline
          </v-icon>
        </template>
        <template v-else>
          <v-icon>
            mdi-account-cancel-outline
          </v-icon>
        </template>
      </template>
    </v-data-table>

    <v-divider v-if="count > limit" />

    <!-- Start: pagination -->
    <v-container v-if="length > 1" class="max-width">
      <v-row justify="center">
        <v-col cols="8">
          <v-pagination v-model="page" total-visible="5" @input="getMore()" :length="length"></v-pagination>
        </v-col>
      </v-row>
    </v-container>
    <!-- End: pagination -->
  </div>
</template>

<script>
  export default {
    name: "v-component-stock-broker-withdrawals",
    data() {
      return {
        items: [],
        limit: 12,
        count: 0,
        length: 0,
        page: 1
      }
    },
    mounted() {
      this.getWithdraws();
    },
    methods: {

      /**
       *
       */
      getMore() {
        this.getWithdraws();
      },

      /**
       *
       */
      getWithdraws() {
        this.$axios.$post(this.$api.stock.getWithdraws, {
          unshift: true,
          limit: this.limit,
          page: this.page
        }).then((response) => {
          this.items = response.fields ?? [];
          this.count = response.count ?? 0;
          this.length = Math.ceil(this.count/this.limit);
        });
      },

      /**
       * @param id
       */
      cancelWithdraw(id) {
        this.$axios.$post(this.$api.stock.cancelWithdraw, {
          id: id,
          unshift: true,
        }).then((response) => {
          if (response.success) {
            this.getWithdraws();
          }
        }).catch((error) => {
          this.$snackbar.open({
            content: `${error.response.data.code}: ${error.response.data.message}`,
            color: 'red darken-2'
          });
        });
      }
    },
    computed: {

      headlines() {
        return [
          {
            text: 'Status',
            align: 'start',
            sortable: false,
            value: 'status'
          }, {
            text: 'Name',
            align: 'start',
            sortable: false,
            value: 'name'
          }, {
            text: 'Quantity',
            align: 'start',
            sortable: false,
            value: 'value'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_118'),
            align: 'start',
            sortable: false,
            value: 'create_at'
          }, {
            text: 'Setting',
            align: 'end',
            sortable: false,
            value: 'setting'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>