<template>
    <v-main class="mt-n16">
        <v-container class="pa-6 pa-md-12" fluid>
            <p class="font-weight-bold text-h4 text-center">
                เพิ่มข้อมูล โปรไฟล์
            </p>
            <p class="mt-2 text-subtitle-1 text-medium-emphasis mb-8 text-center">
                
            </p>
            <v-responsive v-model="form" class="mx-auto" max-width="600">
                <v-row :no-gutters="$vuetify.display.xs" class="mt-2">
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="firstName" color="primary" density="compact"
                            :error-messages="errorMessages" label="First Name" placeholder="John" required
                            :rules="[() => !!firstName || 'This field is required']" variant="outlined" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="lastName" color="primary" density="compact"
                            :error-messages="errorMessages" label="Last Name" placeholder="Doe" required
                            :rules="[() => !!lastName || 'This field is required']" variant="outlined" />
                    </v-col>
                </v-row>

                <!-- <v-text-field v-model="company" color="primary" density="compact" :error-messages="errorMessages"
                    label="Company" placeholder="Vuetify, LLC" variant="outlined" /> -->

                <v-text-field v-model="email" color="primary" density="compact" label="Email"
                    placeholder="johndeo@gmail.com" :rules="[() => !!email || 'This field is required']"
                    variant="outlined" />

                <v-text-field v-model="phoneNumber" color="primary" density="compact" label="Phone Number"
                    placeholder="+1 (555) 905-4625" variant="outlined" />

                <v-textarea v-model="message" color="primary" density="compact" label="Message" variant="outlined" />

                <v-btn class="text-none" color="primary" size="x-large" variant="flat" width="100%">
                   บันทึก
                </v-btn>
            </v-responsive>
        </v-container>
    </v-main>
</template>

<script>
export default {
    name: "ContactSales",
    data() {
        return {
            form: false,
            errorMessages: "",
            firstName: null,
            lastName: null,
            company: null,
            email: null,
            phoneNumber: null,
            message: null,
            agreement: false,
        };
    },
};
</script>

<style scoped>
/* คุณสามารถปรับสไตล์เพิ่มเติมได้ตามต้องการ */
</style>