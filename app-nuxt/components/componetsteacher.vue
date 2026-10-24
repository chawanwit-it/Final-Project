<template>
    <!-- เฉพาะเมื่อ authorized เป็น true เท่านั้นที่จะแสดงเนื้อหาหน้า admin -->
    <div v-if="authorized" >
        <v-app>
            <!-- System Bar -->
            <v-system-bar>
                <v-spacer></v-spacer>
                <v-icon>mdi-square</v-icon>
                <v-icon>mdi-circle</v-icon>
                <v-icon>mdi-triangle</v-icon>
            </v-system-bar>

            <!-- App Bar -->
            <v-app-bar :elevation="8" rounded>
                <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
                <v-app-bar-title>ระบบเยี่ยมบ้านออนไลน์</v-app-bar-title>
                <v-divider class="border-opacity-30" vertical></v-divider>
                <v-btn variant="plain" @click="logout">
                    Logout
                    <v-icon left>mdi-logout</v-icon>
                </v-btn>
            </v-app-bar>

            <!-- Navigation Drawer -->
            <v-navigation-drawer v-model="drawer" temporary>
                <v-list>
                    <v-list-item :to="{ path: '/teacher' }">
                        <v-list-item-icon>
                            <v-icon>mdi-home</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>หน้าหลัก</v-list-item-title>
                    </v-list-item>
                    <v-list-item :to="{ path: '/teacher/StudentsInCare' }">
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>นักเรียนที่อยู่ในความดูแล</v-list-item-title>
                    </v-list-item>
                    <v-list-item :to="{ path: '/teacher/studentDo' }">
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>ข้อมูล</v-list-item-title>
                    </v-list-item>
                    <!-- เพิ่มเมนูอื่นๆ ตามต้องการ -->
                </v-list>
            </v-navigation-drawer>

            <!-- Main Content -->
            
                <router-view />
            
        </v-app>
    </div>
    <!-- Optionally, you can show a loading spinner if not authorized yet -->
    <div v-else>
        <!-- ตัวเลือก: สามารถแสดง spinner หรือข้อความ "Loading..." -->
        <v-container fill-height>
            <v-row align="center" justify="center">
                <v-col class="text-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            drawer: false,
            authorized: false, // ค่าเริ่มต้นเป็น false
        };
    },
    // mounted() {
    //     // ตรวจสอบสิทธิ์ใน mounted
    //     const userRole = localStorage.getItem("role");
    //     console.log("Stored userRole:", userRole);
    //     if (userRole && userRole.toLowerCase() === "teacher") {
    //         // ถ้าผู้ใช้เป็น admin ตั้งค่า authorized เป็น true เพื่อให้แสดงเนื้อหาหน้า admin
    //         this.authorized = true;
    //     } else {
    //         // ถ้าไม่ใช่ admin ให้ redirect ทันที
    //         this.$router.push("/login");
    //     }
    // },
    methods: {
        logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            this.$router.push("/login");
        },
    },
};
</script>

<style scoped>
/* .v-app-bar {
    background-color: white;
    color: white;
} */

.v-navigation-drawer {
    background-color: #f5f5f5;
}
</style>