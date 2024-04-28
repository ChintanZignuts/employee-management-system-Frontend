<script setup>
//drawer form for create and edit job

//imports
import { requiredValidator } from "@validators";
import { ref } from "vue";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { skills } from "../../../../utils/requiredSkills";
import { useCompanyStore } from "../../../../store/useCompany";

//props
const props = defineProps({
  isJobDrawerOpen: {
    type: Boolean,
    required: true,
  },
  jobData: {
    type: Object,
    default: null,
  },
});

//emit functions
const emit = defineEmits(["update:isJobDrawerOpen", "jobData"]);

//const
const friends = ref(["Sandra Adams", "Britta Holt"]);
const isFormValid = ref(false);
const refForm = ref();

//ref for form data
const Title = ref("");
const Description = ref("");
const Salary = ref("");
const EmploymentType = ref("");
const RequiredExperience = ref([0, 0]);
const RequiredSkills = ref([]);
const ExpiryDate = ref(null);
const CompanyId = ref(null);
const companyStore = useCompanyStore();
const EmploymentOptions = [
  { title: "Full-time" },
  { title: "Part-time" },
  { title: "Contract" },
  { title: "Freelance" },
  { title: "Internship" },
  { title: "Remote" },
];

const { companyOptions } = storeToRefs(companyStore);
//function for clear form fields
const clearForm = () => {
  refForm.value?.reset();
  ExpiryDate.value = "";
  RequiredExperience.value = [0, 0];
  refForm.value?.resetValidation();
};

//function for close drawer
const closeNavigationDrawer = () => {
  emit("update:isJobDrawerOpen", false);
  clearForm();
};

// watcher for populate field with latest data send from props
watch(
  () => props.jobData,
  (newValue) => {
    if (newValue) {
      Title.value = newValue.title;
      Description.value = newValue.description;
      Salary.value = newValue.salary;
      EmploymentType.value = newValue.employment_type;
      RequiredExperience.value = newValue.required_experience;
      RequiredSkills.value = newValue.required_skills;
      ExpiryDate.value = newValue.expiry_date;
      CompanyId.value = newValue.company.id;
    } else {
      clearForm();
    }
  }
);

//function for convert selected range value in string
const formatExperience = (value) => {
  const start = value[0];
  const end = value[1];
  return `${start} years to ${end} years`;
};

// function that handle form submission and emit the function with form data
const onSubmit = async () => {
  try {
    let validate = await refForm.value?.validate();

    if (validate.valid) {
      const formData = {
        title: Title.value,
        description: Description.value,
        salary: Salary.value,
        employment_type: EmploymentType.value,
        required_experience: RequiredExperience.value,
        required_skills: RequiredSkills.value,
        expiry_date: ExpiryDate.value,
      };

      if (!props.jobData) {
        formData.company_id = CompanyId.value;
      }
      emit("jobData", formData);
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
  emit("update:isJobDrawerOpen", val);
};
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isJobDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection
      :title="props.jobData ? 'Edit Job' : 'Add Job'"
      @cancel="closeNavigationDrawer"
    />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <!-- 👉 Job Title -->
              <VCol cols="12">
                <AppTextField
                  v-model="Title"
                  :rules="[requiredValidator]"
                  label="Title"
                />
              </VCol>

              <!-- 👉 Job Description -->
              <VCol cols="12">
                <AppTextarea
                  v-model="Description"
                  clearable
                  clear-icon="tabler-circle-x"
                  :rules="[requiredValidator]"
                  label="Description"
                />
              </VCol>

              <!-- 👉 Employment Type -->
              <VCol cols="12">
                <AppAutocomplete
                  v-model="EmploymentType"
                  label="Employment Type"
                  item-title="title"
                  item-value="title"
                  :items="EmploymentOptions"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Salary -->
              <VCol cols="12">
                <AppTextField v-model="Salary" label="Salary" type="number" />
              </VCol>

              <!-- 👉 skills -->
              <VCol cols="12">
                <AppAutocomplete
                  v-model="RequiredSkills"
                  chips
                  closable-chips
                  multiple
                  :items="skills"
                  item-title="skill"
                  item-value="skill"
                  label="Select"
                >
                  <template #chip="{ props, item }">
                    <VChip v-bind="props" :text="item.raw.skill" />
                  </template>

                  <template #item="{ props, item }">
                    <VListItem v-bind="props" :title="item?.raw?.skill" />
                  </template>
                </AppAutocomplete>
              </VCol>

              <!-- 👉 Required Experience -->
              <VCol cols="12">
                <VRangeSlider
                  v-model="RequiredExperience"
                  step="1"
                  max="10"
                  :rules="[requiredValidator]"
                  formatter="formatExperience"
                />
                Required Experience: {{ formatExperience(RequiredExperience) }}
              </VCol>

              <!-- 👉 Expiry Date -->
              <VCol cols="12">
                <AppDateTimePicker
                  v-model="ExpiryDate"
                  placeholder="YYYY-MM-DD"
                  :config="{ dateFormat: 'Y-m-d', minDate: new Date() - 1 }"
                  label="Expiry Date"
                />
              </VCol>

              <!-- 👉 Company Name -->
              <VCol cols="12">
                <AppAutocomplete
                  v-model="CompanyId"
                  label="Company"
                  :items="companyOptions"
                  item-title="name"
                  item-value="id"
                  :rules="[requiredValidator]"
                  :disabled="props.jobData !== null"
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
