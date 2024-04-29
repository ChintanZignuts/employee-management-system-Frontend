<script setup>
//drawer form for create and edit job

//imports
import AppTextarea from "@/@core/components/app-form-elements/AppTextarea.vue";
import { requiredValidator } from "@validators";
import { ref } from "vue";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";

//props
const props = defineProps({
  isJobApplicationDrawerOpen: {
    type: Boolean,
    required: true,
  },
  jobApplicationData: {
    type: Object,
    default: null,
  },
});

const StatusOptions = [
  { title: "Pending", value: "P" },
  { title: "Approve", value: "A" },
  { title: "Reject", value: "R" },
];
//emit functions
const emit = defineEmits([
  "update:isJobApplicationDrawerOpen",
  "jobApplicationData",
]);

const isFormValid = ref(false);
const refForm = ref();

//ref for form data

const Resume = ref(null);
const CoverLatter = ref(null);
const Status = ref(null);
const ApplicantName = ref(null);
const JobTitle = ref(null);

//function for clear form fields
const clearForm = () => {
  refForm.value?.reset();
  refForm.value?.resetValidation();
};

//function for close drawer
const closeNavigationDrawer = () => {
  emit("update:isJobApplicationDrawerOpen", false);
  clearForm();
};

// watcher for populate field with latest data send from props
watch(
  () => props.jobApplicationData,
  (newValue) => {
    if (newValue) {
      CoverLatter.value = newValue.cover_letter;
      Status.value = newValue.status;
      ApplicantName.value = `${newValue.user.first_name} ${newValue.user.last_name}`;
      JobTitle.value = newValue.job.title;
    } else {
      clearForm();
    }
  }
);

// function that handle form submission and emit the function with form data
const onSubmit = async () => {
  try {
    let validate = await refForm.value?.validate();

    if (validate.valid) {
      const formData = {
        resume: Resume.value,
        cover_latter: CoverLatter.value,
        status: Status.value,
      };

      emit("jobApplicationData", formData);
      closeNavigationDrawer();
      nextTick(() => {
        clearForm();
      });
    }
  } catch (error) {
    notify("error", "Failed to submit form");
    console.error("Error:", error.message);
  }
};

const handleDrawerModelValueUpdate = (val) => {
  emit("update:isJobApplicationDrawerOpen", val);
};
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isJobApplicationDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection
      title="Edit Job Application"
      @cancel="closeNavigationDrawer"
    />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <!-- 👉 Job Title -->
              <VCol cols="12">
                <VTextField
                  v-model="ApplicantName"
                  density="compact"
                  disabled
                  label="Applicant Name"
                />
              </VCol>
              <VCol cols="12">
                <VTextField v-model="JobTitle" disabled label="Job Title" />
              </VCol>

              <!-- 👉 Job Description -->
              <VCol cols="12">
                <AppTextarea
                  v-model="CoverLatter"
                  clearable
                  clear-icon="tabler-circle-x"
                  :rules="[requiredValidator]"
                  label="Cover Latter"
                  disabled
                />
              </VCol>

              <!-- 👉 Employment Type -->
              <VCol cols="12">
                <AppAutocomplete
                  v-model="Status"
                  label="Employment Type"
                  item-title="title"
                  item-value="value"
                  :items="StatusOptions"
                  :rules="[requiredValidator]"
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
