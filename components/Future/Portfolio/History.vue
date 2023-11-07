<template>
    <div>
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
            </template>
    </div>
</template>

<script>
    export default {
        name: 'v-component-future-history',
        props: ['order', 'count', 'overlay', 'header', 'length', "page", "hover", "limit"],
        methods: {
            getMore() {
                console.log('get more')
            }
        }
    }
</script>