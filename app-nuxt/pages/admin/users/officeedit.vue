<template>
  <v-main class="mt-n8">
    <!-- ส่วน header หรือ component สำหรับแสดงเมนูผู้ดูแลระบบ -->
    <div>
      <admin />
    </div>
    <v-container fluid class="pa-md-12 mt-n2">
      <section>
        <h3
          class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold"
        >
          ผู้ใช้งานบทบาทเจ้าหน้าที่งานครูที่ปรึกษา
          <template v-if="selected.length === 0">
            <v-btn
              class="text-none"
              color="primary"
              prepend-icon="mdi-plus"
              rounded="lg"
              slim
              variant="flat"
              @click="openAddDialog"
            >
              เพิ่มข้อมูลเป็นไฟล์
            </v-btn>
          </template>
          <template v-else>
            <v-btn
              class="text-none"
              color="error"
              prepend-icon="mdi-delete"
              rounded="lg"
              slim
              variant="flat"
              @click="openDeleteSelectedDialog"
            >
              ลบข้อมูลที่เลือก
            </v-btn>
          </template>
        </h3>

        <div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
          จัดการผู้ใช้งานระบบเยี่ยมบ้านออนไลน์
        </div>

        <!-- Data Table สำหรับแสดงรายการนักศึกษา -->
        <v-data-table
          class="bg-transparent"
          :headers="headers"
          :items="items"
          item-value="user_id"
          show-select
          v-model="selected"
          :items-per-page="20"
        >
          <template #item.actions-edit="{ item }">
            <v-btn
              class="text-none"
              color="primary"
              min-width="0"
              slim
              variant="text"
              @click="openEditDialog(item)"
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
              @click="openDeleteDialog(item)"
            >
              Delete
            </v-btn>
          </template>
        </v-data-table>
      </section>

      <!-- Dialog: เพิ่มข้อมูล (อัปโหลดไฟล์ Excel) -->
      <v-dialog v-model="addDialog" max-width="500px">
        <v-card>
          <v-card-title>เพิ่มข้อมูล</v-card-title>
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
            <v-btn text @click="addDialog = false">ยกเลิก</v-btn>
            <v-btn color="primary" text @click="addItem">เพิ่ม</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog: แก้ไขข้อมูล -->
      <v-dialog v-model="editDialog" max-width="500px">
        <v-card>
          <v-card-title>แก้ไขข้อมูล</v-card-title>
          <v-card-text>
            <v-text-field v-model="editedItem.username" label="ชื่ผู้ใช้"></v-text-field>
            <!-- แสดงบทบาท (อ่านอย่างเดียว) -->
            <v-text-field
              v-model="editedItem.role_name"
              label="บทบาท"
              disabled
            ></v-text-field>
            <!-- หากต้องการเปลี่ยนรหัสผ่าน ให้ใส่ฟิลด์นี้ -->
            <v-text-field
              v-model="editedItem.password"
              label="รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)"
              type="password"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="editDialog = false">ยกเลิก</v-btn>
            <v-btn color="primary" text @click="saveEdit">บันทึก</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog: แจ้งเตือนสำเร็จ/ข้อผิดพลาด -->
      <v-dialog v-model="successDialog" max-width="400px">
        <v-card>
          <v-card-title class="text-success">✅ สำเร็จ</v-card-title>
          <v-card-text>{{ successMessage }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="successDialog = false"> ตกลง </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog: ยืนยันลบข้อมูล (สำหรับลบรายการเดียว) -->
      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title>ยืนยันการลบ</v-card-title>
          <v-card-text>
            คุณแน่ใจหรือไม่ว่าต้องการลบ "{{ itemToDelete?.office_name }}" ?
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="deleteDialog = false">ยกเลิก</v-btn>
            <v-btn color="error" text @click="deleteItem">ลบ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog: ยืนยันลบข้อมูลที่เลือก (หลายรายการ) -->
      <v-dialog v-model="deleteSelectedDialog" max-width="400px">
        <v-card>
          <v-card-title>ยืนยันการลบ</v-card-title>
          <v-card-text>
            คุณแน่ใจหรือไม่ว่าต้องการลบ {{ selected.length }} รายการ ?
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="deleteSelectedDialog = false">ยกเลิก</v-btn>
            <v-btn color="error" text @click="confirmDeleteSelected"> ลบทั้งหมด </v-btn>
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

export default {
  name: "UserManagement",
  data() {
    return {
      fileUrl: "/files/offices.xlsx",
      selected: [],
      addDialog: false,
      editDialog: false,
      deleteDialog: false,
      deleteSelectedDialog: false,
      successDialog: false,
      successMessage: "",
      itemToDelete: null,
      selectedFile: null,
      // editedItem เก็บข้อมูลของผู้ใช้ที่กำลังแก้ไข (รวมถึง password ถ้าต้องการเปลี่ยน)
      editedItem: {
        user_id: null,
        full_name: "",
        email: "",
        username: "",
        role_name: "",
        password: "",
      },
      // ปรับ headers ให้ใช้ key "user_id" สำหรับรหัสนักศึกษา
      headers: [
        { title: "ชื่อ-นามสกุล", key: "office_name" },
        { title: "อีเมล", key: "email" },
        { title: "เบอร์โทร", key: "phone" },
        { title: "แก้ไข", key: "actions-edit" },
        { title: "ลบ", key: "actions-delete" },
      ],
      items: [],
    };
  },
  created() {
    this.fetchStudents();
  },
  methods: {
    async fetchStudents() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:7000/admin/offices", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📌 โหลดข้อมูลล่าสุดจาก Backend:", response.data);
        this.items = response.data;
      } catch (error) {
        console.error("❌ Error fetching offices:", error);
      }
    },
    openAddDialog() {
      this.addDialog = true;
    },

    async addItem() {
  if (!this.selectedFile) return;
  const formData = new FormData();
  formData.append("myFile", this.selectedFile);
  try {
    const response = await axios.post(
      "http://localhost:7000/upload/excel/offices",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log(response.data);

    // แสดงจำนวนแถวที่สำเร็จใน successMessage
    this.successMessage = `เพิ่มข้อมูลเรียบร้อยแล้ว ✅\n
      แถวที่สำเร็จ: ${response.data.successCount}\n
      แถวที่ล้มเหลว: ${response.data.failedCount}`;

    this.successDialog = true;
    this.addDialog = false;
    this.selectedFile = null;
    this.fetchStudents();
  } catch (error) {
    console.error("Error uploading file:", error);
    this.handleError(error);
  }
},

    openEditDialog(item) {
      this.editedItem = { ...item, password: "" };
      this.editDialog = true;
    },

    async saveEdit() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token ไม่พบใน LocalStorage");
          return;
        }

        const payload = {
          username: this.editedItem.username,
          password: this.editedItem.password ? this.editedItem.password : undefined,
          role_id: this.editedItem.role_id, // ใช้ค่าที่มีอยู่จริง
        };

        console.log("🔹 Payload ที่ส่งไปอัปเดต:", payload); // Log ค่า Payload ก่อนส่งไป API

        const response = await axios.put(
          `http://localhost:7000/users/${this.editedItem.user_id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ บันทึกข้อมูลสำเร็จ", response.data);

        this.editDialog = false;
        this.successMessage = "แก้ไขข้อมูลเรียบร้อยแล้ว";
        this.successDialog = true;

        // เช็คว่าฟังก์ชัน fetchStudents() เรียกทำงานถูกต้องหรือไม่
        await this.fetchStudents(); // โหลดข้อมูลใหม่
      } catch (error) {
        console.error("❌ Error updating user:", error);
        this.handleError(error);
      }
    },

    openDeleteDialog(item) {
      this.itemToDelete = item;
      this.deleteDialog = true;
    },
    async deleteItem() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token ไม่พบใน LocalStorage");
          return;
        }

        const response = await axios.delete(
          `http://localhost:7000/users/${this.itemToDelete.user_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("ลบข้อมูลสำเร็จ", response.data);
        this.deleteDialog = false;
        this.successMessage = "ลบข้อมูลเรียบร้อยแล้ว";
        this.successDialog = true;
        this.fetchStudents();
      } catch (error) {
        console.error("Error deleting user:", error);
        this.handleError(error);
      }
    },

    async deleteSelectedItems() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("ไม่พบ token ใน localStorage");
          return;
        }
        await Promise.all(
          this.selected.map((id) =>
            axios.delete(`http://localhost:7000/users/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
        this.successMessage = "ลบข้อมูลที่เลือกเรียบร้อยแล้ว";
        this.successDialog = true;
        this.deleteSelectedDialog = false;
        this.fetchStudents();
        this.selected = [];
      } catch (error) {
        console.error("Error deleting selected users:", error);
        this.handleError(error);
      }
    },

    confirmDeleteSelected() {
      this.deleteSelectedItems();
    },

    openDeleteSelectedDialog() {
      this.deleteSelectedDialog = true;
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
