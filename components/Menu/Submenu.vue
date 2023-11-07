<template>
    <v-menu offset-y bottom center content-class="mt-4 elevation-1" transition="slide-y-transition">
        <template v-slot:activator="{ on, attrs }">
            <v-btn class="text-body-1 text-capitalize" variant="text" elevation="0" v-bind="attrs" v-on="on">
                {{ item.label }}
            </v-btn>
        </template>
        <v-card>
            <v-row no-gutters fluid>
                <v-col cols="12" md="12" sm="12">
                    <v-card-text>
                        <v-list class="pa-0 rounded-menu" rounded>
                            <v-list-item-group color="blue lighten-1">
                                <v-list-item :color="$vuetify.theme.dark ? '' : 'deep-purple lighten-4'" v-for="(subitem, index) in item.items" :key="index">
                                    <v-list-item-icon class="mr-2" size="30">
                                        <v-icon :color="$vuetify.theme.dark ? '' : 'grey darken-2'" v-text="subitem.icon"></v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title :class="$vuetify.theme.dark ? 'ml-2' : 'ml-2 brown--text'">
                                        <!-- {{ $vuetify.lang.t(`$vuetify.${item.title}`) }} -->
                                            {{ subitem.title }}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-card>
    </v-menu>
</template>

<script>
    export default {
        props: [
            'item',
        ]
    }
</script>