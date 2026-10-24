<template>
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
</template>

<script>
export default {
    data: () => ({
        tab: null,
    }),
}
</script>