<template>
  <!-- เฉพาะเมื่อ authorized เป็น true เท่านั้นที่จะแสดงเนื้อหาหน้า admin -->
  <div v-if="authorized">
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
        <!-- <v-btn variant="plain" >
          Logout
          <v-icon left>mdi-logout</v-icon>
        </v-btn> -->
      </v-app-bar>

      <!-- Navigation Drawer -->
      <v-navigation-drawer v-model="drawer" temporary>
        <v-list>
          <v-list-item :to="{ path: '/student' }">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>หน้าหลัก</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ path: '/student/StudentForm' }">
            <v-list-item-icon>
              <v-icon>mdi-image</v-icon>
            </v-list-item-icon>
            <v-list-item-title>เพิ่มข้อมูล</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>mdi mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title >ออกจากระบบ</v-list-item-title>
          </v-list-item>
          <!-- เพิ่มเมนูอื่นๆ ตามต้องการ -->
        </v-list>
      </v-navigation-drawer>

      <!-- Main Content -->
      <v-main>
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
        };
    },
    mounted() {
        setTimeout(() => {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");

            if (!token || role !== "student"  || this.isTokenExpired(token))  {
                this.$router.replace("/login"); // ใช้ replace() แทน push() เพื่อลด history
            } else {
                this.authorized = true;
            }
        }, 500); // ตั้งเวลา 0.5 วินาที (สามารถปรับได้)
    },
    methods: {
        logout() {
            // localStorage.removeItem("token");
            // localStorage.removeItem("role");
            localStorage.clear()
            this.$router.replace("/login"); // ใช้ replace() แทน push()
        },

        // ฟังก์ชันตรวจสอบว่า token หมดอายุหรือยัง (สมมติว่า token เป็น JWT)
    isTokenExpired(token) {
      try {
        // แยก payload ของ JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        // เปรียบเทียบเวลาปัจจุบัน (หน่วยมิลลิวินาที) กับเวลา exp (หน่วยวินาที)
        return Date.now() >= payload.exp * 1000;
      } catch (error) {
        // ถ้าเกิดข้อผิดพลาด (เช่น token ไม่ถูกต้อง) ให้ถือว่า token หมดอายุ
        return true;
      }
    },
    },
};

</script>

<style scoped>
.v-navigation-drawer {
  background-color: #f5f5f5;
}
</style>
