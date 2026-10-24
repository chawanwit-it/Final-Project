<template>
  <v-container fluid class="pa-md-12">
    <!-- แสดงชื่อภาคเรียน -->
    <h3
      class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold"
    >
      ดูรายงานการเยี่ยมบ้านนักเรียน/นักศึกษา

      <!-- v-select สำหรับคัดกรองตามห้อง -->
      <v-select
        v-model="selectedRoom"
        :items="rooms"
        label="เลือกกลุ่ม/ห้อง"
        clearable
        density="compact"
        class="ml-4"
        variant="outlined"
        style="max-width: 200px"
      />
    </h3>

    <div class="d-flex align-center text-body-2 text-medium-emphasis mb-4 w-100 w-md-100">
  <span>{{ semesterName }}</span>
  <v-btn v-if="selected.length > 0" @click="goToPrintReports" class="ml-auto" color="primary" >
    เลือกรายการพิมพ์ <span class="mdi mdi-receipt-text-check"></span>
  </v-btn>
</div>



    <!-- ตาราง -->
    <v-data-table
      v-if="filteredHomeVisits.length > 0"
      v-model="selected"
      :headers="headers"
      :items="filteredHomeVisits"
      item-value="visit_id"
      items-per-page="5"
      return-object
      show-select
    >
      <template #item.actions="data">
        <v-btn
          :to="data.item.visit_id ? '/officer/print/' + data.item.visit_id : '#'"
          class="text-none"
          color="primary"
          dense
          small
          variant="text"
        >
          พิมพ์รายงาน
        </v-btn>
      </template>
    </v-data-table>

    <div v-else>
      <p>ไม่มีข้อมูลการเยี่ยมบ้านในภาคเรียนนี้</p>
    </div>

        <!-- ปุ่มกลับที่ด้านล่างซ้าย -->
        <div class="d-flex justify-start mt-8">
          <nuxt-link href="/officer">
      <v-btn color="grey">
        <span class="mdi mdi-arrow-left"></span> กลับ
      </v-btn>
    </nuxt-link>
    </div>

  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useAsyncData } from "#imports";

definePageMeta({
  layout: "layoutofficer",
});

const selected = ref([]);
const route = useRoute();
const router = useRouter(); // เพิ่มบรรทัดนี้เพื่อเข้าถึง router

// ตรวจสอบค่าที่ได้จาก param
console.log("Route params:", route.params);

const selectedRoom = ref(null);
const rooms = ["Ag", "Aw", "Bg", "Bw", "Cg", "Cw", "D1", "D5", "E1", "E5"];

const headers = [
  { title: "ชื่อ-นามสกุลนักเรียน/นักศึกษา", value: "student_name" },
  { title: "กลุ่มห้อง", value: "student_room" },
  { title: "ครูที่ปรึกษา", value: "teacher_name" },
  { title: "", value: "actions", sortable: false },
];

// ทำเป็น computed เพื่อ watch ได้ง่าย
const semesterId = computed(() => route.params.id);

// ดึงข้อมูลด้วย useAsyncData
const { data: homeVisitsData, refresh } = await useAsyncData(
  "homeVisits",
  async () => {
    if (!semesterId.value) {
      console.log("No semesterId, return empty");
      return { visits: [], semesterName: "" };
    }
    console.log("Fetching data for semesterId:", semesterId.value);

    // เรียก API ด้วย $fetch (หรือ axios ก็ได้ แต่ $fetch เหมาะกับ Nuxt)
    const data = await $fetch(`http://localhost:7000/officer/home_visits/${semesterId.value}`);

    return {
      visits: data,
      semesterName: data.length > 0 ? data[0].semester_name : "",
    };
  },
  {
    watch: [semesterId],
    immediate: true,
  }
);

// computed properties
const homeVisits = computed(() => homeVisitsData.value?.visits || []);
const semesterName = computed(() => homeVisitsData.value?.semesterName || "");

// Filter ตาม selectedRoom
const filteredHomeVisits = computed(() => {
  if (!selectedRoom.value) return homeVisits.value;
  return homeVisits.value.filter((visit) => visit.student_room === selectedRoom.value);
});


function goToPrintReports() {
  // ส่งเฉพาะ visit_id ของรายการที่เลือก
  const selectedIds = selected.value.map(item => item.visit_id);
  router.push({ path: '/officer/prints', query: { ids: JSON.stringify(selectedIds) } });
}


const goBack = () => {
  router.back();
};


// ฟังก์ชัน refresh manual
const refreshData = async () => {
  await refresh();
};
</script>


<style scoped>
.v-data-table {
  font-size: 16px;
}
</style>

<style scoped>
.v-data-table {
  font-size: 16px;
}
</style>

<style scoped>
.v-data-table {
  font-size: 16px;
}
</style>
