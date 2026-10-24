<template>
    <v-app>
        <v-system-bar class="bg-grey-lighten-2">
            <v-spacer></v-spacer>

            <v-icon>mdi-square</v-icon>

            <v-icon>mdi-circle</v-icon>

            <v-icon>mdi-triangle</v-icon>
        </v-system-bar>

        <v-app-bar>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-app-bar-title>ระบบเยี่ยมบ้านออนไลน์</v-app-bar-title>
            <v-btn variant="plain">Login<span class="mdi mdi-login"></span> </v-btn>

        </v-app-bar>

        <v-navigation-drawer v-model="drawer" temporary>
           
        </v-navigation-drawer>
        
        <v-main>
        <v-card>
            <!-- v-tabs พร้อม prop to สำหรับนำทาง -->
            <v-tabs v-model="tab" background-color="primary" dark>
                <v-tab :to="{ path: '/admin/users/' }" exact>
                    Users
                </v-tab>
                <v-tab :to="{ path: '/admin/users/student' }" exact>
                    student
                </v-tab>
                <v-tab :to="{ path: '/admin/users/teacher' }" exact>
                    teacher
                </v-tab>
                <v-tab :to="{ path: '/admin/users/officer' }" exact>
                    officer
                </v-tab>
            </v-tabs>
        </v-card>
    </v-main>

    </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(null)
</script>

<script>
export default {
    data: () => ({ drawer: null, tab: null,}),
}
</script>