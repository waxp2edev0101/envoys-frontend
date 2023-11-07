<template>
  <div>

    <!-- Start: header bar -->
    <div class="pa-2">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="search" v-on:keyup="getAccounts" color="primary" :label="$vuetify.lang.t('$vuetify.lang_209')" outlined dense hide-details />
        </v-col>
        <v-col cols="12" md="6">
          <v-btn color="black--text grey lighten-5 text-capitalize" elevation="0" large class="float-end">
            {{ count }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <!-- End: header bar -->

    <v-divider />

    <template v-if="accounts.length">

      <!-- Start: data table -->
      <v-data-table :class="count > limit ? 'none-radius ' : ''" :headers="headlines" :items="accounts" :page.sync="page" item-key="id" :server-items-length="length" :items-per-page="limit" hide-default-footer show-expand single-expand>
        <template v-slot:item.data-table-expand="{ item, expand, isExpanded }">
          <template v-if="isExpanded">
            <v-icon @click="expand(!isExpanded);applicant = null">
              mdi-chevron-up
            </v-icon>
          </template>
          <template v-else>
            <v-icon @click="expand(!isExpanded);applicant = null">
              mdi-chevron-down
            </v-icon>
          </template>
        </template>
        <template v-slot:item.id="{ item }">
          <v-chip color="blue lighten-4" class="ml-0 mr-2 black--text" label small>
            {{ item.id }}
          </v-chip>
        </template>
        <template v-slot:item.name="{ item }">
          <b>{{ item.name }}</b>
        </template>
        <template v-slot:item.email="{ item }">
          <i>{{ item.email }}</i>
        </template>
        <template v-slot:item.rules="{ item }">
          <template v-if="item.rules && Object.entries(item.rules).length">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">mdi-circle-slice-8</v-icon>
              </template>
              <span>
                <div class="mx-1 text-uppercase" v-for="rule in Object.entries(item.rules)" :key="rule[0]">
                  <b>{{ rule[0] }}</b> - <i>{{ rule[1].join(', ') }}</i>
                </div>
              </span>
            </v-tooltip>
          </template>
          <template v-else>
            <v-icon>mdi-circle-off-outline</v-icon>
          </template>
        </template>
        <template v-slot:item.status="{ item }">
          <template v-if="item.status">
            <v-icon color="green">
              mdi-check-circle-outline
            </v-icon>
          </template>
          <template v-else>
            <v-icon color="red">
              mdi-close-circle-outline
            </v-icon>
          </template>
        </template>
        <template v-slot:item.create_at="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-icon>mdi-clock-time-nine-outline</v-icon> {{ $moment(item.create_at).format('YY-MM-DD') }}
              </div>
            </template>
            <span>
              {{ $moment(item.create_at).format('YY-MM-DD h:mm:ss') }}
            </span>
          </v-tooltip>
        </template>
        <template v-slot:item.edit="{ item }">
          <v-btn :to="`/admin/default/accounts/${item.id}/editor`" icon>
            <v-icon>
              mdi-circle-edit-outline
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-row class="mt-2">
              <v-col cols="12" :md="item.kyc_secure ? 4 : 6">
                <v-btn :to="`/admin/default/accounts/${item.id}/transactions`" class="mb-5 text-capitalize" block depressed large outlined color="red">
                  {{ $vuetify.lang.t('$vuetify.lang_273') }} {{ item.counts.transaction }}
                </v-btn>
              </v-col>
              <v-col cols="12" :md="item.kyc_secure ? 4 : 6">
                <v-btn :to="`/admin/default/accounts/${item.id}/balances`" class="mb-5 text-capitalize" block depressed large outlined color="lime">
                  {{ $vuetify.lang.t('$vuetify.lang_79') }} {{ item.counts.asset }}
                </v-btn>
              </v-col>
              <v-col v-if="item.kyc_secure" cols="12" md="4">
                <v-btn @click="getApplicant(item.kyc_secret)" class="mb-5 text-capitalize" block depressed large outlined color="primary">
                  {{ $vuetify.lang.t('$vuetify.lang_352') }}
                </v-btn>
              </v-col>
            </v-row>
          </td>
        </template>

      </v-data-table>
      <!-- End: data table -->

      <v-divider class="mb-5" v-if="applicant" />

      <v-row class="mx-1" v-if="applicant" align="center">
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

        <v-divider class="my-5" v-if="applicant.documents" />
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
          <template v-if="search">
            <h2>{{ $vuetify.lang.t('$vuetify.lang_210') }}</h2>
            {{ $vuetify.lang.t('$vuetify.lang_211') }}
          </template>
          <template v-else>
            <h2>{{ $vuetify.lang.t('$vuetify.lang_262') }}</h2>
            {{ $vuetify.lang.t('$vuetify.lang_263') }}
          </template>
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
    name: "v-component-accounts",
    data() {
      return {
        search: "",
        accounts: [],
        overlay: true,
        limit: 12,
        count: 0,
        length: 0,
        page: 1,
        applicant: null
      }
    },
    watch: {
      $route() {
        this.getAccounts();
      }
    },
    mounted() {
      this.getAccounts();
    },
    methods: {

      /**
       * @param id
       */
      getApplicant(id) {
        this.$axios.$post(this.$api.kyc.getApplicant, {
          id: id
        }).then((response) => {
          this.applicant = response;
        });
      },

      /**
       *
       */
      getAccounts() {
        this.overlay = true;

        this.$axios.$post(this.$api.admin.account.getAccounts, {
          search: this.search,
          limit: this.limit,
          page: this.page
        }).then((response) => {
          this.accounts = response.fields ?? [];
          this.accounts.map((item) => {
            if (!item.status) {
              item.status = false;
            }
          });
          this.count = response.count ?? 0;
          this.length = Math.ceil(this.count/this.limit);
          this.overlay = false;
        });
      },

      /**
       *
       */
      getMore() {
        this.getAccounts();
      }

    },
    computed: {

      /**
       * @returns {[{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},null]}
       */
      headlines() {
        return [
          {
            text: this.$vuetify.lang.t('$vuetify.lang_279'),
            align: 'start',
            sortable: true,
            value: 'id'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_188'),
            align: 'start',
            sortable: false,
            value: 'name'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_280'),
            align: 'start',
            sortable: false,
            value: 'email'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_281'),
            align: 'start',
            sortable: false,
            value: 'rules'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_81'),
            align: 'start',
            sortable: true,
            value: 'status'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_192'),
            align: 'end',
            sortable: false,
            value: 'create_at'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_194'),
            align: 'start',
            sortable: false,
            value: 'edit'
          },
        ]
      }
    }
  }
</script>

<style scoped>

</style>