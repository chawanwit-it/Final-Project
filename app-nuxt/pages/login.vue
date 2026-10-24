<template>
  <v-main>
    <div class="mt-n5">
      <v-container fluid class="full-screen-container d-flex align-center justify-center">
        <v-sheet class="login-container">
          <!-- Logo -->
          <div class="text-center mb-4">
            <v-img
              src="../public/ctc.jpg"
              max-width="120"
              contain
              class="mx-auto"
            ></v-img>
          </div>

          <!-- Title -->
          <h3 class="text-h5 text-center mb-6 font-weight-bold">ระบบเยี่ยมบ้านออนไลน์</h3>

          <!-- แจ้งเตือนว่า ไม่รองรับการสมัครสมาชิก -->
          <p class="text-center mb-4">บัญชีผู้ใช้ถูกสร้างโดยผู้ดูแลระบบเท่านั้น</p>

          <!-- Login Form -->
          <v-form @submit.prevent="login" ref="loginForm">
            <!-- Email / Username Input -->
            <v-text-field
              v-model="email"
              placeholder="ชื่อผู้ใช้"
              variant="outlined"
              density="comfortable"
              class="input-field"
              hide-details
              required
              clearable
            ></v-text-field>

            <!-- Password Input -->
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="รหัสผ่าน"
              variant="outlined"
              density="comfortable"
              class="input-field"
              hide-details
              required
              clearable
            ></v-text-field>

            <v-checkbox
              v-model="showPassword"
              :label="showPassword ? 'ซ่อน' : 'แสดงรหัสผ่าน'"
              hide-details
            ></v-checkbox>

            <!-- Login Button -->
            <v-btn block class="login-button" type="submit"> เข้าสู่ระบบ </v-btn>
          </v-form>
        </v-sheet>

        <!-- Snackbar สำหรับแจ้งเตือนล็อกอินสำเร็จ -->
        <v-snackbar v-model="snackbar" :timeout="3000" color="success">
          {{ snackbarMessage }}
        </v-snackbar>

        <!-- Snackbar สำหรับแจ้งเตือนข้อผิดพลาด -->
        <v-snackbar v-model="errorSnackbar" :timeout="3000" color="error">
          {{ errorSnackbarMessage }}
        </v-snackbar>
      </v-container>
    </div>
  </v-main>
</template>
<script setup>
definePageMeta({
  layout: "empty",
});
</script>
<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false, // ควบคุมการแสดง/ซ่อนรหัสผ่าน
      rememberMe: false,
      snackbar: false, // ตัวแปรควบคุมการแสดง snackbar สำหรับความสำเร็จ
      snackbarMessage: "", // ข้อความแจ้งเตือนเมื่อสำเร็จ
      errorSnackbar: false, // ตัวแปรควบคุม snackbar สำหรับข้อผิดพลาด
      errorSnackbarMessage: "", // ข้อความแจ้งเตือนข้อผิดพลาด
    };
  },
  methods: {
    async login() {
  // ตรวจสอบข้อมูลเบื้องต้น
  if (!this.email || !this.password) {
    this.errorSnackbarMessage = "กรุณากรอกข้อมูลให้ครบถ้วน";
    this.errorSnackbar = true;
    return;
  }

  try {
    // ส่งคำร้องไปยัง API สำหรับการล็อกอิน
    const response = await axios.post("http://localhost:7000/users/login", {
      username: this.email,
      password: this.password,
    });

    if (response.status === 200) {
      const data = response.data;
      console.log("API Response:", data);

      // แสดง snackbar แจ้งเตือนการล็อกอินสำเร็จ
      this.snackbarMessage = data.message || "ล็อกอินสำเร็จ!";
      this.snackbar = true;

      // เก็บ token หากมี
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // ตรวจสอบ role ของผู้ใช้
      let role;
      if (data.role_name) {
  role = data.role_name.toLowerCase().trim();
  if (role === "office") {
    role = "office";
  }
      } else if (data.role_id) {
        const roleId = Number(data.role_id);
        switch (roleId) {
          case 1:
            role = "admin";
            break;
          case 3:
            role = "teacher";
            break;
          case 4:
            role = "student";
            break;
          case 2:
            role = "office";
            break;
          default:
            role = "";
            break;
        }
      } else {
        console.error("No role information received!");
        this.errorSnackbarMessage = "ไม่พบข้อมูล role ของผู้ใช้";
        this.errorSnackbar = true;
        return;
      }

      console.log("Mapped role:", role);
      localStorage.setItem("role", role);
      

      // เก็บข้อมูลของผู้ใช้ตาม role
      if (role === "teacher") {
        if (data.teacher) {
          localStorage.setItem("teacher", JSON.stringify(data.teacher));
        } else {
          console.error("No teacher data received in response.");
        }
      } else if (role === "student") {
        if (data.student) {
          localStorage.setItem("student", JSON.stringify(data.student));
        } else {
          console.error("No student data received in response.");
        }
      } else if (role === "admin") {
        if (data.admin) {
          localStorage.setItem("admin", JSON.stringify(data.admin));
        } else {
          console.error("No admin data received in response.");
        }
      } else if (role === "office") {
        if (data.office) {
          localStorage.setItem("office", JSON.stringify(data.office));
        } else {
          console.error("No office data received in response.");
        }
      } else {
        // ถ้าไม่มีข้อมูลแยก ให้เก็บข้อมูลทั้งหมดไว้ใน key "user"
        localStorage.setItem("user", JSON.stringify(data));
      }

      // หน่วงเวลาเล็กน้อยเพื่อให้ผู้ใช้เห็น snackbar ก่อนเปลี่ยนหน้า
      setTimeout(() => {
        switch (role) {
          case "admin":
            this.$router.push("/admin");
            break;
          case "teacher":
            this.$router.push("/teacher");
            break;
          case "student":
            this.$router.push("/student");
            break;
          case "office":
            this.$router.push("/officer");
            break;
          default:
            this.$router.push("/");
            break;
        }
      }, 1000);
    }
  } catch (error) {
    console.error("Error logging in:", error);
    if (error.response && error.response.data && error.response.data.message) {
      this.errorSnackbarMessage = error.response.data.message;
    } else {
      this.errorSnackbarMessage = "เกิดข้อผิดพลาดในการล็อกอิน";
    }
    this.errorSnackbar = true;
  }
}

  },
};
</script>

<style scoped>
.full-screen-container {
  height: 100vh;
  background-color: #ffffff;
}

.login-container {
  width: 400px;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
}

.input-field {
  height: 20px;
  font-size: 20px;
  margin-bottom: 28px;
}

::v-deep .v-text-field--outlined .v-field__outline {
  border-color: #1769aa;
  border-radius: 8px;
}

.login-button {
  background-color: #1769aa !important;
  color: white !important;
  font-size: 16px !important;
  font-weight: bold !important;
  border-radius: 8px !important;
  height: 44px;
  text-transform: none;
  margin-top: 16px;
}
</style>
