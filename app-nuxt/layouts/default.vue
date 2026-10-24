<template>
  <div v-if="authorized">
    <v-app>
      <v-system-bar>
        <v-spacer></v-spacer>
        <v-icon>mdi-square</v-icon>
        <v-icon>mdi-circle</v-icon>
        <v-icon>mdi-triangle</v-icon>
      </v-system-bar>

      <v-app-bar :elevation="4" rounded>
        <!-- <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon> -->
        <v-app-bar-title>ระบบเยี่ยมบ้านออนไลน์</v-app-bar-title>
        <v-divider class="border-opacity-25" vertical></v-divider>
        <NuxtLink to="/login">
          <v-btn color="light-blue-darken-4" variant="plain">
            Login <span class="mdi mdi-login"></span>
          </v-btn>
        </NuxtLink>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" temporary>
        <!-- เนื้อหาภายใน Drawer -->
      </v-navigation-drawer>

      <v-main>
        <router-view />
      </v-main>

      
      <footer style="text-align: center; padding: 10px; border-top: 1px solid #ddd">
        <p style="margin: 0; color: #555">© 2025 ระบบเยี่ยมบ้านออนไลน์</p>
      </footer>
    </v-app>
  </div>

  <div v-else>
    <!-- สถานะการโหลด (spinner หรือข้อความ "Loading...") -->
    <v-container fill-height>
      <v-row align="center" justify="center">
        <v-col class="text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const authorized = ref(false);
const drawer = ref(false); // ใช้ false เป็นค่าพื้นฐานเพื่อให้ Drawer ปิด

// จำลองสถานะการโหลด
onMounted(() => {
  setTimeout(() => {
    authorized.value = true;
  }, 1000);
});
</script>

