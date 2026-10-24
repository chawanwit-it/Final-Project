<template>
  <v-main>
    <v-container fluid>
      <v-row justify="center" class="mt-n16">
        <v-col cols="12" md="12" lg="10">
          <v-card elevation="8" class="profile-card">
            <v-card-title
              class="d-flex justify-space-between align-center px-6 py-4 bg-primary"
            >
              <span class="text-h6 font-weight-bold text-white">โปรไฟล์ของฉัน</span>
              <v-btn
                icon
                variant="tonal"
                @click="toggleEditMode"
                :color="editMode ? 'error' : 'white'"
                class="ml-4"
              >
                <v-icon>{{ editMode ? "mdi-close" : "mdi-pencil" }}</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text class="px-6 py-">
              <!-- เปลี่ยนจาก v-model="formValid" และ @submit.prevent="..." เป็น Composition API -->
              <v-form ref="profileFormRef" @submit.prevent="saveProfile">
                <v-row>
                  <v-col cols="12" md="4" class="text-center pa-16">
                    <div class="profile-avatar-container">
                      <v-avatar size="170" class="profile-avatar elevation-6">
                        <v-img
                          :src="
                            profileData.avatarUrl ||
                            '/profile.png'
                          "
                          alt="Profile Picture"
                          cover
                        ></v-img>
                      </v-avatar>
                      <v-fade-transition>
                        <v-btn
                          v-if="editMode"
                          icon="mdi-camera"
                          variant="tonal"
                          color="primary"
                          class="avatar-edit-button"
                          @click="triggerFileInput"
                        ></v-btn>
                      </v-fade-transition>
                    </div>
                    <!-- ซ่อน input file ไว้ แล้วอ้างอิงด้วย fileInputRef -->
                    <input
                      ref="fileInputRef"
                      type="file"
                      accept="image/*"
                      class="d-none"
                      @change="onFileChange"
                    />
                    <div v-if="editMode" class="text-caption text-medium-emphasis mt-2">
                      คลิกที่ไอคอนกล้องเพื่อเปลี่ยนรูปโปรไฟล์
                    </div>
                  </v-col>

                  <v-col cols="12" md="8">
                    <div class="profile-fields">
                      <v-text-field
                        v-model="profileData.full_name"
                        label="ชื่อ-นามสกุล"
                        :readonly="!editMode"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi mdi-rename-outline"
                        required
                        class="mb-4"
                      ></v-text-field>

                      <v-text-field
                        v-model="profileData.student_id"
                        label="รหัสนักศึกษา"
                        :readonly="!editMode"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi mdi-account-school-outline"
                        required
                        class="mb-4"
                      ></v-text-field>

                      <v-text-field
                        v-model="profileData.education_level"
                        label="ระดับชั้น"
                        :readonly="!editMode"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi mdi-book-education-outline"
                        required
                        class="mb-4"
                      ></v-text-field>

                      <v-text-field
                        v-model="profileData.department"
                        label="แผนก"
                        :readonly="!editMode"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi mdi-town-hall"
                        required
                        class="mb-4"
                      ></v-text-field>

                      <v-text-field
                        v-model="profileData.room"
                        label="กลุ่ม/ห้อง"
                        :readonly="!editMode"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi mdi-google-classroom"
                        required
                        class="mb-4"
                      ></v-text-field>
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-divider v-if="editMode"></v-divider>

            <v-card-actions v-if="editMode" class="pa-6">
              <v-spacer></v-spacer>
              <v-btn color="error" variant="outlined" class="mr-4" @click="cancelEdit">
                ยกเลิก
              </v-btn>
              <v-btn color="primary" :loading="saving" @click="saveProfile">
                <v-icon left class="mr-2">mdi-content-save</v-icon>
                บันทึกการเปลี่ยนแปลง
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Snackbar/Alert Dialog -->
      <v-dialog v-model="snackbar.show" persistent max-width="400px">
        <v-card :color="snackbar.color" elevation="4">
          <v-card-text class="d-flex align-center">
            <v-icon
              :icon="
                snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'
              "
              start
              class="mr-2"
            ></v-icon>
            {{ snackbar.text }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="snackbar.show = false">ปิด</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<script setup>
definePageMeta({
  layout: "layoutstudent",
});

import { ref, reactive, onMounted, watch } from "vue";
import axios from "axios";

// State สำหรับโหมดแก้ไขและการบันทึก
const editMode = ref(false);
const saving = ref(false);
const selectedFile = ref(null);

// เก็บข้อมูลโปรไฟล์ (ทั้งต้นฉบับและที่แก้ไข)
const originalProfileData = reactive({
  full_name: "",
  student_id: "",
  education_level: "",
  department: "",
  room: "",
  avatarUrl: null,
});
const profileData = reactive({
  full_name: "",
  student_id: "",
  education_level: "",
  department: "",
  room: "",
  avatarUrl: null,
});

// อ้างอิงฟอร์มและ input file
const profileFormRef = ref(null);
const fileInputRef = ref(null);

// Snackbar สำหรับแสดงข้อความ
const snackbar = reactive({
  show: false,
  text: "",
  color: "",
});

/**
 * ดึงข้อมูลโปรไฟล์จาก API
 */
 function fetchProfile() {
  const token = localStorage.getItem("token");
  let studentId = localStorage.getItem("studentId");

  if (studentId && studentId.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(studentId);
      if (parsed && parsed.student_id) {
        studentId = parsed.student_id;
      }
    } catch (e) {
      console.error("Error parsing studentId from localStorage:", e);
    }
  }
  if (!studentId) {
    const studentData = localStorage.getItem("student");
    if (studentData) {
      try {
        const studentObj = JSON.parse(studentData);
        studentId = studentObj.student_id;
      } catch (e) {
        showSnackbar("เกิดข้อผิดพลาดในการแปลงข้อมูลนักเรียน", "error");
        return;
      }
    }
  }
  if (!token) {
    showSnackbar("ไม่พบโทเค็นสำหรับการยืนยันตัวตน", "error");
    return;
  }
  if (!studentId) {
    showSnackbar("ไม่พบ student ID", "error");
    return;
  }

axios
  .get(`http://localhost:7000/profile/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((response) => {
    // สมมุติว่า response.data.img เป็น "/uploads/avatar-xxxx.jpg"
    const avatarUrl = response.data.img
      ? `http://localhost:7000${response.data.img}`
      : null;
    Object.assign(profileData, { ...response.data, avatarUrl });
    Object.assign(originalProfileData, { ...response.data, avatarUrl });
  })
  .catch((error) => {
    console.error("Error fetching profile data:", error);
    showSnackbar("ไม่สามารถดึงข้อมูลโปรไฟล์ได้", "error");
  });

}


/**
 * ฟังก์ชันสำหรับสลับโหมดแก้ไข
 */
function toggleEditMode() {
  if (editMode.value) {
    cancelEdit();
  } else {
    editMode.value = true;
  }
}

/**
 * ยกเลิกการแก้ไข
 */
function cancelEdit() {
  editMode.value = false;
  resetProfileData();
  if (profileFormRef.value) {
    profileFormRef.value.resetValidation();
  }
}

/**
 * เมื่อมีการเลือกไฟล์ใหม่ ให้เตรียม preview
 */
function onFileChange(e) {
  selectedFile.value = e.target.files?.[0] ?? null;
}

/**
 * แสดง preview ของรูปโปรไฟล์
 */
function handleAvatarPreview(file) {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileData.avatarUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

/**
 * กดปุ่มเพื่อเปิด file input
 */
function triggerFileInput() {
  if (fileInputRef.value && typeof fileInputRef.value.click === "function") {
    fileInputRef.value.click();
  } else {
    console.error("fileInputRef is not available or not clickable", fileInputRef.value);
  }
}

/**
 * อัปโหลดรูปโปรไฟล์ไปยังเซิร์ฟเวอร์
 */
async function uploadAvatar() {
  if (!selectedFile.value) return;
  const token = localStorage.getItem("token");
  const formData = new FormData();
  // 'avatar' ต้องตรงกับ field name ใน Multer (upload.single('avatar'))
  formData.append("avatar", selectedFile.value);
  try {
    const response = await axios.post(
      `http://localhost:7000/upload/${profileData.student_id}/avatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // อัปเดต URL รูปโปรไฟล์ที่เซิร์ฟเวอร์ส่งกลับมา
    profileData.avatarUrl = response.data.img;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    showSnackbar("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ", "error");
    throw error;
  }
}

/**
 * บันทึกข้อมูลโปรไฟล์ (รวมถึงอัปโหลดรูปโปรไฟล์หากมี)
 */
async function saveProfile() {
  if (profileFormRef.value && !profileFormRef.value.validate()) {
    showSnackbar("กรุณากรอกข้อมูลให้ถูกต้องครบถ้วน", "error");
    return;
  }
  saving.value = true;
  const token = localStorage.getItem("token");
  if (!token) {
    showSnackbar("ไม่พบโทเค็นสำหรับการยืนยันตัวตน", "error");
    saving.value = false;
    return;
  }
  try {
    // หากมีไฟล์ใหม่ ให้ทำการอัปโหลดก่อน
    if (selectedFile.value) {
      await uploadAvatar();
    }
    // เรียก API PATCH เพื่ออัปเดตข้อมูลโปรไฟล์
    await axios.patch(
      `http://localhost:7000/profile/${profileData.student_id}`,
      profileData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // รีเฟรชข้อมูลหลังอัปเดต
    fetchProfile();
    showSnackbar("บันทึกข้อมูลเรียบร้อยแล้ว", "success");
    editMode.value = false;
  } catch (error) {
    console.error("Error updating profile:", error);
    showSnackbar("เกิดข้อผิดพลาดในการบันทึกข้อมูล", "error");
  } finally {
    saving.value = false;
  }
}

/**
 * รีเซ็ตข้อมูลกลับเป็นค่าดั้งเดิม
 */
function resetProfileData() {
  Object.assign(profileData, originalProfileData);
  selectedFile.value = null;
}

/**
 * แสดง Snackbar
 */
function showSnackbar(message, color) {
  snackbar.text = message;
  snackbar.color = color;
  snackbar.show = true;
}

// เมื่อ selectedFile เปลี่ยน ให้เรียก preview รูปโปรไฟล์
watch(selectedFile, (file) => {
  if (file) {
    handleAvatarPreview(file);
  }
});

// เมื่อหน้าโปรไฟล์ถูก mount ให้ดึงข้อมูลโปรไฟล์
onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
.profile-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.profile-avatar-container {
  position: relative;
  display: inline-block;
}

.avatar-edit-button {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 8px;
  background-color: rgba(255, 255, 255, 0.8);
}

.profile-fields {
  max-width: 100%;
}

@media (min-width: 960px) {
  .profile-fields {
    padding-left: 16px;
  }
}

.v-text-field :deep(.v-field__input) {
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
