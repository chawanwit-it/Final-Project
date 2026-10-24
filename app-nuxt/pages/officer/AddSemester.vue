<template>
    <v-main class="bg-grey-lighten-2">
        <v-container class="pa-md-12">
            <section>
                <!-- หัวข้อและปุ่มควบคุม -->
                <div class="d-flex flex-column flex-md-row justify-space-between align-center mb-4">
                    <h3 class="text-subtitle-4 text-center font-weight-bold mb-2 mb-md-0">
                        ภาคเรียนที่ออกเยี่ยมบ้าน
                    </h3>
                    <div class="d-flex flex-wrap">
                        <v-btn class="mr-2 mb-2" color="primary" prepend-icon="mdi-plus" rounded="lg" slim
                            variant="flat" @click="addSemester">
                            เพิ่มภาคเรียนที่ออกเยี่ยมบ้าน
                        </v-btn>
                        <v-btn class="mr-2 mb-2" color="info" rounded="lg" slim variant="flat"
                            @click="viewHomeVisitData">
                            ดูข้อมูลการเยี่ยมบ้าน
                        </v-btn>
                        <v-btn class="mb-2" color="success" rounded="lg" slim variant="flat" @click="printReport">
                            พิมพ์รายงาน
                        </v-btn>
                    </div>
                </div>

                <div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
                    A list of all the promotions that are currently running.
                </div>

                <!-- ตารางข้อมูล พร้อม checkbox สำหรับเลือกแต่ละแถว และเลือกทั้งหมดในหัวตาราง -->
                <v-data-table class="bg-transparent" :headers="headers" :items="items" hide-default-footer show-select
                    item-key="id" v-model:selection="selectedItems">
                    <template #item.actions="{ item }">
                        <v-btn class="text-none" color="primary" min-width="0" slim variant="text"
                            @click="editItem(item)">
                            Edit
                        </v-btn>
                    </template>
                </v-data-table>
            </section>
        </v-container>
    </v-main>
</template>

<script setup>
definePageMeta({
  layout: 'layoutofficer',
});
</script>

<script>
export default {
    name: 'HomeVisitTable',
    data() {
        return {
            // กำหนดหัวตารางของ v-data-table
            headers: [
                { title: 'Title', key: 'title' },
                { title: 'Description', key: 'description' },
                { title: 'Status', key: 'status' },
                { title: 'Start', key: 'start' },
                { title: 'End', key: 'end' },
                { title: '', key: 'actions' },
            ],
            // รายการข้อมูลตัวอย่าง (เพิ่ม field id เพื่อเป็น key ที่ไม่ซ้ำกัน)
            items: [
                {
                    id: 1,
                    title: '20% off all products',
                    description: 'Get 20% off all products in the store.',
                    status: 'Active',
                    start: '2021-08-01',
                    end: '2021-08-31',
                },
                {
                    id: 2,
                    title: 'Free shipping on orders over $50',
                    description: 'Get free shipping on all orders over $50.',
                    status: 'Active',
                    start: '2021-08-01',
                    end: '2021-08-31',
                },
                {
                    id: 3,
                    title: 'Buy one get one free',
                    description: 'Buy one product and get another one for free.',
                    status: 'Inactive',
                    start: '2021-08-01',
                    end: '2021-08-31',
                },
                {
                    id: 4,
                    title: '10% off all products',
                    description: 'Get 10% off all products in the store.',
                    status: 'Active',
                    start: '2021-08-01',
                    end: '2021-08-31',
                },
                {
                    id: 5,
                    title: 'Buy one get one free (Second)',
                    description: 'Buy one product and get another one for free.',
                    status: 'Inactive',
                    start: '2021-08-01',
                    end: '2021-08-31',
                },
                {
                    id: 6,
                    title: '10% off all products (Second)',
                    description: 'Get 10% off all products in the store.',
                    status: 'Active',
                    start: '2021-08-01',
                    end: '2021-08-31',
                },
            ],
            // ตัวแปรสำหรับเก็บรายการที่ถูกเลือก
            selectedItems: [],
        };
    },
    watch: {
        selectedItems(newVal) {
            console.log('Selected Items:', newVal);
        },
    },
    methods: {
        addSemester() {
            console.log('เพิ่มภาคเรียนที่ออกเยี่ยมบ้าน');
        },
        viewHomeVisitData() {
            console.log('ดูข้อมูลการเยี่ยมบ้าน');
        },
        printReport() {
            console.log('พิมพ์รายงาน');
        },
        editItem(item) {
            console.log('แก้ไขรายการ:', item);
        },
    },
};
</script>