<template>
        <v-breadcrumbs :items="items" class="mt-n13">
          <template v-slot:divider> </template>
        </v-breadcrumbs>
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
    // ตรวจสอบสิทธิ์ใน mounted
    const userRole = localStorage.getItem("role");
    console.log("Stored userRole:", userRole);
    if (userRole && userRole.toLowerCase() === "admin") {
      // ถ้าผู้ใช้เป็น admin ตั้งค่า authorized เป็น true เพื่อให้แสดงเนื้อหาหน้า admin
      this.authorized = true;
    } else {
      // ถ้าไม่ใช่ admin ให้ redirect ทันที
      this.$router.push("/login");
    }
  },
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
.v-app-bar {
  background-color: #343fa5;
  color: white;
}

.v-navigation-drawer {
  background-color: #f5f5f5;
}
</style>
