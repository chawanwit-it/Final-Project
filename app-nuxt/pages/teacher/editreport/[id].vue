<template>
  <v-main class="bg-grey-lighten-3">
    <v-container fluid class="pa-6">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card elevation="3" class="rounded-lg">
            <!-- Header -->
            <v-card-title class="bg-primary py-6 px-6">
              <span class="text-h5 font-weight-bold white--text">
                แก้ไขรายงานการเยี่ยมบ้านนักศึกษา
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

              <!-- Form (ส่วนของข้อมูลรายงาน) -->
              <v-form
                ref="form"
                v-model="isFormValid"
                lazy-validation
                @submit.prevent="handleSubmit"
              >
                <!-- Section: สภาพแวดล้อม -->
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

                <!-- Section: การปฏิบัติตนของนักเรียน -->
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

                <!-- Section: รายได้การใช้จ่าย -->
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

                <!-- Section: ทุนการศึกษา -->
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

                <!-- Section: พฤติกรรมและข้อเสนอแนะ -->
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

                <!-- Section: รูปภาพ (แสดงเฉพาะ) -->
                <v-sheet class="mb-8">
                  <div class="section-header mb-4">
                    <span class="text-h5 font-weight-bold text-primary"> 6. รูปภาพ </span>
                  </div>
                  <!-- แสดงรูปภาพที่รายงานไปแล้ว -->
                  <div v-if="existingImages.length > 0">
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
                  <div v-else class="text-center mt-4">
                    <span>ไม่พบรูปภาพ</span>
                  </div>
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
        <!-- v-dialog สำหรับแสดงข้อความสำเร็จ -->
  <v-dialog v-model="successDialog" persistent max-width="400">
    <v-card>
      <v-card-title class="headline"> ✅สำเร็จ</v-card-title>
      <v-card-text>แก้ไขข้อมูลรายงานการเยี่ยมบ้านสำเร็จ</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="closeSuccessDialog">ตกลง</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  layout: "layoutteacher",
});

const router = useRouter();
const route = useRoute();

// State สำหรับฟอร์ม
const isFormValid = ref(false);
const errorMessage = ref("");

// ฟิลด์รายงาน
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
const advisorStudentBehaviorOptions = [
  "อ่านหนังสือทำการบ้าน",
  "ช่วยงานผู้ปกครอง",
  "ทำงานบ้าน",
  "ไม่ช่วยงานเลย",
];

// สำหรับเก็บรูปภาพที่รายงานไปแล้ว (URL)
const existingImages = ref([]);

// รับ visit report id จาก route params
const visitReportId = ref(route.params.id || null);
if (!visitReportId.value) {
  errorMessage.value = "ไม่พบรหัสรายงานใน URL";
}

// อ้างอิงฟอร์ม
const form = ref(null);

// เพิ่ม state สำหรับ success dialog
const successDialog = ref(false);

// ฟังก์ชันดึงข้อมูลรายงานเดิมจาก API
async function fetchVisitReport() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      errorMessage.value = "ไม่มี token ใน localStorage";
      router.push("/login");
      return;
    }
    const { data } = await axios.get(`http://localhost:7000/teacher/report/${visitReportId.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    advisorHomeEnvironment.value = data.environment_condition || "";
    advisorFamilyFinance.value = data.family_finance || "";
    advisorScholarshipNeed.value = data.scholarship_need || "";
    advisorPositiveBehavior.value = data.positive_behavior || "";
    advisorImprovementBehavior.value = data.improvement_behavior || "";
    advisorProblemSolving.value = data.problem_solving || "";
    advisorParentOpinion.value = data.parent_feedback || "";
    advisorTeacherSuggestion.value = data.suggestion || "";

    if (data.student_behavior) {
      const behaviors = data.student_behavior.split(",").map((item) => item.trim());
      advisorStudentBehavior.value = behaviors;
      advisorStudentBehaviorOther.value = "";
    } else {
      advisorStudentBehavior.value = [];
      advisorStudentBehaviorOther.value = "";
    }

    // ดึงรูปภาพที่รายงานไปแล้ว
    existingImages.value = data.images || [];
  } catch (error) {
    console.error("Error fetching visit report:", error);
    errorMessage.value = "เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน";
  }
}

// ฟังก์ชันอัปเดตรายงาน (รวมทุกฟิลด์ แต่รูปภาพจะไม่ถูกแก้ไข)
async function updateVisitReport() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      errorMessage.value = "ไม่มี token ใน localStorage";
      router.push("/login");
      return;
    }

    // คำนวณค่า student_behavior
    const computedStudentBehavior =
      advisorStudentBehavior.value.length > 0
        ? advisorStudentBehavior.value.join(",")
        : advisorStudentBehaviorOther.value.trim()
        ? advisorStudentBehaviorOther.value
        : null;

    const updateData = {
      environment_condition: advisorHomeEnvironment.value || null,
      student_behavior: computedStudentBehavior,
      family_finance: advisorFamilyFinance.value || null,
      scholarship_need: advisorScholarshipNeed.value || null,
      positive_behavior: advisorPositiveBehavior.value || null,
      problem_solving: advisorProblemSolving.value || null,
      improvement_behavior: advisorImprovementBehavior.value || null,
      suggestion: advisorTeacherSuggestion.value || null,
      parent_feedback: advisorParentOpinion.value || null,
      // ส่ง flag ว่ารายงานแล้ว
      is_reported: true,
    };

    const res = await axios.patch(
      `http://localhost:7000/teacher/1edit/home_visits/${visitReportId.value}`,
      updateData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Update response:", res.data);
    // แสดง success dialog แทน alert
    successDialog.value = true;
  } catch (error) {
    console.error("Error updating visit report:", error);
    errorMessage.value = "เกิดข้อผิดพลาดในการแก้ไขข้อมูล";
  }
}

async function handleSubmit() {
  if (!form.value.validate()) {
    errorMessage.value = "กรุณากรอกข้อมูลให้ครบถ้วน";
    return;
  }
  await updateVisitReport();
}

// ดึงข้อมูลรายงานเมื่อ component ถูก mount
(async () => {
  await fetchVisitReport();
})();
const goBack = () => {
  router.back();
};

// ฟังก์ชันสำหรับปิด success dialog และนำทางกลับหน้า repost
function closeSuccessDialog() {
  successDialog.value = false;
  router.push("/teacher/repost");
}
</script>

<style scoped>
.v-card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
