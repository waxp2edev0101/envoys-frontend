<template>
    <v-menu offset-y bottom center content-class="elevation-1" :close-on-content-click="false" :close-on-click="true">
        <template v-slot:activator="{ on, attrs }">
            <v-btn :color="$vuetify.theme.dark ? '' : 'blue lighten-4'" elevation="0" icon v-bind="attrs" v-on="on" size="x-small" style="width: 12px; height: 12px;">
                <v-icon :color="$vuetify.theme.dark ? '' : 'grey darken-1'">
                    mdi-menu-down
                </v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-component-future-market />
        </v-card>
    </v-menu>
</template>

<script>
    import FutureMarket from '../Future/Market'

    export default {
        name: 'v-component-future-market-menu',
        components: {
            'v-component-future-market': FutureMarket
        }
    }
</script>