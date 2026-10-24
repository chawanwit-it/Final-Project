<template>
  <!-- เฉพาะเมื่อ authorized เป็น true เท่านั้นที่จะแสดงเนื้อหาหน้า admin -->
  <div v-if="authorized">
    <v-app>
      <!-- System Bar -->
      <v-system-bar class="white">
        <v-spacer></v-spacer>
        <v-icon>mdi-square</v-icon>
        <v-icon>mdi-circle</v-icon>
        <v-icon>mdi-triangle</v-icon>
      </v-system-bar>

      <!-- App Bar -->
      <v-app-bar :elevation="8" color="white" rounded>
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
          <v-list-item :to="{ path: '/admin' }">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ path: '/admin/users' }">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item>
          <!-- เพิ่มเมนูอื่นๆ ตามต้องการ -->
        </v-list>
      </v-navigation-drawer>

      <!-- Main Content -->
      <v-main>
        <v-breadcrumbs :items="items">
          <template v-slot:divider> </template>
        </v-breadcrumbs>
        <router-view />
      </v-main>
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
      items: [
        {
          title: "ผู้ใช้งานทั้งหมด",
          disabled: false,
          to: "/admin/users/",
        },
        {
          title: "เจ้าหน้าที่งานครูที่ปรึกษา",
          disabled: false,
          to: "/admin/users/officeedit",
        },
        {
          title: "นักเรียน/นักศึกษา",
          disabled: false,
          to: "/admin/users/stuedit",
        },
        {
          title: "ครูที่ปรึกษา",
          disabled: false,
          to: "/admin/users/teacheredit",
        },
      ],
    };
  },
  mounted() {
        setTimeout(() => {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");

            if (!token || role !== "admin") {
                this.$router.replace("/login"); // ใช้ replace() แทน push() เพื่อลด history
            } else {
                this.authorized = true;
            }
        }, 500); // ตั้งเวลา 0.5 วินาที (สามารถปรับได้)
    },
    methods: {
        logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            this.$router.replace("/login"); // ใช้ replace() แทน push()
        },
    },
};
</script>

<style scoped>
.v-app-bar {
  background-color: #343fa5;
  color: white;
}

.v-navigation-drawer {
  background-color: #f5f5f5;
}
</style>
