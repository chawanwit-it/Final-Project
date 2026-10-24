<template>
  <v-main class="bg-grey-lighten-3">
    <v-container fluid class="pa-6">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card elevation="3" class="rounded-lg">
            <!-- Header -->
            <v-card-title class="bg-primary py-6 px-6">
              <span class="text-h4 font-weight-bold white--text">
                รายงานการเยี่ยมบ้านนักศึกษา
              </span>
            </v-card-title>

            <v-card-text class="pa-6">
              <!-- Error Alert -->
              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                closable
                class="mb-6"
                @input="errorMessage = ''"
              >
                {{ errorMessage }}
              </v-alert>

              <!-- Form -->
              <v-form
                ref="form"
                v-model="isFormValid"
                lazy-validation
                @submit.prevent="handleSubmit"
              >
                <!-- Section 1: สภาพแวดล้อม -->
                <v-sheet class="mb-8">
                  <div class="section-header mb-4">
                    <span class="text-h5 font-weight-bold text-primary">
                      1. สภาพแวดล้อมบริเวณบ้าน
                    </span>
                  </div>
                  <v-radio-group v-model="advisorHomeEnvironment" row class="mt-2">
                    <v-radio
                      v-for="option in ['ดี', 'พอใช้', 'ไม่ดี', 'ควรปรับปรุง']"
                      :key="option"
                      :label="option"
                      :value="option"
                      color="primary"
                      class="mr-6"
                    />
                  </v-radio-group>
                </v-sheet>

                <!-- Section 2: การปฏิบัติตนของนักเรียน -->
                <v-sheet class="mb-8">
                  <div class="section-header mb-4">
                    <span class="text-h5 font-weight-bold text-primary">
                      2. การปฏิบัติตนของนักเรียน/นักศึกษา
                    </span>
                  </div>
                  <v-row dense>
                    <v-col cols="12">
                      <v-select
                        v-model="advisorStudentBehavior"
                        :items="advisorStudentBehaviorOptions"
                        label="เลือกพฤติกรรมของนักเรียน/นักศึกษา"
                        multiple
                        chips
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" class="mt-4">
                      <v-textarea
                        v-model="advisorStudentBehaviorOther"
                        label="อื่นๆ (ระบุ)"
                        variant="outlined"
                        rows="2"
                        density="comfortable"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                </v-sheet>

                <!-- Section 3: รายได้การใช้จ่าย -->
                <v-sheet class="mb-8">
                  <div class="section-header mb-4">
                    <span class="text-h5 font-weight-bold text-primary">
                      3. รายได้การใช้จ่ายในครอบครัว
                    </span>
                  </div>
                  <v-radio-group v-model="advisorFamilyFinance" row class="mt-2">
                    <v-radio
                      v-for="option in ['เพียงพอ', 'บางครั้งไม่เพียงพอ', 'ไม่เพียงพอ']"
                      :key="option"
                      :label="option"
                      :value="option"
                      color="primary"
                      class="mr-6"
                    />
                  </v-radio-group>
                </v-sheet>

                <!-- Section 4: ทุนการศึกษา -->
                <v-sheet class="mb-8">
                  <div class="section-header mb-4">
                    <span class="text-h5 font-weight-bold text-primary">
                      4. ทุนการศึกษา
                    </span>
                  </div>
                  <v-radio-group v-model="advisorScholarshipNeed" row class="mt-2">
                    <v-radio
                      v-for="option in ['ไม่ต้องการ', 'ต้องการ']"
                      :key="option"
                      :label="option"
                      :value="option"
                      color="primary"
                      class="mr-6"
                    />
                  </v-radio-group>
                </v-sheet>

                <!-- Section 5: พฤติกรรมและข้อเสนอแนะ -->
                <v-sheet class="mb-8">
                  <div class="section-header mb-4">
                    <span class="text-h5 font-weight-bold text-primary">
                      5. พฤติกรรมและข้อเสนอแนะ
                    </span>
                  </div>
                  <v-row dense>
                    <v-col cols="12">
                      <v-textarea
                        v-model="advisorPositiveBehavior"
                        label="พฤติกรรมที่ดี"
                        variant="outlined"
                        rows="2"
                        class="mb-4"
                        density="comfortable"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="advisorImprovementBehavior"
                        label="พฤติกรรมที่ต้องปรับปรุง"
                        variant="outlined"
                        rows="2"
                        class="mb-4"
                        density="comfortable"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="advisorProblemSolving"
                        label="ปัญหา / แนวทางการแก้ปัญหา"
                        variant="outlined"
                        rows="2"
                        class="mb-4"
                        density="comfortable"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="advisorParentOpinion"
                        label="ความคิดเห็นของผู้ปกครอง"
                        variant="outlined"
                        rows="2"
                        class="mb-4"
                        density="comfortable"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="advisorTeacherSuggestion"
                        label="ข้อเสนอแนะของครูที่ปรึกษา"
                        variant="outlined"
                        rows="2"
                        class="mb-4"
                        density="comfortable"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                </v-sheet>

                <!-- Section 6: รูปภาพ -->
                <v-sheet class="mb-8">
                  <div class="section-header mb-4">
                    <span class="text-h5 font-weight-bold text-primary">
                      6. รูปภาพ (2-3 รูป)
                    </span>
                  </div>

                  <!-- แสดงรูปภาพที่รายงานไปแล้ว -->
                  <div v-if="existingImages.length > 0" class="mb-4">
                    <v-row dense class="mt-2">
                      <v-col
                        v-for="(imgUrl, index) in existingImages"
                        :key="'existing-' + index"
                        cols="12"
                        sm="6"
                        md="4"
                        class="pa-2"
                      >
                        <v-card elevation="2" class="rounded-lg">
                          <v-img
                            :src="imgUrl"
                            height="200"
                            :aspect-ratio="4 / 3"
                            cover
                            class="grey lighten-2"
                          >
                            <template #placeholder>
                              <v-row align="center" justify="center" class="fill-height">
                                <v-progress-circular indeterminate color="primary" />
                              </v-row>
                            </template>
                          </v-img>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- File input สำหรับเพิ่มรูปภาพใหม่ -->
                  <v-file-input
                    v-model="advisorUploadedImages"
                    label="เลือกรูปภาพเพิ่ม"
                    multiple
                    accept="image/*"
                    variant="outlined"
                    prepend-icon="mdi-camera"
                    density="comfortable"
                    class="mb-4"
                    :rules="[
                      (v) => !v || v.length <= 3 || 'กรุณาเลือกรูปภาพไม่เกิน 3 รูป',
                    ]"
                    :show-size="true"
                    hint="รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB"
                    @change="openDialog"
                  />

                  <!-- Dialog สำหรับ Preview รูปภาพใหม่ -->
                  <v-dialog v-model="dialogConfirm" max-width="800">
                    <v-card class="pa-4">
                      <v-card-title class="text-h6 font-weight-bold mb-4">
                        ตัวอย่างรูปภาพที่เลือก
                      </v-card-title>
                      <v-card-text>
                        <v-row dense>
                          <v-col
                            v-for="(file, index) in advisorUploadedImages"
                            :key="'new-' + index"
                            cols="12"
                            class="pa-2"
                          >
                            <v-card elevation="2" class="rounded-lg position-relative">
                              <v-img
                                :src="getImageUrl(file)"
                                height="300"
                                cover
                                class="grey lighten-2"
                              >
                                <template #placeholder>
                                  <v-row
                                    align="center"
                                    justify="center"
                                    class="fill-height"
                                  >
                                    <v-progress-circular indeterminate color="primary" />
                                  </v-row>
                                </template>
                              </v-img>
                              <v-btn
                                icon="mdi-close"
                                size="small"
                                color="error"
                                variant="tonal"
                                class="position-absolute top-right ma-2"
                                @click="removeImage(index)"
                              />
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions class="pt-4">
                        <v-spacer />
                        <v-btn
                          color="grey"
                          variant="text"
                          @click="cancelShowImages"
                          class="mr-2"
                        >
                          ยกเลิก
                        </v-btn>
                        <v-btn color="primary" @click="confirmShowImages"> ยืนยัน </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <!-- Main Preview สำหรับรูปภาพใหม่ -->
                  <v-slide-y-transition>
                    <div v-if="showImagesPreview">
                      <v-row dense class="mt-4">
                        <v-col
                          v-for="(file, index) in advisorUploadedImages"
                          :key="'preview-' + index"
                          cols="12"
                          sm="6"
                          md="4"
                          class="pa-2"
                        >
                          <v-card elevation="2" class="rounded-lg position-relative">
                            <v-img
                              :src="getImageUrl(file)"
                              height="200"
                              :aspect-ratio="4 / 3"
                              cover
                              class="grey lighten-2"
                            >
                              <template #placeholder>
                                <v-row
                                  align="center"
                                  justify="center"
                                  class="fill-height"
                                >
                                  <v-progress-circular indeterminate color="primary" />
                                </v-row>
                              </template>
                            </v-img>
                            <v-btn
                              icon="mdi-close"
                              size="small"
                              color="error"
                              variant="tonal"
                              class="position-absolute top-right ma-2"
                              @click="removeImage(index)"
                            />
                          </v-card>
                        </v-col>
                      </v-row>
                    </div>
                  </v-slide-y-transition>
                </v-sheet>

                <!-- Action Buttons -->
                <v-row class="mt-6">
                  <v-col cols="12" class="d-flex justify-end">
                    <v-btn
                      color="grey"
                      variant="outlined"
                      class="mr-4"
                      @click="goBack"
                      prepend-icon="mdi-arrow-left"
                    >
                      กลับ
                    </v-btn>
                    <v-btn type="submit" color="primary" :disabled="!isFormValid">
                      บันทึกข้อมูล
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="successDialog" persistent max-width="500">
        <v-card>
          <v-card-title class="headline">✅ สำเร็จ</v-card-title>
          <v-card-text> บันทึกข้อมูลรายงานการเยี่ยมบ้านสำเร็จ </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="onSuccessDialogClose"> ตกลง </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, watch } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  layout: "layoutteacher",
});

const router = useRouter();
const route = useRoute();

// ฟิลด์สำหรับตรวจสอบ form
const isFormValid = ref(false);
const errorMessage = ref("");

// ข้อมูลรายงาน
const advisorHomeEnvironment = ref("");
const advisorStudentBehavior = ref([]);
const advisorStudentBehaviorOther = ref("");
const advisorFamilyFinance = ref("");
const advisorScholarshipNeed = ref("");
const advisorPositiveBehavior = ref("");
const advisorImprovementBehavior = ref("");
const advisorProblemSolving = ref("");
const advisorParentOpinion = ref("");
const advisorTeacherSuggestion = ref("");

// รูปภาพอัปโหลดใหม่
const advisorUploadedImages = ref([]);

// ตัวเลือก checkbox
const advisorStudentBehaviorOptions = [
  "อ่านหนังสือทำการบ้าน",
  "ช่วยงานผู้ปกครอง",
  "ทำงานบ้าน",
  "ไม่ช่วยงานเลย",
];

const computedStudentBehavior = computed(() => {
  console.log("advisorStudentBehavior:", advisorStudentBehavior.value);
  const behaviorList = Array.isArray(advisorStudentBehavior.value)
    ? advisorStudentBehavior.value.slice()
    : [];
  const otherText = advisorStudentBehaviorOther.value.trim();
  if (otherText) {
    behaviorList.push(otherText);
  }
  console.log("computedStudentBehavior:", behaviorList);
  return behaviorList.join(",");
});

watch(advisorStudentBehavior, (newVal) => {
  console.log("Selected behaviors:", newVal);
});

// Dialog สำหรับ preview รูปภาพใหม่ (มีอยู่แล้วในโค้ด)
const dialogConfirm = ref(false);
const showImagesPreview = ref(false);

// เพิ่มตัวแปรสำหรับ success dialog
const successDialog = ref(false);

// รูปภาพที่มีอยู่แล้ว (โหลดมาจาก API)
const existingImages = ref([]);

// ดึง id ของรายงานจาก params
const visitReportId = ref(route.params.id || null);
if (!visitReportId.value) {
  errorMessage.value = "ไม่พบรหัสรายงานใน URL";
}

// สำหรับอ้างอิงฟอร์ม
const form = ref(null);

// ฟังก์ชันแปลง File object เป็น URL
function getImageUrl(file) {
  return file instanceof File ? URL.createObjectURL(file) : file;
}

// ลบรูปใหม่ที่เพิ่งเลือก
function removeImage(index) {
  advisorUploadedImages.value.splice(index, 1);
  if (advisorUploadedImages.value.length === 0) {
    showImagesPreview.value = false;
  }
}

// เปิด dialog preview รูปภาพใหม่
function openDialog() {
  if (advisorUploadedImages.value && advisorUploadedImages.value.length > 0) {
    dialogConfirm.value = true;
    showImagesPreview.value = false;
  }
}

// ยืนยันแสดงรูปภาพ (หลังจาก dialog)
function confirmShowImages() {
  showImagesPreview.value = true;
  dialogConfirm.value = false;
}

// ยกเลิกการอัปโหลด (ล้างรูปที่เลือก)
function cancelShowImages() {
  advisorUploadedImages.value = [];
  showImagesPreview.value = false;
  dialogConfirm.value = false;
}

// ลบรูปภาพเดิมเฉพาะรูปนั้น
function removeExistingImage(index) {
  existingImages.value.splice(index, 1);
}

// ฟังก์ชันสำหรับปิด success dialog แล้วกลับหน้า
function onSuccessDialogClose() {
  successDialog.value = false;
  router.push("/teacher/repost");
}

// ฟังก์ชันอัปเดต visit report
async function updateVisitReport() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      errorMessage.value = "ไม่มี token ใน localStorage";
      router.push("/login");
      return;
    }

    // อัปโหลดไฟล์รูปภาพใหม่ (ถ้ามี)
    let newImageFileNames = "";
    if (advisorUploadedImages.value.length > 0) {
      const formData = new FormData();
      advisorUploadedImages.value.forEach((file) => {
        formData.append("myFiles", file);
      });
      formData.append("visit_id", visitReportId.value);

      const uploadRes = await axios.post("http://localhost:7000/upload/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      newImageFileNames = uploadRes.data.fileNames || "";
    }

    // รวมไฟล์รูปภาพเดิม + ไฟล์ใหม่
    let finalImageFileNames = "";
    if (existingImages.value.length > 0 && newImageFileNames) {
      finalImageFileNames = existingImages.value
        .concat(newImageFileNames.split(","))
        .join(",");
    } else if (existingImages.value.length > 0) {
      finalImageFileNames = existingImages.value.join(",");
    } else {
      finalImageFileNames = newImageFileNames;
    }

    const updateData = {
      environment_condition: advisorHomeEnvironment.value || null,
      student_behavior: computedStudentBehavior.value,
      family_finance: advisorFamilyFinance.value || null,
      scholarship_need: advisorScholarshipNeed.value || null,
      positive_behavior: advisorPositiveBehavior.value || null,
      problem_solving: advisorProblemSolving.value || null,
      improvement_behavior: advisorImprovementBehavior.value || null,
      suggestion: advisorTeacherSuggestion.value || null,
      parent_feedback: advisorParentOpinion.value || null,
      image: finalImageFileNames || null,
    };

    const res = await axios.patch(
      `http://localhost:7000/teacher/1edit/home_visits/${visitReportId.value}`,
      updateData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Update response:", res.data);
    // แทนที่ alert ด้วยการแสดง success dialog
    successDialog.value = true;
  } catch (error) {
    console.error("Error updating visit report:", error);
    errorMessage.value = "เกิดข้อผิดพลาดในการแก้ไขข้อมูล";
  }
}

// ฟังก์ชันเรียกเมื่อคลิกปุ่มบันทึก (submit)
async function handleSubmit() {
  if (!form.value.validate()) {
    errorMessage.value = "กรุณากรอกข้อมูลให้ครบถ้วน";
    return;
  }
  await updateVisitReport();
}

// เคลียร์ object URL ของไฟล์รูป (ถ้ามี) ก่อนออกจากหน้า
onBeforeUnmount(() => {
  advisorUploadedImages.value.forEach((file) => {
    if (file instanceof File) {
      URL.revokeObjectURL(file);
    }
  });
});

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.v-card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.position-relative {
  position: relative;
}
.position-absolute {
  position: absolute;
}
.top-right {
  top: 0;
  right: 0;
}
</style>
