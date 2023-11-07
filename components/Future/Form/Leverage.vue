<template>
    <v-card elevation="0">
        <v-card-text>
            <p class="mb-2">Leverage {{value}}x</p>
            <v-item-group class="d-flex justify-space-between">
                <v-item v-for="(item, index) in values" :key="index" style="min-width: 60px" class="justify-center">
                    <v-chip label class="ma-1" :text-color="value === item ? 'teal' : ''" @click="setLeverage(item)">{{ item }}x</v-chip>
                </v-item>
            </v-item-group>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        name: 'v-component-leverage-card',
        data() {
            return {
                values: [5, 10, 15, 20],
            }
        },
        props: ['value'],
        methods: {
            setLeverage(value) {
                // this.leverage = value
                if (this.value === value) {
                    this.$emit('set-leverage', 1)
                    return
                }
                this.$emit('set-leverage', value)
            }
        }
    }
</script>