<template>
  <v-main class="mt-n10">
    <v-container>
      <section>
        <h3
          class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold"
        >
          จัดการภาคเรียน

          <!-- ปุ่มเพิ่มภาคเรียน -->
          <v-btn
            class="text-none"
            color="primary"
            prepend-icon="mdi-plus"
            rounded="lg"
            slim
            text="เพิ่มภาคเรียน"
            variant="flat"
            @click="openDialog"
          />
        </h3>

        <div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
          เพิ่มภาคเรียนที่จะให้ครูทำการออกเยี่ยมบ้านนักเรียน/นักศึกษา
        </div>

        <!-- ตารางแสดงภาคเรียน -->
        <v-data-table
          v-if="items.length > 0"
          class="bg-transparent"
          :headers="headers"
          hide-default-footer
          :items="items"
        >
          <template #item.actions="{ item }">
            <v-btn
              :href="item.id ? `/officer/semestersRepost/${item.id}` : '#'"
              class="text-none"
              color="primary"
              style="min-width: 0"
              rounded="xl"
              slim
              variant="flat"
            >
              ดูข้อมูลรายงาน
            </v-btn>
          </template>
        </v-data-table>

        <!-- ถ้าไม่มีข้อมูลแสดงข้อความ -->
        <div v-else>
          <p>ไม่มีข้อมูลภาคเรียนในระบบ</p>
        </div>
      </section>
    </v-container>

    <!-- Dialog สำหรับเพิ่มภาคเรียน -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">เพิ่มภาคเรียน</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="newSemester.name"
              label="เช่น ภาคเรียนที่ 1 ปีการศึกษา 2567"
              required
            />
            <v-text-field
              v-model="newSemester.start_date"
              label="วันที่เริ่มต้น"
              type="date"
              required
            />
            <v-text-field
              v-model="newSemester.end_date"
              label="วันที่สิ้นสุด"
              type="date"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" text @click="saveSemester">สร้าง</v-btn>
          <v-btn color="red" text @click="closeDialog">ยกเลิก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog สำหรับแสดงผลลัพธ์การเพิ่มภาคเรียน -->
    <v-dialog v-model="resultDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ resultDialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <span>{{ resultDialogMessage }}</span>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" text @click="closeResultDialog">ปิด</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

definePageMeta({
  layout: "layoutofficer",
});

// ตัวแปร reactive
const dialog = ref(false);
const resultDialog = ref(false);
const resultDialogTitle = ref("");
const resultDialogMessage = ref("");
const valid = ref(false);

// ฟอร์มสำหรับเพิ่มภาคเรียน
const newSemester = ref({
  name: "",
  start_date: "",
  end_date: "",
});

// ข้อมูลภาคเรียน
const items = ref([]);

// กำหนด headers ของตาราง
const headers = [
  { title: "ชื่อภาคเรียน", key: "name" },
  { title: "วันที่เริ่มต้น", key: "start_date" },
  { title: "วันที่สิ้นสุด", key: "end_date" },
  { title: "", key: "actions" },
];

// ฟังก์ชันเปิด Dialog
const openDialog = () => {
  dialog.value = true;
};

// ฟังก์ชันปิด Dialog พร้อมรีเซ็ตฟอร์ม
const closeDialog = () => {
  dialog.value = false;
  resetForm();
};

// รีเซ็ตฟอร์ม
const resetForm = () => {
  newSemester.value = {
    name: "",
    start_date: "",
    end_date: "",
  };
};

// ดึงข้อมูลภาคเรียนจาก API
const getSemesters = async () => {
  try {
    const response = await axios.get("http://localhost:7000/officer/getAll");
    items.value = response.data; // สมมติว่า API ส่งข้อมูลในรูปแบบ array
    console.log("Loaded items:", JSON.stringify(items.value, null, 2));
  } catch (error) {
    console.error(error);
    alert("เกิดข้อผิดพลาดในการดึงข้อมูลภาคเรียน");
  }
};

// ฟังก์ชันสำหรับบันทึกภาคเรียน
const saveSemester = async () => {
  if (valid.value) {
    try {
      // ส่งข้อมูลไปยัง API
      const response = await axios.post("http://localhost:7000/officer/add", {
        name: newSemester.value.name,
        start_date: newSemester.value.start_date,
        end_date: newSemester.value.end_date,
      });

      // อัปเดตข้อมูลภาคเรียนในตาราง (คุณอาจต้องการรับ id จาก response ด้วย)
      items.value.push({
        ...newSemester.value,
        status: "Active",
        // เพิ่ม field id หากมีการส่งกลับจาก API
      });

      // แสดงผลลัพธ์หลังการเพิ่มภาคเรียน
      resultDialogTitle.value = "สำเร็จ";
      resultDialogMessage.value = "เพิ่มภาคเรียนสำเร็จ";
      resultDialog.value = true;

      // ปิด dialog และรีเซ็ตฟอร์ม
      closeDialog();
    } catch (error) {
      console.error(error);
      resultDialogTitle.value = "เกิดข้อผิดพลาด";
      resultDialogMessage.value = "เกิดข้อผิดพลาดในการเพิ่มภาคเรียน";
      resultDialog.value = true;
    }
  }
};

// ฟังก์ชันปิด Dialog ผลลัพธ์
const closeResultDialog = () => {
  resultDialog.value = false;
};

// ดึงข้อมูลภาคเรียนเมื่อ component ถูก mount
onMounted(() => {
  getSemesters();
});
</script>

<style scoped>
/* สไตล์เพิ่มเติมหากต้องการ */
</style>
