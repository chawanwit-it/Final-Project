<template>
  <v-card class="pa-4" style="height: 400px">
    <Bar v-if="chartDataReady" :data="chartData" :options="chartOptions" />
    <div v-else class="text-center text-grey">❗ กำลังโหลดข้อมูล...</div>
  </v-card>
</template>

<script setup>
import { computed, watch, ref } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// ลงทะเบียนองค์ประกอบของ Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// รับ prop `overviewCards`
const props = defineProps({
  overviewCards: {
    type: Array,
    default: () => [],
  },
});

// ตัวแปรตรวจสอบว่าข้อมูลพร้อมหรือไม่
const chartDataReady = ref(false);

// ใช้ computed property เพื่อสร้าง `chartData`
const chartData = computed(() => {
  if (!props.overviewCards || props.overviewCards.length === 0) {
    chartDataReady.value = false;
    return { labels: [], datasets: [] };
  }

  chartDataReady.value = true;
  console.log("📊 โหลดข้อมูลสำเร็จ:", props.overviewCards);

  return {
    labels: props.overviewCards.map((card) => card.title),
    datasets: [
      {
        label: "จำนวนคน",
        data: props.overviewCards.map((card) => card.value),
        backgroundColor: props.overviewCards.map((card) =>
          convertVuetifyColor(card.color)
        ),
        borderWidth: 1,
      },
    ],
  };
});

// ตั้งค่า options ของกราฟ
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true },
  },
  plugins: {
    legend: { display: false },
  },
};

// ใช้ watch เพื่อตรวจสอบ prop `overviewCards`
watch(
  () => props.overviewCards,
  (newValue) => {
    console.log("📊 อัปเดตข้อมูลกราฟ:", newValue);
    chartDataReady.value = newValue.length > 0;
  },
  { deep: true }
);

// ฟังก์ชันแปลงชื่อสี Vuetify เป็น HEX
const colorMapping = {
  "deep-purple accent-4": "#6200EA",
  "teal darken-1": "#00796B",
  "orange darken-2": "#F57C00",
  "red accent-3": "#D50000",
};

function convertVuetifyColor(vuetifyColor) {
  return colorMapping[vuetifyColor] || vuetifyColor;
}
</script>

<style scoped>
/* ปรับแต่งสไตล์เพิ่มเติม */
</style>
