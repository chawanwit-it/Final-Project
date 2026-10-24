<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <v-toolbar-title>Your Company</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="mobileMenuOpen = true" class="d-lg-none">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
            <v-row class="d-none d-lg-flex" align="center">
                <v-btn text v-for="item in navigation" :key="item.name" :href="item.href">
                    {{ item.name }}
                </v-btn>
                <v-btn text href="#">Log in</v-btn>
            </v-row>
        </v-app-bar>

        <v-navigation-drawer v-model="mobileMenuOpen" temporary>
            <v-list>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Your Company</v-list-item-title>
                    </v-list-item-content>
                    <v-btn icon @click="mobileMenuOpen = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item v-for="item in navigation" :key="item.name" :href="item.href" link>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
                <v-list-item href="#" link>
                    <v-list-item-title>Log in</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container class="py-14">
                <slot />
            </v-container>
        </v-main>

        <v-footer app color="primary" dark>
            <v-container>
                <span class="white--text">&copy; 2025 My Company</span>
            </v-container>
        </v-footer>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            navigation: [
                { name: 'Product', href: '#' },
                { name: 'Features', href: '#' },
                { name: 'Marketplace', href: '#' },
                { name: 'Company', href: '#' },
            ],
            mobileMenuOpen: false,
            showAlert: true,
            search: '',
            selectedItem: null,
            items: [
                'Item One',
                'Item Two',
                'Item Three',
                'Item Four',
                'Item Five',
            ],
        }
    },
    computed: {
        filteredItems() {
            if (this.search === '') {
                return this.items
            }
            const searchLower = this.search.toLowerCase()
            return this.items.filter(item => item.toLowerCase().includes(searchLower))
        },
    },
}
</script>

<style>
/* คุณสามารถเพิ่มสไตล์เพิ่มเติมที่นี่ถ้าจำเป็น */
</style>