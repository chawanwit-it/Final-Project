<template>
        <v-container fluid class="custom-container mt-10">
                <v-card class="pa-4 elevation-5 rounded-card">
                        <!-- ส่วนหัวของตาราง -->
                        <v-card-title
                                class="d-flex flex-column flex-md-row align-center justify-space-between header-bg">
                                <h2 class="text-h6 font-weight-bold white--text mb-2 mb-md-0">
                                        ผู้ใช้งานทั้งหมด
                                </h2>


                        </v-card-title>
                                                        <!-- ฟิลเตอร์และค้นหา -->
                                                        <v-row class="flex-wrap pa-6" align="center" justify="end" dense>
                                        <v-col cols="12" sm="12" md="6" class="pa-1">
                                                <v-select v-model="selectedRole" :items="roleOptions" label="เลือกบทบาท"
                                                        clearable dense hide-details variant="underlined"
                                                        class="w-100 custom-input"></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="6" class="pa-1">
                                                <v-text-field v-model="search" append-icon="mdi-magnify" label="ค้นหา"
                                                        single-line hide-details dense variant="underlined"
                                                        class="w-100 custom-input"></v-text-field>
                                        </v-col>
                                </v-row>
                        <!-- ตารางแสดงผู้ใช้งาน -->
                        <v-card-text>
                                <v-data-table :headers="headers" :items="filteredUsers" :search="search"
                                        :items-per-page="5" item-key="id" class="elevation-1 rounded-table custom-table"
                                        dense>
                                        <template v-slot:[`item.actions`]="{ item }">
                                                <!-- ปุ่มแก้ไข -->
                                                <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                                <v-icon small class="mr-2 action-icon" v-bind="attrs"
                                                                        v-on="on" @click="openEditDialog(item)">
                                                                        mdi-pencil
                                                                </v-icon>
                                                        </template>
                                                        <span>แก้ไขข้อมูล</span>
                                                </v-tooltip>
                                                <!-- ปุ่มลบ -->
                                                <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                                <v-icon small class="action-icon" color="error"
                                                                        v-bind="attrs" v-on="on"
                                                                        @click="openConfirmDialog(item)">
                                                                        mdi-delete
                                                                </v-icon>
                                                        </template>
                                                        <span>ลบผู้ใช้งาน</span>
                                                </v-tooltip>
                                        </template>
                                </v-data-table>
                        </v-card-text>
                </v-card>

                <!-- Edit Dialog -->
                <v-dialog v-model="editDialog" max-width="600">
                        <v-card>
                                <v-card-title class="d-flex justify-center">{{ dialogTitle }}</v-card-title>
                                <v-card-text>
                                        <v-form ref="userForm" v-model="formValid" lazy-validation>
                                                <v-row dense>
                                                        <v-col cols="12" md="6">
                                                                <v-text-field variant="underlined" label="ชื่อผู้ใช้ *"
                                                                        v-model="userToEdit.username"
                                                                        :rules="[v => !!v || 'กรุณากรอกชื่อผู้ใช้']"
                                                                        required />
                                                        </v-col>
                                                        <v-col cols="12" md="6">
                                                                <v-text-field variant="underlined" label="รหัสผ่าน *"
                                                                        v-model="userToEdit.password" type="password"
                                                                        :rules="[userToEdit.id ? () => true : v => !!v || 'กรุณากรอกรหัสผ่าน']"
                                                                        :required="!userToEdit.id" />
                                                        </v-col>
                                                        <v-col cols="12" md="6">
                                                                <v-text-field variant="underlined" label="อีเมล *"
                                                                        v-model="userToEdit.email"
                                                                        :rules="[v => !!v || 'กรุณากรอกอีเมล']"
                                                                        required />
                                                        </v-col>
                                                        <v-col cols="12" md="6">
                                                                <v-select variant="underlined" label="บทบาท *"
                                                                        :items="roles" v-model="userToEdit.role"
                                                                        :rules="[v => !!v || 'กรุณาเลือกบทบาท']"
                                                                        required />
                                                        </v-col>
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

                <!-- Confirmation Dialog for Delete -->
                <v-dialog v-model="confirmDialog" max-width="500">
                        <v-card>
                                <v-card-title class="text-h5">ยืนยันการลบ <v-icon
                                                class="ml-2">mdi-delete</v-icon></v-card-title>
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
        </v-container>
</template>

<script setup>
definePageMeta({
  layout: 'layoutadmin',
});
</script>

<script>
import axios from "axios";

export default {
        name: "AllUsers",
        data() {
                return {
                        search: "",
                        selectedRole: null,
                        roleOptions: ["student", "teacher", "office"],
                        headers: [
                                { title: "ชื่อ", value: "username" },
                                { title: "อีเมล", value: "email" },
                                { title: "บทบาท", value: "role_name" },
                                {
                                        title: "จัดการ",
                                        value: "actions",
                                        sortable: false,
                                        align: "center",
                                        width: "120px",
                                },
                        ],
                        users: [],
                        // สำหรับ Edit Dialog
                        editDialog: false,
                        userToEdit: { id: null, username: "", password: "", email: "", role: "" },
                        dialogTitle: "แก้ไขข้อมูลผู้ใช้งาน",
                        formValid: false,
                        // สำหรับ Confirmation Dialog
                        confirmDialog: false,
                        userToDelete: null,
                        // Roles สำหรับ Select ใน Edit Dialog
                        roles: ["Student", "Teacher", "Officer", "Admin"],
                };
        },
        computed: {
                filteredUsers() {
                        if (this.selectedRole) {
                                return this.users.filter(
                                        (user) =>
                                                user.role_name.toLowerCase() === this.selectedRole.toLowerCase()
                                );
                        }
                        return this.users;
                },
        },
        created() {
                this.fetchUsers();
        },
        methods: {
                // ดึงข้อมูลผู้ใช้งานจาก API
                fetchUsers() {
                        const token = localStorage.getItem("token");
                        axios
                                .get("http://localhost:7000/users", {
                                        headers: { Authorization: `Bearer ${token}` },
                                })
                                .then((response) => {
                                        this.users = response.data;
                                })
                                .catch((error) => {
                                        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน:", error);
                                        // fallback: กำหนดข้อมูลจำลอง
                                        this.users = [
                                                { id: 1, username: "Officer One", email: "officer1@example.com", role_name: "officer" },
                                                { id: 2, username: "Officer Two", email: "officer2@example.com", role_name: "officer" },
                                                { id: 3, username: "Teacher One", email: "teacher1@example.com", role_name: "teacher" },
                                                { id: 4, username: "Teacher Two", email: "teacher2@example.com", role_name: "teacher" },
                                                { id: 5, username: "Student One", email: "student1@example.com", role_name: "student" },
                                                { id: 6, username: "Student Two", email: "student2@example.com", role_name: "student" },
                                        ];
                                });
                },

                // เปิด Edit Dialog โดยตั้งค่าข้อมูลผู้ใช้งานที่ต้องการแก้ไข
                openEditDialog(user) {
                        this.dialogTitle = "แก้ไขข้อมูลผู้ใช้งาน";
                        // กำหนดข้อมูลจาก item ที่เลือก โดยไม่เติม password (เว้นไว้เป็นค่าว่าง)
                        this.userToEdit = { ...user, password: "", role: user.role_name || this.getRoleNameFromId(user.role_id) };
                        this.editDialog = true;
                },

                // Save User: ถ้า userToEdit มี id ให้เรียก updateUser ไม่เช่นนั้นเรียก addUser
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
                                const payload = {
                                        username: this.userToEdit.username,
                                        password: this.userToEdit.password,
                                        email: this.userToEdit.email,
                                        role_id: this.mapRoleToId(this.userToEdit.role),
                                };
                                await axios.post("http://localhost:7000/users", payload);
                                this.editDialog = false;
                                this.fetchUsers();
                                alert("เพิ่มผู้ใช้งานสำเร็จ!");
                        } catch (error) {
                                console.error("Error adding user:", error);
                                alert("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้งาน");
                        }
                },

                // อัปเดตข้อมูลผู้ใช้งาน
                async updateUser() {
                        try {
                                const token = localStorage.getItem("token");
                                const payload = {
                                        email: this.userToEdit.email,
                                        role_id: this.mapRoleToId(this.userToEdit.role),
                                };
                                // ส่ง password หากมีการกรอกใหม่
                                if (this.userToEdit.password) {
                                        payload.password = this.userToEdit.password;
                                }
                                await axios.put(`http://localhost:7000/users/${this.userToEdit.id}`, payload, {
                                        headers: { Authorization: `Bearer ${token}` },
                                });
                                this.editDialog = false;
                                this.fetchUsers();
                                alert("แก้ไขข้อมูลสำเร็จ!");
                        } catch (error) {
                                console.error("Error updating user:", error);
                                alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
                        }
                },

                // เปิด Confirmation Dialog สำหรับลบผู้ใช้งาน
                openConfirmDialog(user) {
                        this.userToDelete = user;
                        this.confirmDialog = true;
                },

                // ยกเลิกการลบ
                cancelDelete() {
                        this.userToDelete = null;
                        this.confirmDialog = false;
                },

                // ยืนยันการลบผู้ใช้งาน
                async deleteUserConfirm() {
                        try {
                                const token = localStorage.getItem("token");
                                await axios.delete(`http://localhost:7000/users/${this.userToDelete.id}`, {
                                        headers: { Authorization: `Bearer ${token}` },
                                });
                                this.fetchUsers();
                                this.cancelDelete();
                                alert("ลบผู้ใช้งานสำเร็จ!");
                        } catch (error) {
                                console.error("Error deleting user:", error);
                                alert("เกิดข้อผิดพลาดในการลบผู้ใช้งาน");
                        }
                },

                // ยกเลิก Edit Dialog
                cancelEdit() {
                        this.userToEdit = { id: null, username: "", password: "", email: "", role: "" };
                        this.$refs.userForm.reset();
                        this.editDialog = false;
                },

                // ฟังก์ชันแปลง role เป็น role_id ตามที่ backend คาดหวัง
                mapRoleToId(role) {
                        const mapping = {
                                "Student": 4,
                                "Teacher": 3,
                                "Officer": 2,
                                "Admin": 1,
                        };
                        return mapping[role] || null;
                },

                // หากมีการรับ role_id จาก backend ให้แปลงกลับเป็นชื่อ role
                getRoleNameFromId(roleId) {
                        const mapping = {
                                4: "Student",
                                3: "Teacher",
                                2: "Officer",
                                1: "Admin",
                        };
                        return mapping[roleId] || "";
                },
        },
};
</script>

<style scoped>
.custom-container {
        padding: 16px;
}

.rounded-card {
        border-radius: 20px;
        overflow: hidden;
}

.rounded-table {
        border-radius: 12px;
        overflow: hidden;
}

.header-bg {
        background: linear-gradient(135deg, #ffffff, #ffffff);
        padding: 16px;
}

.header-bg h2 {
        margin: 0;
}

.custom-input .v-input__control {
        border-bottom: 2px solid #ddd;
        transition: border-color 0.3s;
}

.custom-input .v-input__control:hover {
        border-bottom: 2px solid #4a90e2;
}

.custom-table .v-data-table-header th {
        background-color: #f5f5f5;
        font-weight: bold;
}

.custom-table .v-data-table__wrapper {
        background-color: #fff;
}

.action-icon {
        cursor: pointer;
        transition: transform 0.2s;
}

.action-icon:hover {
        transform: scale(1.1);
}

@media (max-width: 600px) {
        .header-bg {
                padding: 12px;
        }

        .custom-container {
                padding: 8px;
        }
}
</style>