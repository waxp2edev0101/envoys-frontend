<template>
    <v-card elevation="0">
        <v-row no-gutters style="width: 100%" justify="space-between">
            <v-card flat class="d-flex px-3" style="gap: 8px">
                <v-checkbox label="Lite Version" class="mt-1"></v-checkbox>
                <v-checkbox label="Show Current" class="mt-1"></v-checkbox>
                <v-card-text style="width: 92px; padding-top: 6px !important" class="mt-1 pa-0">
                    Select Futures
                </v-card-text>
                <v-select solo dense flat style="width: 100px" :items="items" class="mt-1 pa-0" elevation="0"></v-select>
            </v-card>
            <div>
                <v-btn elevation="0" class="text-capitalize font-size-16px">Close all positions</v-btn>
            </div>
        </v-row>
        <v-divider />
        <v-row no-gutters>
            <v-col md="8" sm="12">
                <v-card elevation="0" class="d-flex position-summary px-3">
                    <v-card-text  class="white--text text-lighten-2 py-4 px-1">
                        <span class="teal white--text">Long</span>
                    </v-card-text>
                    <v-card-text  class="teal--text text-lighten-2 py-4 px-1">20X</v-card-text>
                    <v-card-text  class="teal--text text-lighten-2 py-4 px-0">·</v-card-text>
                    <v-card-text  class="teal--text text-lighten-2 py-4 px-1">BTCUSDT</v-card-text>
                    <v-card-text  class="py-4 px-1">
                        <span class="mode teal--text text-lighten-2">Cross</span>
                    </v-card-text>
                    <v-card-text  class="teal--text text-lighten-2 py-4 px-1 adjust-level">Adjust Level</v-card-text>
                </v-card>
            </v-col>
            <v-col class="text-right" md="4" sm="12">
                <v-card elevation="0" class="d-flex justify-end py-2" full-width>
                    <v-btn elevation="0" small class="text-capitalize">Take Profit/Stop Loss</v-btn>
                    <v-btn elevation="0" small class="text-capitalize">Tailling Stop</v-btn>
                </v-card>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col cols="12" md="8" sm="12">
                <v-row no-gutters>
                    <v-col md="4" sm="6">
                        <v-card flat elevation="0">
                            <v-card-text>
                                Position: <span>0.100</span>
                            </v-card-text>
                            <v-card-text>
                                Open orders: <span>0.100</span>
                            </v-card-text>
                            <v-card-text>
                                Close amount: <span>0.100</span>
                            </v-card-text>
                            <v-card-text>
                                MMR: <span>0.100</span>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col md="4" sm="6">
                        <v-card flat elevation="0">
                            <v-card-text>
                                Open price: <span>0.100</span>
                            </v-card-text>
                            <v-card-text>
                                Mark price: <span>0.100</span>
                            </v-card-text>
                            <v-card-text>
                                Margin: <span>139.43000 USDT</span>
                            </v-card-text>
                            <v-card-text>
                                Position TP/SL: <span>--/--</span>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col md="4" sm="6">
                        <v-card flat elevation="0">
                            <v-card-text>
                                Realized P&L: <span>0.000</span>
                            </v-card-text>
                            <v-card-text>
                                Unrealized PNL: <span>29.150000</span>
                            </v-card-text>
                            <v-card-text>
                                ROE: <span>20.91%</span>
                            </v-card-text>
                            <v-card-text>
                                Lig.Price: <span>259.38</span>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" md="4" sm="12">
                <v-card flat elevation="0" class="pa-2 position-control">
                    <div class="d-flex mt-6" style="gap: 2px">
                        <div class="px-1">
                            <v-text-field height="32" dense hide-details label="Close price" outlined />
                        </div>
                        <div class="px-1">
                            <v-text-field height="32" dense hide-details label="Close amount" outlined />
                        </div>
                    </div>
                    <div class="d-flex mt-2" style="gap: 2px">
                        <div class="px-1 flex-grow-1">
                            <v-btn small outlined class="text-capitalize w-100">Reversals</v-btn>
                        </div>
                        <div class="px-1 flex-grow-1">
                            <v-btn small outlined class="text-capitalize w-100">Flash close</v-btn>
                        </div>
                        <div class="px-1 flex-grow-1">
                            <v-btn small outlined class="text-capitalize w-100">Close</v-btn>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    export default {
        name: 'v-component-future-position',
        data () {
            return {
                items: ['all', 'pending', 'filled']
            }
        }
    }
</script>

<style>
.v-input--checkbox .v-label {
    font-size: 14px;
}
.v-application--is-ltr .v-messages, .v-text-field__details {
    display: none;
}
.position-summary .v-card__text {
    width: auto;
}
.position-summary .v-card__text:not(:first-child) {
    font-size: 16px;
}
.position-summary .v-card__text span.mode {
    border: 1px solid #009688;
    font-size: 14px;
}
.position-summary .v-card__text.adjust-level {
    font-size: 14px;
}
.position-control .v-text-field--outlined {
    border-radius: 2px;
}
.position-control .v-btn {
    border-radius: 2px;
}
.position-control > div {
    flex: 1;
}
.position-control button {
    width: 100%;
}
.position-control .v-input__slot fieldset {
    height: 36px;
}
.position-control .v-input__slot input {
    padding: 4px 0px;
    font-size: 14px;
}
.position-control .v-input__slot label.v-label {
    font-size: 14px;
    top: 5px;
}
.position-control .v-input__slot .v-text-field__slot {
    height: 32px;
}
</style>