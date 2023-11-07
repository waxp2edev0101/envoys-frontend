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
        <template v-slot:item.setting="{ item }">
          <v-menu offset-x offset-y bottom center :nudge-left="80" content-class="elevation-1" transition="slide-y-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">
                mdi-cog
              </v-icon>
            </template>
            <v-list>
              <v-list-item @click="setSetting(item.id, 'access', item.user_id)" link>
                <v-list-item-title>Confirm</v-list-item-title>
              </v-list-item>
              <v-list-item @click="setSetting(item.id,'rejected', item.user_id)" link>
                <v-list-item-title>Reject</v-list-item-title>
              </v-list-item>
              <v-list-item @click="getApplicant(item.applicant)" link>
                <v-list-item-title>KYC user info</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
      <!-- End: data table -->

      <v-divider class="mb-5" v-if="applicant" />

      <template v-if="!loading">

        <v-row v-if="applicant" class="mx-1" align="center">
          <v-col v-if="applicant.verifications_count" cols="12" md="4">
            <v-card outlined elevation="0">
              <v-card-title>
                Verifications count
              </v-card-title>
              <v-divider />
              <v-card-text>
                {{ applicant.verifications_count }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="applicant.verification_status" cols="12" md="4">
            <v-card outlined elevation="0">
              <v-card-title>
                Verification status
              </v-card-title>
              <v-divider />
              <v-card-text>
                {{ applicant.verification_status }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="applicant.email" cols="12" md="4">
            <v-card outlined elevation="0">
              <v-card-title>
                Email
              </v-card-title>
              <v-divider />
              <v-card-text>
                {{ applicant.email }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="applicant.gender" cols="12" md="4">
            <v-card outlined elevation="0">
              <v-card-title>
                Gender
              </v-card-title>
              <v-divider />
              <v-card-text>
                {{ applicant.gender }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="applicant.dob" cols="12" md="4">
            <v-card outlined elevation="0">
              <v-card-title>
                Dob
              </v-card-title>
              <v-divider />
              <v-card-text>
                {{ applicant.dob }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="applicant.residence_country" cols="12" md="4">
            <v-card outlined elevation="0">
              <v-card-title>
                Residence country
              </v-card-title>
              <v-divider />
              <v-card-text>
                {{ applicant.residence_country }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="applicant.last_name" cols="12" md="4">
            <v-card outlined elevation="0">
              <v-card-title>
                Last name
              </v-card-title>
              <v-divider />
              <v-card-text>
                {{ applicant.last_name }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="applicant.first_name" cols="12" md="4">
            <v-card outlined elevation="0">
              <v-card-title>
                First name
              </v-card-title>
              <v-divider />
              <v-card-text>
                {{ applicant.first_name }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="applicant.applicant_id" cols="12" md="4">
            <v-card outlined elevation="0">
              <v-card-title>
                Applicant id
              </v-card-title>
              <v-divider />
              <v-card-text>
                {{ applicant.applicant_id }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="applicant.type" cols="12" md="4">
            <v-card outlined elevation="0">
              <v-card-title>
                Type
              </v-card-title>
              <v-divider />
              <v-card-text>
                {{ applicant.type }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="applicant.created_at" cols="12" md="4">
            <v-card outlined elevation="0">
              <v-card-title>
                Created At
              </v-card-title>
              <v-divider />
              <v-card-text>
                {{ applicant.created_at }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="applicant.profile_status" cols="12" md="4">
            <v-card outlined elevation="0">
              <v-card-title>
                Profile status
              </v-card-title>
              <v-divider />
              <v-card-text>
                {{ applicant.profile_status }}
              </v-card-text>
            </v-card>
          </v-col>

        </v-row>

        <template v-if="applicant">
          <v-row class="mx-1" v-for="(document, i) in applicant.documents" :key="i" align="center">

            <v-col v-if="document.document_id" cols="12" md="4">
              <v-card outlined elevation="0">
                <v-card-title>
                  Document id
                </v-card-title>
                <v-divider />
                <v-card-text>
                  {{ document.document_id }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-if="document.type" cols="12" md="4">
              <v-card outlined elevation="0">
                <v-card-title>
                  Document type
                </v-card-title>
                <v-divider />
                <v-card-text>
                  {{ document.type }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-if="document.provider" cols="12" md="4">
              <v-card outlined elevation="0">
                <v-card-title>
                  Document provider
                </v-card-title>
                <v-divider />
                <v-card-text>
                  {{ document.provider }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-if="document.front_side_id" cols="12" md="4">
              <v-card outlined elevation="0">
                <v-card-title>
                  Document front side id
                </v-card-title>
                <v-divider />
                <v-card-text>
                  {{ document.front_side_id }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-if="document.expiry_date" cols="12" md="4">
              <v-card outlined elevation="0">
                <v-card-title>
                  Document expiry date
                </v-card-title>
                <v-divider />
                <v-card-text>
                  {{ document.expiry_date }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-if="document.issue_date" cols="12" md="4">
              <v-card outlined elevation="0">
                <v-card-title>
                  Document issue date
                </v-card-title>
                <v-divider />
                <v-card-text>
                  {{ document.issue_date }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-if="document.document_number" cols="12" md="4">
              <v-card outlined elevation="0">
                <v-card-title>
                  Document number
                </v-card-title>
                <v-divider />
                <v-card-text>
                  {{ document.document_number }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-if="document.status" cols="12" md="4">
              <v-card outlined elevation="0">
                <v-card-title>
                  Document status
                </v-card-title>
                <v-divider />
                <v-card-text>
                  {{ document.status }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-if="document.created_at" cols="12" md="4">
              <v-card outlined elevation="0">
                <v-card-title>
                  Document created at
                </v-card-title>
                <v-divider />
                <v-card-text>
                  {{ document.created_at }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col class="mb-4" v-if="document.back_side" cols="12" md="6">
              <v-card outlined elevation="0">
                <v-card-title>
                  Document back side
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <v-img :src="document.back_side" />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col class="mb-4" v-if="document.front_side" cols="12" md="6">
              <v-card outlined elevation="0">
                <v-card-title>
                  Document front side
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <v-img :src="document.front_side" />
                </v-card-text>
              </v-card>
            </v-col>

          </v-row>
        </template>
      </template>
      <template v-else>
        <div class="text-center">
          <v-progress-circular indeterminate color="yellow darken-3" size="50" />
        </div>
      </template>

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
          <h2>Новых запросов нет</h2>
          У вас пока нет новых запросов
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
    name: "v-component-stock-agent-requests",
    data() {
      return {
        loading: false,
        create: false,
        overlay: true,
        items: [],
        limit: 12,
        count: 0,
        length: 0,
        page: 1,
        applicant: null
      }
    },
    mounted() {
      this.getRequests();
    },
    methods: {

      /**
       * @param id
       */
      getApplicant(id) {
        this.loading = true;
        this.$axios.$post(this.$api.kyc.getApplicant, {
          id: id
        }).then((response) => {
          this.applicant = response;
          this.loading = false;
        }).catch(() => {
          this.getApplicant(id);
        });
      },

      /**
       * @param id
       * @param status
       * @param user_id
       */
      setSetting(id, status, user_id) {
        this.$axios.$post(this.$api.stock.setSetting, {
          status: status,
          user_id: user_id
        }).then((response) => {
          if (response.success) {
            this.items.splice(this.items.map((o) => o.id).indexOf(id), 1);
            this.count -= 1;
            this.$nuxt.$emit('agent/count');
          }
        });
      },

      /**
       *
       */
      getRequests() {
        this.overlay = true;
        this.$axios.$post(this.$api.stock.getRequests, {
          limit: this.limit,
          page: this.page
        }).then((response) => {
          this.items = response.fields ?? [];
          this.count = response.count ?? 0;
          this.length = Math.ceil(this.count / this.limit);
          this.overlay = false;
        });
      },

      /**
       *
       */
      getMore() {
        this.getRequests();
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
            text: 'Setting',
            align: 'center',
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