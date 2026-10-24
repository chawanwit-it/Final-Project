<template>
  <v-main class="mt-n8">
    <!-- ส่วน Admin (ตรวจสอบให้มีไฟล์ admin.vue อยู่ในโปรเจค) -->
    <div>
      <admin />
    </div>

    <v-container fluid class="pa-md-12 mt-n2">
      <section>
        <h3
          class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold"
        >
          ผู้ใช้งานทั้งหมด
          <!-- แสดงปุ่มเพิ่มข้อมูลเมื่อไม่มีรายการถูกเลือก -->
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
              เพิ่มข้อมูลผู้ใช้
            </v-btn>
          </template>
          <!-- เมื่อมีรายการที่ถูกเลือก ให้แสดงปุ่มลบข้อมูลที่เลือก -->
          <template v-else>
            <v-btn
              class="text-none"
              color="error"
              prepend-icon="mdi-delete"
              rounded="lg"
              slim
              variant="flat"
              @click="deleteSelectedDialog = true"
            >
              ลบข้อมูลที่เลือก
            </v-btn>
          </template>
        </h3>

        <div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
          จัดการผู้ใช้งานระบบเยี่ยมบ้านออนไลน์
        </div>

        <!-- ตารางแสดงข้อมูลผู้ใช้ -->
        <v-data-table
          class="bg-transparent"
          :headers="headers"
          :items="items"
          item-key="id"
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

      <!-- Dialog: ยืนยันการลบข้อมูลที่เลือก -->
      <v-dialog v-model="deleteSelectedDialog" max-width="400px">
        <v-card>
          <v-card-title>ยืนยันการลบ</v-card-title>
          <v-card-text>
            คุณแน่ใจหรือไม่ว่าต้องการลบ {{ selected.length }} รายการ ?
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="deleteSelectedDialog = false">ยกเลิก</v-btn>
            <v-btn color="error" text @click="confirmDeleteSelected">
              ลบข้อมูลที่เลือก
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog: เพิ่มข้อมูลผู้ใช้ (API POST) -->
      <v-dialog v-model="addDialog" max-width="500px">
        <v-card>
          <v-card-title>เพิ่มข้อมูลผู้ใช้</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newItem.username"
              label="ชื่อผู้ใช้"
              :rules="[(v) => !!v || 'กรุณากรอกชื่อผู้ใช้']"
            />
            <v-text-field
              v-model="newItem.email"
              label="อีเมล"
              :rules="[(v) => !!v || 'กรุณากรอกอีเมล']"
            />
            <v-text-field
              v-model="newItem.password"
              label="รหัสผ่าน"
              type="password"
              :rules="[(v) => !!v || 'กรุณากรอกรหัสผ่าน']"
            />
            <v-select
              v-model="newItem.role_id"
              :items="roles"
              label="บทบาท"
              item-title="title"
              item-value="value"
              :rules="[(v) => !!v || 'กรุณาเลือกบทบาท']"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="addDialog = false">ยกเลิก</v-btn>
            <v-btn color="primary" text @click="addItem">เพิ่ม</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog: แก้ไขข้อมูลผู้ใช้ (API PUT) -->
      <v-dialog v-model="editDialog" max-width="500px">
        <v-card>
          <v-card-title>แก้ไขข้อมูลผู้ใช้</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="editedItem.username"
              label="ชื่อผู้ใช้"
              :rules="[(v) => !!v || 'กรุณากรอกชื่อผู้ใช้']"
            />
            <v-text-field v-model="editedItem.email" label="อีเมล" disabled />
            <v-text-field
              v-model="editedItem.password"
              label="รหัสผ่าน (ถ้าต้องการเปลี่ยน)"
              type="password"
            />
            <v-select
              v-model="editedItem.role_id"
              :items="roles"
              label="บทบาท"
              item-title="title"
              item-value="value"
              :rules="[(v) => !!v || 'กรุณาเลือกบทบาท']"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="editDialog = false">ยกเลิก</v-btn>
            <v-btn color="primary" text @click="saveEdit">บันทึก</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog: แจ้งเตือนข้อความ (สำเร็จ/ข้อผิดพลาด) -->
      <v-dialog v-model="messageDialog" max-width="400px">
        <v-card>
          <v-card-title
            :class="{ 'text-success': messageSuccess, 'text-error': !messageSuccess }"
          >
            {{ messageSuccess ? "✅ สำเร็จ" : "❌ ข้อผิดพลาด" }}
          </v-card-title>
          <v-card-text>{{ messageText }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="messageDialog = false"> ตกลง </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog: ยืนยันลบผู้ใช้รายเดียว (API DELETE) -->
      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title>ยืนยันการลบ</v-card-title>
          <v-card-text>
            คุณแน่ใจหรือไม่ว่าต้องการลบ "{{ itemToDelete.username }}" ?
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="deleteDialog = false">ยกเลิก</v-btn>
            <v-btn color="error" text @click="deleteItem">ลบ</v-btn>
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
      selected: [],
      addDialog: false,
      editDialog: false,
      deleteDialog: false,
      deleteSelectedDialog: false,
      messageDialog: false,
      messageText: "",
      messageSuccess: true,
      itemToDelete: null,
      // สำหรับเพิ่มผู้ใช้ใหม่
      newItem: { username: "", email: "", password: "", role_id: null },
      // สำหรับแก้ไขผู้ใช้ (email ไม่แก้ไขได้)
      editedItem: { id: null, username: "", email: "", password: "", role_id: null },
      // รายการบทบาท (กำหนด key เป็น title และ value)
      roles: [
        { title: "Admin", value: 1 },
        { title: "Office", value: 2 },
        { title: "Teacher", value: 3 },
        { title: "Student", value: 4 },
      ],
      // Headers สำหรับตาราง (ข้อมูลที่ได้จาก API GET)
      headers: [
        { title: "ชื่อผู้ใช้", key: "username" },
        { title: "อีเมล", key: "email" },
        { title: "บทบาท", key: "role_name" },
        { title: "แก้ไข", key: "actions-edit" },
        { title: "ลบ", key: "actions-delete" },
      ],
      items: [], // เก็บข้อมูลผู้ใช้จาก API GET
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    // ดึง token จาก localStorage และคืน header ที่มี Authorization
    getAuthHeader() {
      const token = localStorage.getItem("token");
      return { Authorization: `Bearer ${token}` };
    },
    // ดึงข้อมูลผู้ใช้จาก API GET
    fetchUsers() {
      axios
        .get("http://localhost:7000/users", {
          headers: this.getAuthHeader(),
        })
        .then((response) => {
          console.log("Fetched users:", response.data);
          this.items = response.data;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          this.showMessage("Error fetching users", false);
        });
    },
    // เปิด Dialog เพิ่มข้อมูลผู้ใช้ใหม่
    openAddDialog() {
      this.newItem = { username: "", email: "", password: "", role_id: null };
      this.addDialog = true;
    },
    // เพิ่มผู้ใช้ใหม่ผ่าน API POST
    addItem() {
      if (
        !this.newItem.username ||
        !this.newItem.email ||
        !this.newItem.password ||
        !this.newItem.role_id
      ) {
        this.showMessage("กรุณากรอกข้อมูลให้ครบถ้วน", false);
        return;
      }
      axios
        .post("http://localhost:7000/users", this.newItem, {
          headers: this.getAuthHeader(),
        })
        .then((response) => {
          this.showMessage("เพิ่มข้อมูลเรียบร้อยแล้ว", true);
          this.addDialog = false;
          this.fetchUsers();
        })
        .catch((error) => {
          console.error("Error adding user:", error);
          this.showMessage("Error adding user", false);
        });
    },
    // เปิด Dialog แก้ไขข้อมูลผู้ใช้
    openEditDialog(item) {
      this.editedItem = {
        id: item.id,
        username: item.username,
        email: item.email,
        password: "", // หากไม่ต้องการเปลี่ยนรหัสผ่าน ให้เว้นว่างไว้
        role_id: this.getRoleIdFromName(item.role_name),
      };
      this.editDialog = true;
    },
    // แปลง role_name เป็น role_id จาก array roles
    getRoleIdFromName(roleName) {
      const role = this.roles.find((r) => r.title === roleName);
      return role ? role.value : null;
    },
    // บันทึกการแก้ไขผู้ใช้ผ่าน API PUT
    saveEdit() {
      if (!this.editedItem.username || !this.editedItem.role_id) {
        this.showMessage("กรุณากรอกข้อมูลให้ครบถ้วน", false);
        return;
      }
      const payload = {
        username: this.editedItem.username,
        role_id: this.editedItem.role_id,
      };
      if (this.editedItem.password) {
        payload.password = this.editedItem.password;
      }
      axios
        .put(`http://localhost:7000/users/${this.editedItem.id}`, payload, {
          headers: this.getAuthHeader(),
        })
        .then((response) => {
          this.showMessage("แก้ไขข้อมูลเรียบร้อยแล้ว", true);
          this.editDialog = false;
          this.fetchUsers();
        })
        .catch((error) => {
          console.error("Error updating user:", error);
          this.showMessage("Error updating user", false);
        });
    },
    // เปิด Dialog ยืนยันการลบผู้ใช้รายเดียว
    openDeleteDialog(item) {
      this.itemToDelete = item;
      this.deleteDialog = true;
    },
    // ลบผู้ใช้รายเดียวผ่าน API DELETE
    deleteItem() {
      axios
        .delete(`http://localhost:7000/users/${this.itemToDelete.id}`, {
          headers: this.getAuthHeader(),
        })
        .then((response) => {
          this.showMessage("ลบข้อมูลเรียบร้อยแล้ว", true);
          this.deleteDialog = false;
          this.fetchUsers();
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          this.showMessage("Error deleting user", false);
        });
    },
    // ลบผู้ใช้ที่เลือก (หลายรายการ) ผ่าน API DELETE
    deleteSelectedItems() {
      console.log("Selected IDs:", this.selected);
      const deletePromises = this.selected.map((id) =>
        axios.delete(`http://localhost:7000/users/${id}`, {
          headers: this.getAuthHeader(),
        })
      );
      Promise.all(deletePromises)
        .then(() => {
          this.showMessage("ลบข้อมูลที่เลือกเรียบร้อยแล้ว", true);
          this.selected = [];
          this.deleteSelectedDialog = false;
          this.fetchUsers();
        })
        .catch((error) => {
          console.error("Error deleting selected users:", error);
          this.showMessage("Error deleting selected users", false);
        });
    },
    // ฟังก์ชันยืนยันการลบที่เลือกก่อนลบจริง
    confirmDeleteSelected() {
      this.deleteSelectedDialog = false;
      this.deleteSelectedItems();
    },
    // ฟังก์ชันสำหรับแสดงข้อความแจ้งเตือนผ่าน Dialog
    showMessage(message, success = true) {
      this.messageText = message;
      this.messageSuccess = success;
      this.messageDialog = true;
    },
  },
};
</script>
