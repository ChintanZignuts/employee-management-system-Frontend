<script setup>
//Drawer form for create and edit company with company admin data

//imports
import { emailValidator, requiredValidator, urlValidator } from "@validators";
import { defineProps, nextTick, ref } from "vue";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";

//props
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  companyData: {
    type: Object,
    default: null,
  },
});

// emits
const emit = defineEmits(["update:isDrawerOpen", "userData"]);

//const
const statusOptions = ["Active", "Inactive"];
const isFormValid = ref(false);
const refForm = ref();

//ref for form fields
const CompanyName = ref("");
const CompanyEmail = ref("");
const Website = ref("https://");
const LogoUrl = ref(null);
const Location = ref("");
const Status = ref("Active");
const AdminFirstName = ref("");
const AdminLastName = ref("");
const AdminEmail = ref("");
const Address = ref("");
const City = ref("");
const DOB = ref("");
const AdminJoiningDate = ref("");
const EmployeeNumber = ref("");

//function for clear all field of form
const clearForm = () => {
  // Reset all form data
  refForm.value?.reset();
  Website.value = "https://";
  Status.value = "Active";
  DOB.value = "";
  AdminJoiningDate.value = "";
  LogoUrl.value = null;
  refForm.value?.resetValidation();
};

//function for close navigation
const closeNavigationDrawer = () => {
  emit("update:isDrawerOpen", false);
  refForm.value?.resetValidation();
  nextTick(clearForm);
};

//watcher for set form fields when the change in company data prop
watch(
  () => props.companyData,
  (newValue) => {
    if (newValue) {
      CompanyName.value = newValue.name;
      CompanyEmail.value = newValue.company_email;
      Website.value = newValue.website;
      Location.value = newValue.location;
      Status.value = newValue.status === "A" ? "Active" : "Inactive";
      AdminFirstName.value = newValue.company_admin.first_name;
      AdminLastName.value = newValue.company_admin.last_name;

      AdminEmail.value = newValue.company_admin.email;
      Address.value = newValue.company_admin.address;
      City.value = newValue.company_admin.city;
      DOB.value = newValue.company_admin.dob;
      AdminJoiningDate.value = newValue.company_admin.joining_date;
      EmployeeNumber.value = newValue.company_admin.emp_no;
    } else {
      // No company data, reset form
      refForm.value?.resetValidation();

      clearForm();
    }
  }
);

const onSubmit = async () => {
  try {
    let validation = await refForm.value?.validate();
    console.log(validation);
    if (validation.valid) {
      const formData = new FormData();

      // Append logo to form data if available
      if (LogoUrl.value && LogoUrl.value[0]) {
        formData.append("logo", LogoUrl.value[0]);
      }

      // Append company data to form data
      formData.append("name", CompanyName.value);
      formData.append("company_email", CompanyEmail.value);
      formData.append("website", Website.value);
      formData.append("location", Location.value);
      formData.append("status", Status.value === "Active" ? "A" : "I");

      // Append admin data to form data
      formData.append("admin[first_name]", AdminFirstName.value);
      formData.append("admin[last_name]", AdminLastName.value);
      formData.append("admin[address]", Address.value);
      formData.append("admin[city]", City.value);
      formData.append("admin[dob]", DOB.value);
      formData.append("admin[joining_date]", AdminJoiningDate.value);
      formData.append("admin[emp_no]", EmployeeNumber.value);

      if (!props.companyData) {
        formData.append("admin[email]", AdminEmail.value);
      }

      emit("userData", formData);

      refForm.value?.resetValidation();

      closeNavigationDrawer();

      nextTick(() => {
        clearForm();
      });
    }
  } catch (error) {
    console.error("Error during form validation:", error);
  }
};

const handleDrawerModelValueUpdate = (val) => {
  emit("update:isDrawerOpen", val);
};
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection
      :title="props.companyData ? 'Edit Company' : 'Add Company'"
      @cancel="closeNavigationDrawer"
    />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
            enctype="multipart/form-data"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- 👉 Company name -->
              <VCol cols="12">
                <AppTextField
                  v-model="CompanyName"
                  :rules="[requiredValidator]"
                  label="Company Name"
                />
              </VCol>

              <!-- 👉 Company Email -->
              <VCol cols="12">
                <AppTextField
                  v-model="CompanyEmail"
                  :rules="[requiredValidator, emailValidator]"
                  label="Company Email"
                />
              </VCol>

              <!-- 👉 Website -->
              <VCol cols="12">
                <AppTextField
                  v-model="Website"
                  :rules="[requiredValidator, urlValidator]"
                  label="Website"
                />
              </VCol>

              <!-- 👉 Logo URL -->
              <VCol cols="12">
                <VFileInput
                  v-model="LogoUrl"
                  label="Upload logo"
                  prepend-icon="tabler-camera"
                />
              </VCol>

              <!-- 👉 Location -->
              <VCol cols="12">
                <AppTextField v-model="Location" label="Location" />
              </VCol>

              <!-- 👉 Status -->
              <VCol cols="12">
                <VSelect
                  v-model="Status"
                  :items="statusOptions"
                  :rules="[requiredValidator]"
                  label="Status"
                />
              </VCol>

              <VDivider />

              <!-- 👉 Admin First Name -->
              <VCol cols="12">
                <AppTextField
                  v-model="AdminFirstName"
                  :rules="[requiredValidator]"
                  label="Admin First Name"
                />
              </VCol>

              <!-- 👉 Admin Last Name -->
              <VCol cols="12">
                <AppTextField
                  v-model="AdminLastName"
                  :rules="[requiredValidator]"
                  label="Admin Last Name"
                />
              </VCol>

              <!-- 👉 Admin Email -->
              <VCol cols="12">
                <AppTextField
                  v-model="AdminEmail"
                  label="Admin Email"
                  :rules="[requiredValidator, emailValidator]"
                  :disabled="props.companyData !== null"
                />
              </VCol>

              <!-- 👉 Address -->
              <VCol cols="12">
                <AppTextField
                  v-model="Address"
                  :rules="[requiredValidator]"
                  label="Address"
                />
              </VCol>

              <!-- 👉 City -->
              <VCol cols="12">
                <AppTextField
                  v-model="City"
                  :rules="[requiredValidator]"
                  label="City"
                />
              </VCol>

              <!-- 👉 Date of Birth -->
              <VCol cols="12">
                <AppDateTimePicker
                  v-model="DOB"
                  placeholder="YYYY-MM-DD"
                  :config="{ dateFormat: 'Y-m-d', maxDate: new Date() }"
                  label="
                date
                of
                Birth"
                />
              </VCol>

              <VDivider />

              <!-- 👉 Admin Joining Date -->
              <VCol cols="12">
                <AppDateTimePicker
                  v-model="AdminJoiningDate"
                  placeholder="YYYY-MM-DD"
                  :config="{ dateFormat: 'Y-m-d', maxDate: new Date() }"
                  label="Admin Joining Date"
                />
              </VCol>

              <!-- 👉 Employee Number (just for display)-->
              <VCol v-if="props.companyData !== null" cols="12">
                <AppTextField
                  v-model="EmployeeNumber"
                  label="Employee Number"
                  disabled
                />
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3"> Submit </VBtn>
                <VBtn
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
