<template>
  <v-main class="bg-grey-lighten-2">
    <v-container fluid class="mt-n16">
      <!-- Dashboard Header -->
      <v-row>
        <v-col cols="12">
          <v-card class="pa-6 mb-6 dashboard-header" elevation="4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <h1 class="text-h4 text-black font-weight-bold mb-2">
                  แผงควบคุมผู้ดูแลระบบ
                </h1>
                <p class="text-subtitle-1 text-medium-emphasis">ภาพรวมการจัดการระบบ</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Dashboard Overview -->
      <v-row class="dashboard-overview">
        <v-col cols="12" sm="6" md="3" v-for="card in overviewCards" :key="card.title">
          <v-card :color="card.color" dark class="dashboard-overview-card" hover>
            <v-card-title class="d-flex justify-space-between align-center">
              <div>
                <div class="text-subtitle-1 font-weight-regular opacity-75">
                  {{ card.title }}
                </div>
                <div class="text-h4 font-weight-bold mt-2">{{ card.value }}</div>
              </div>
              <v-icon size="48" class="ml-4">{{ card.icon }}</v-icon>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <!-- ส่วนแสดงกราฟ -->
          <overview-bar-chart :overview-cards="overviewCards" />
        </v-col>
      </v-row>

      <!-- Data Table Section -->
      <v-row>
        <v-col cols="12">
          <v-card elevation="2" class="user-table-card">
            <v-card-title class="d-flex align-center justify-space-between pa-6">
              <h2 class="text-h6 font-weight-medium mb-0">รายชื่อผู้ใช้งานทั้งหมด</h2>
              <div class="pa-4 text-left">
                <!-- ปุ่มเพิ่มผู้ใช้งาน (แสดงเมื่อไม่มีการเลือกแถว) -->
                <v-btn
                  v-if="selected.length === 0"
                  variant="text"
                  class="rounded-lg elevation-1 mr-4"
                  @click="openAddUserDialog"
                  color="primary"
                >
                  เพิ่มผู้ใช้งาน
                  <v-icon left>mdi-account-plus-outline</v-icon>
                </v-btn>

                <!-- ปุ่มลบผู้ใช้งานที่เลือก (แสดงเมื่อมีการเลือกแถว) -->
                <v-btn
                  v-if="selected.length > 0"
                  color="error"
                  class="rounded-lg elevation-2 mr-2"
                  @click="deleteSelectedDialog = true"
                >
                  ลบผู้ใช้งาน
                  <span class="mdi mdi-delete"></span>
                </v-btn>
              </div>
            </v-card-title>

            <v-text-field
              v-model="search"
              variant="underlined"
              append-icon="mdi-magnify"
              label="ค้นหา"
              single-line
              dense
              hide-details
              class="search-input pa-6 mt-n10"
            />
            <v-divider class="mt-6"></v-divider>
            <v-data-table
              v-model="selected"
              :headers="tableHeaders"
              :items="filteredUsers"
              :items-per-page="20"
              class="elevation-1"
              return-object
              show-select
              item-value="title"
            >
              <template #item.actions-edit="{ item }">
                <v-btn
                  class="text-none"
                  color="primary"
                  min-width="0"
                  slim
                  variant="text"
                  @click="editUser(item)"
                >
                  Edit
                </v-btn>
              </template>
              <template #item.actions-delete="{ item }">
                <v-btn
                  class="text-none"
                  color="error"
                  min-width="0"
                  slim
                  variant="text"
                  @click="showConfirmDialog(item)"
                >
                  Delete
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>

      <!-- Add/Edit Dialog -->
      <v-dialog v-model="editDialog" max-width="600">
        <v-card>
          <v-card-title class="d-flex justify-center">{{ dialogTitle }}</v-card-title>
          <v-card-text>
            <v-form ref="userForm" v-model="formValid" lazy-validation>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    variant="underlined"
                    label="ชื่อผู้ใช้ *"
                    v-model="userToEdit.username"
                    :rules="[(v) => !!v || 'กรุณากรอกชื่อผู้ใช้']"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    variant="underlined"
                    label="รหัสผ่าน *"
                    v-model="userToEdit.password"
                    type="password"
                    :rules="[
                      userToEdit.id ? () => true : (v) => !!v || 'กรุณากรอกรหัสผ่าน',
                    ]"
                    :required="!userToEdit.id"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    variant="underlined"
                    label="อีเมล *"
                    v-model="userToEdit.email"
                    :rules="[(v) => !!v || 'กรุณากรอกอีเมล']"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    variant="underlined"
                    label="บทบาท *"
                    :items="roles"
                    v-model="userToEdit.role"
                    :rules="[(v) => !!v || 'กรุณาเลือกบทบาท']"
                    required
                  />
                </v-col>
                <small class="text-caption text-medium-emphasis">
                  * เพิ่มผู้ใช้งานระบบเยี่ยมบ้านออนไลน์
                </small>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancelEdit">ยกเลิก</v-btn>
            <v-btn color="primary" @click="saveUser" :disabled="!formValid">
              บันทึก
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Upload File Dialog -->
      <v-dialog v-model="uploadDialog" max-width="500">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-file-excel</v-icon>
            อัปโหลดไฟล์ Excel
          </v-card-title>
          <v-card-text>
            <v-file-input
              label="เลือกไฟล์ Excel"
              variant="underlined"
              v-model="selectedFile"
              accept=".xls, .xlsx"
              outlined
              dense
            />
            <small class="text-caption text-medium-emphasis">
              * สำหรับไฟล์นามสกุล .xls, .xlsx
              <a :href="fileUrl" download>ดาวน์โหลดตัวอย่างไฟล์</a>
            </small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancelUpload">ยกเลิก</v-btn>
            <v-btn color="primary" @click="uploadFile" :disabled="!selectedFile">
              ตกลง
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Confirmation Dialog for Single Delete -->
      <v-dialog v-model="confirmDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5">
            ยืนยันการลบ <span class="mdi mdi-delete"></span>
          </v-card-title>
          <v-card-text>
            คุณต้องการลบผู้ใช้งาน <strong>{{ userToDelete?.username }}</strong> หรือไม่?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancelDelete">ยกเลิก</v-btn>
            <v-btn color="red" text @click="deleteUserConfirm">ยืนยัน</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Message Dialog -->
      <v-dialog v-model="messageDialogVisible" max-width="400">
        <v-card>
          <v-card-title class="headline"> ✅ {{ messageDialogTitle }} </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            {{ messageDialogMessage }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="closeMessageDialog"> ปิด </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog: ยืนยันลบผู้ใช้งานที่เลือก (สำหรับการลบหลายรายการ) -->
      <v-dialog v-model="deleteSelectedDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5"> ยืนยันการลบผู้ใช้งานที่เลือก </v-card-title>
          <v-card-text>
            คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานที่เลือกทั้งหมด ({{ selected.length }}) ?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="deleteSelectedDialog = false">ยกเลิก</v-btn>
            <v-btn color="red" text @click="confirmDeleteSelected"> ยืนยัน </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<script setup>
definePageMeta({
  layout: "layoutadmin",
});
</script>

<script>
import axios from "axios";
import OverviewBarChart from "@/components/OverviewBarChart.vue";

export default {
  name: "Dashboard",
  components: {
    OverviewBarChart,
  },
  data() {
    return {
      // สำหรับการจัดการ selection, Dialogs และไฟล์
      selected: [],
      fileUrl: "/files/เพิ่มขอมูลนักเรียน.xlsx",
      messageDialogVisible: false,
      messageDialogTitle: "",
      messageDialogMessage: "",
      uploadDialog: false,
      editDialog: false,
      confirmDialog: false,
      deleteSelectedDialog: false,
      selectedFile: null,
      userToEdit: { id: null, username: "", password: "", email: "", role: "" },
      userToDelete: null,
      dialogTitle: "เพิ่มผู้ใช้งาน",

      // Search filter
      search: "",

      // Overview Cards เริ่มต้น (ค่าตั้งต้น ก่อนดึงข้อมูลจริงจาก API)
      overviewCards: [
        {
          title: "ผู้ใช้งานทั้งหมด",
          value: 0,
          icon: "mdi-account-multiple",
          color: "deep-purple accent-4",
        },
        {
          title: "จำนวนนักเรียน",
          value: 0,
          icon: "mdi-school",
          color: "teal darken-1",
        },
        {
          title: "จำนวนครู",
          value: 0,
          icon: "mdi-human-male-board",
          color: "orange darken-2",
        },
        {
          title: "จำนวนเจ้าหน้าที่",
          value: 0,
          icon: "mdi-office-building",
          color: "red accent-3",
        },
      ],

      // Table Headers สำหรับแสดงข้อมูลผู้ใช้งาน
      tableHeaders: [
        { title: "ชื่อผู้ใช้", value: "username", class: "subtitle-2 font-weight-bold" },
        { title: "บทบาท", value: "role_name", class: "subtitle-2 font-weight-bold" },
        {
          title: "แก้ไขผู้ใช้",
          value: "actions-edit",
          class: "subtitle-2 font-weight-bold",
        },
        {
          title: "ลบผู่ใช้",
          value: "actions-delete",
          class: "subtitle-2 font-weight-bold",
        },
      ],

      // รายการผู้ใช้งานที่ดึงมาจาก API
      users: [],

      // รายการ Role สำหรับ Select
      roles: ["Student", "Teacher", "Office", "Admin"],

      // สำหรับ Form Validation ใน Add/Edit Dialog
      formValid: false,
    };
  },
  mounted() {
    // ตรวจสอบสิทธิ์: เฉพาะผู้ใช้งานที่มี role "admin" เท่านั้นที่จะเข้าถึง Dashboard
    const userRole = localStorage.getItem("role");
    if (!userRole || userRole.toLowerCase() !== "admin") {
      this.$router.push("/login");
      return;
    }
    this.loadUsers();
  },
  computed: {
    filteredUsers() {
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        return this.users.filter((user) => {
          return (
            (user.full_name && user.full_name.toLowerCase().includes(searchLower)) ||
            (user.username && user.username.toLowerCase().includes(searchLower)) ||
            (user.role_name && user.role_name.toLowerCase().includes(searchLower))
          );
        });
      }
      return this.users;
    },
  },
  methods: {
    // ฟังก์ชันเปิด/ปิด Message Dialog
    openMessageDialog(title, message) {
      this.messageDialogTitle = title;
      this.messageDialogMessage = message;
      this.messageDialogVisible = true;
    },
    closeMessageDialog() {
      this.messageDialogVisible = false;
    },

    // ดึงข้อมูลผู้ใช้งานจาก API แล้วอัปเดต overviewCards
    async loadUsers() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:7000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.users = response.data;
        this.updateOverviewCards();
      } catch (error) {
        console.error("Error loading users:", error);
      }
    },

    updateOverviewCards() {
      const studentCount = this.users.filter(
        (user) => user.role_name.toLowerCase() === "student"
      ).length;
      const teacherCount = this.users.filter(
        (user) => user.role_name.toLowerCase() === "teacher"
      ).length;
      const officerCount = this.users.filter(
        (user) => user.role_name.toLowerCase() === "office"
      ).length;

      this.overviewCards = [
        {
          title: "ผู้ใช้งานทั้งหมด",
          value: this.users.length,
          icon: "mdi-account-multiple",
          color: "deep-purple accent-4",
        },
        {
          title: "จำนวนนักเรียน",
          value: studentCount,
          icon: "mdi-school",
          color: "teal darken-1",
        },
        {
          title: "จำนวนครู",
          value: teacherCount,
          icon: "mdi-human-male-board",
          color: "orange darken-2",
        },
        {
          title: "จำนวนเจ้าหน้าที่",
          value: officerCount,
          icon: "mdi-office-building",
          color: "red accent-3",
        },
      ];

      console.log(
        "📊 อัปเดต overviewCards:",
        JSON.parse(JSON.stringify(this.overviewCards))
      );
    },

    // ฟังก์ชันสำหรับอัปโหลดไฟล์ Excel
    openUploadDialog() {
      this.uploadDialog = true;
      this.selectedFile = null;
    },
    cancelUpload() {
      this.uploadDialog = false;
      this.selectedFile = null;
    },
    async uploadFile() {
      if (!this.selectedFile) {
        alert("กรุณาเลือกไฟล์เพื่ออัปโหลด");
        return;
      }
      const formData = new FormData();
      formData.append("myFile", this.selectedFile);
      try {
        const response = await axios.post(
          "http://localhost:7000/upload/excel",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert(
          `อัปโหลดสำเร็จ! เพิ่มข้อมูล ${response.data.successCount} แถว, ล้มเหลว ${response.data.failedCount} แถว`
        );
        this.uploadDialog = false;
        this.loadUsers();
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
      }
    },

    // เปิด Dialog สำหรับเพิ่มผู้ใช้งานใหม่
    openAddUserDialog() {
      this.dialogTitle = "เพิ่มผู้ใช้งาน";
      this.userToEdit = { id: null, username: "", password: "", email: "", role: "" };
      this.editDialog = true;
    },

    // Save User: ตรวจสอบว่ากำลังเพิ่มหรือแก้ไขข้อมูล
    async saveUser() {
      if (this.$refs.userForm.validate()) {
        if (this.userToEdit.id) {
          await this.updateUser();
        } else {
          await this.addUser();
        }
      }
    },

    // เพิ่มผู้ใช้งานใหม่
    async addUser() {
      try {
        if (
          !this.userToEdit.username ||
          !this.userToEdit.password ||
          !this.userToEdit.email
        ) {
          this.openMessageDialog(
            "คำเตือน",
            "กรุณากรอกข้อมูลให้ครบ: ชื่อผู้ใช้, รหัสผ่าน และอีเมล"
          );
          return;
        }
        const payload = {
          username: this.userToEdit.username,
          email: this.userToEdit.email,
          password: this.userToEdit.password,
          role_id: this.mapRoleToId(this.userToEdit.role),
        };
        await axios.post("http://localhost:7000/users", payload);
        this.editDialog = false;
        this.loadUsers();
        this.openMessageDialog("สำเร็จ", "เพิ่มผู้ใช้งานสำเร็จ!");
      } catch (error) {
        console.error("Error adding user:", error);
        this.openMessageDialog("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการเพิ่มผู้ใช้งาน");
      }
    },

    // อัปเดตข้อมูลผู้ใช้งานที่มีอยู่
    async updateUser() {
      try {
        const token = localStorage.getItem("token");
        let payload = {};
        if (this.userToEdit.username && this.userToEdit.username.trim() !== "") {
          payload.username = this.userToEdit.username;
        }
        if (this.userToEdit.role && this.userToEdit.role.trim() !== "") {
          payload.role_id = this.mapRoleToId(this.userToEdit.role);
        }
        if (this.userToEdit.password && this.userToEdit.password.trim() !== "") {
          payload.password = this.userToEdit.password;
        }
        if (Object.keys(payload).length === 0) {
          this.openMessageDialog("คำเตือน", "ไม่มีข้อมูลที่ต้องแก้ไข");
          return;
        }
        await axios.put(`http://localhost:7000/users/${this.userToEdit.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.editDialog = false;
        this.loadUsers();
        this.openMessageDialog("สำเร็จ", "แก้ไขผู้ใช้งานสำเร็จ!");
      } catch (error) {
        console.error("Error updating user:", error);
        this.openMessageDialog("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการแก้ไขผู้ใช้งาน");
      }
    },

    // เตรียมข้อมูลสำหรับแก้ไขผู้ใช้งาน
    editUser(user) {
      this.dialogTitle = "แก้ไขข้อมูลผู้ใช้งาน";
      const roleValue = user.role_name
        ? user.role_name
        : this.getRoleNameFromId(user.role_id);
      this.userToEdit = {
        ...user,
        password: "",
        role: roleValue,
      };
      this.editDialog = true;
    },

    // ลบผู้ใช้งานที่เลือก (หลายรายการ) ผ่าน API DELETE
    deleteSelectedUsers() {
      console.log("Selected items:", this.selected);
      // this.selected เป็น array ของ object (เพราะ return-object ใช้ใน v-data-table)
      const idsToDelete = this.selected.map((user) => user.id);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("ไม่พบ token ใน localStorage");
        return;
      }
      Promise.all(
        idsToDelete.map((id) =>
          axios.delete(`http://localhost:7000/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      )
        .then(() => {
          this.loadUsers();
          this.selected = [];
          this.openMessageDialog("สำเร็จ", "ลบผู้ใช้งานที่เลือกเรียบร้อยแล้ว");
        })
        .catch((error) => {
          console.error("Error deleting selected users:", error);
          this.openMessageDialog(
            "เกิดข้อผิดพลาด",
            "เกิดข้อผิดพลาดในการลบผู้ใช้งานที่เลือก"
          );
        });
    },

    // ฟังก์ชันที่เรียกเมื่อกด "ยืนยัน" ใน dialog ยืนยันการลบผู้ใช้งานที่เลือก
    confirmDeleteSelected() {
      this.deleteSelectedDialog = false;
      this.deleteSelectedUsers();
    },

    // ฟังก์ชันสำหรับแสดง Message Dialog (ตัวอย่าง)
    openMessageDialog(title, message) {
      this.messageDialogTitle = title;
      this.messageDialogMessage = message;
      this.messageDialogVisible = true;
    },

    // Mapping Role จาก role_id เป็น role name
    getRoleNameFromId(roleId) {
      const mapping = {
        1: "Admin",
        2: "Office",
        3: "Teacher",
        4: "Student",
      };
      return mapping[roleId] || "";
    },

    // Mapping Role จาก role name เป็น role_id
    mapRoleToId(role) {
      const mapping = {
        admin: 1,
        office: 2,
        teacher: 3,
        student: 4,
      };
      return mapping[role.toLowerCase()] || null;
    },

    // เปิด/ปิด Confirmation Dialog สำหรับการลบผู้ใช้งาน (สำหรับการลบคนเดียว)
    showConfirmDialog(user) {
      this.userToDelete = user;
      this.confirmDialog = true;
    },
    cancelDelete() {
      this.userToDelete = null;
      this.confirmDialog = false;
    },
    async deleteUserConfirm() {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:7000/users/${this.userToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.loadUsers();
        this.cancelDelete();
        this.openMessageDialog("สำเร็จ", "ลบผู้ใช้งานสำเร็จ!");
      } catch (error) {
        console.error("Error deleting user:", error);
        this.openMessageDialog("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการลบผู้ใช้งาน");
      }
    },

    // ยกเลิกการแก้ไขผู้ใช้งาน
    cancelEdit() {
      this.userToEdit = { id: null, username: "", password: "", email: "", role: "" };
      this.$refs.userForm.reset();
      this.editDialog = false;
    },
  },
};
</script>

<style scoped>
.dashboard-header {
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
  color: white;
  border-radius: 16px;
}

.dashboard-overview-card {
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.dashboard-overview-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.user-table-card {
  border-radius: 5px;
  overflow: hidden;
}

.search-input .v-input__slot {
  border-radius: 12px !important;
}
</style>
