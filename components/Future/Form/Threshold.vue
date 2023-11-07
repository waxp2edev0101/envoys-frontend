<template>
    <v-card elevation="0">
        <v-card-text class="pb-0">
            <div class="d-flex justify-space-between">
                <v-checkbox label="Long TP/SL" class="ma-0 pa-0" v-model="longChecked"/>
                <v-checkbox label="Short TP/SL" class="ma-0 pa-0" v-model="shortChecked"/>
            </div>
            <template v-if="longChecked || shortChecked">
                <div>
                    <v-hover>
                        <v-text-field outlined class="mb-4" color="primary" height="40" dense hide-details :label="$vuetify.lang.t('Take profit price')" v-model="profit">
                            <template v-slot:append>
                                <span class="my-1">{{$vuetify.lang.t('USDT')}}</span>
                            </template>
                        </v-text-field>
                    </v-hover>
                    <v-hover>
                        <v-text-field outlined class="mb-4" color="primary" height="40" dense hide-details :label="$vuetify.lang.t('Stop loss price')" v-model="loss">
                            <template v-slot:append>
                                <span class="my-1">{{$vuetify.lang.t('USDT')}}</span>
                            </template>
                        </v-text-field>
                    </v-hover>
                </div>
            </template>
        </v-card-text>
    </v-card>
</template>

<script>

    export default {
        name: 'v-component-future-threshold-card',
        data() {
            return {
                data: this.threshold,
                longChecked: false,
                shortChecked: false,
                profit: this.threshold.profit,
                loss: this.threshold.loss,
            }
        },
        props: ['threshold', 'position'],
        methods: {
            setThreshold() {
                this.$emit('set-threshold', {
                    tp: this.tp,
                    sl: this.sl,
                })
            },
            setPosition(p) {
                this.$emit('set-position', p)
            }
        },
        mounted() {
            this.$watch(vm=>[vm.longChecked, vm.shortChecked], val => {
                if (!this.longChecked && !this.shortChecked) {
                    this.setPosition('none')
                }
            }, {
                immediate: true,
                deep: true,
            })
        },
        watch: {
            longChecked(e) {
                if (e) this.shortChecked = false
                this.setPosition(e ? 'long' : 'short')
            },
            shortChecked(e) {
                if (e) this.longChecked = false
                this.setPosition(!e ? 'long' : 'short')
            },
            profit() {
                this.setThreshold();
            },
            loss() {
                this.setThreshold();
            }
        },
        computed: {
        }
    }
</script>
