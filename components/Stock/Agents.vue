<template>
  <div style="height: 100%;">

    <template v-if="items.length">

      <!-- Start: data table -->
      <v-data-table :class="count > limit ? 'none-radius ' : ''" :headers="headlines" :items="items" :page.sync="page" item-key="id" :server-items-length="length" :items-per-page="limit" hide-default-footer>
        <template v-slot:item.user_id="{ item }">
          <v-chip class="ml-0 mr-2 black--text" label small>
            #{{ item.user_id }}
          </v-chip>
        </template>
        <template v-slot:item.name="{ item }">
          <b>{{ item.name }}</b>
        </template>
        <template v-slot:item.email="{ item }">
          <v-chip class="ml-0 mr-2 black--text" label small>
            {{ item.email }}
          </v-chip>
        </template>
        <template v-slot:item.create_at="{ item }">
          <div>
            {{ $moment(item.create_at).format('DD MMM') }}
          </div>
          <div>
            <small class="grey--text">{{ $moment(item.create_at).format('hh:mm:ss') }}</small>
          </div>
        </template>
        <template v-slot:item.status="{ item }">
          <v-icon @click="setBlocked(item.id)">
            <template v-if="item.status === 'blocked'">
              mdi-close-circle-outline
            </template>
            <template v-else>
              mdi-check-circle-outline
            </template>
          </v-icon>
        </template>
      </v-data-table>
      <!-- End: data table -->

      <v-divider v-if="count > limit" />

      <!-- Start: pagination -->
      <v-container v-if="length > 1" class="max-width">
        <v-row justify="center">
          <v-col cols="8">
            <v-pagination v-model="page" @input="getMore()" :length="length"></v-pagination>
          </v-col>
        </v-row>
      </v-container>
      <!-- End: pagination -->

    </template>

    <!-- Start: no history -->
    <template v-else-if="!overlay">
      <v-layout fill-height wrap>
        <v-flex/>
        <v-flex align-self-center class="text-center my-16" md4 mx5 sm6 xl3>
          <v-img class="ma-auto" width="250" src="/asset/3.png" />
          <h2>Мои агенты</h2>
          У вас пока нет агентов
        </v-flex>
        <v-flex/>
      </v-layout>
    </template>
    <!-- End: no history -->

    <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" :value="overlay">
      <v-progress-circular color="yellow darken-3" indeterminate size="50" />
    </v-overlay>

  </div>
</template>


<script>
  export default {
    name: "v-component-stock-broker-agents",
    data() {
      return {
        overlay: false,
        items: [],
        limit: 15,
        count: 0,
        length: 0,
        page: 1,
      }
    },
    mounted() {
      this.getAgents();
    },
    methods: {

      /**
       * @param id
       */
      setBlocked(id) {
        this.$axios.$post(this.$api.stock.setBlocked, {
          id: id,
        }).then((response) => {
          this.getAgents();
        });
      },

      getAgents() {
        this.overlay = true;

        this.$axios.$post(this.$api.stock.getAgents, {
          limit: this.limit,
          page: this.page,
          search: this.search
        }).then((response) => {
          this.items = response.fields ?? [];
          this.count = response.count ?? 0;
          this.length = Math.ceil(this.count / this.limit);
          this.overlay = false;
        });
      },

      getMore() {
        this.getAgents();
      }
    },
    computed: {

      headlines() {
        return [
          {
            text: 'User ID',
            align: 'start',
            sortable: false,
            value: 'user_id'
          }, {
            text: 'Name',
            align: 'start',
            sortable: false,
            value: 'name'
          }, {
            text: 'Email',
            align: 'start',
            sortable: false,
            value: 'email'
          }, {
            text: 'Create at',
            align: 'end',
            sortable: false,
            value: 'create_at'
          },
          {
            text: 'Status',
            align: 'center',
            sortable: false,
            value: 'status'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>