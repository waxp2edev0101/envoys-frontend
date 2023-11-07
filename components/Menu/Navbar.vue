<template>
    <v-container>
        <div class="hidden-md-and-down">
            <div class="d-flex px-2">
                <div class="px-1" v-for="(item, index) in menu" :key="index">
                    <v-component-submenu :item="item"></v-component-submenu>
                </div>
            </div>
        </div>
        <div class="hidden-md-and-up">
            <v-app-bar-nav-icon @click="toogleDrawer()"></v-app-bar-nav-icon>
        </div>
    </v-container>
</template>

<script>
    import Submenu from './Submenu.vue'

    export default {
        name: "v-component-navbar-future",
        components: {
            'v-component-submenu': Submenu,
        },
        props: [
            'menu',
        ],
        data () {
            return {
                // navItems: []
                // menu: [],
            }
        },
        created() {
            // this.navItems = this.menu;
        },
        methods: {
            toggleDrawer () {
                this.$emit('toggleDrawer')
            }
        }
    }
</script>