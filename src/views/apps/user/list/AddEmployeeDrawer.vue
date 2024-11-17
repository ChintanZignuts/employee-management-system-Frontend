<script setup>
//drawer form for create and

import { emailValidator, requiredValidator } from "@validators"
import { ref, onMounted } from "vue"
import { PerfectScrollbar } from "vue3-perfect-scrollbar"
import { useCompanyStore } from "../../../../store/useCompany"

//props
const props = defineProps({
  isEmployeeDrawerOpen: {
    type: Boolean,
    required: true,
  },
  employeeData: {
    type: Object,
    default: null,
  },
})

//const
const emit = defineEmits(["update:isEmployeeDrawerOpen", "employeeData"])
const isFormValid = ref(false)
const refForm = ref()
const FirstName = ref("")
const LastName = ref("")
const Email = ref("")
const Address = ref("")
const City = ref("")
const DOB = ref(null)
const Salary = ref(null)
const JoiningDate = ref(null)
const CompanyId = ref(null)
const companyStore = useCompanyStore()

const { companyOptions } = storeToRefs(companyStore)


//function for clear form
const clearForm = () => {
  refForm.value?.reset()
  DOB.value = ""
  JoiningDate.value = ""
  refForm.value?.resetValidation()
}

//function for close drawer
const closeNavigationDrawer = () => {
  emit("update:isEmployeeDrawerOpen", false)
  clearForm()
}

//watcher for set fields from props data
watch(
  () => props.employeeData,
  newValue => {
    if (newValue) {
      FirstName.value = newValue.first_name
      LastName.value = newValue.last_name
      Email.value = newValue.email
      Address.value = newValue.address
      City.value = newValue.city
      DOB.value = newValue.dob
      Salary.value = newValue.salary
      JoiningDate.value = newValue.joining_date
      CompanyId.value = newValue.company_id
    } else {
      clearForm()
    }
  },
)

// function for handle for submission and emit the function
const onSubmit = async () => {
  try {
    let validate = await refForm.value?.validate()

    if (validate.valid) {
      const formData = {
        first_name: FirstName.value,
        last_name: LastName.value,
        email: Email.value,
        address: Address.value,
        city: City.value,
        dob: DOB.value,
        salary: Salary.value,
        joining_date: JoiningDate.value,
      }

      if (!props.employeeData) {
        formData.company_id = CompanyId.value
      }
      emit("employeeData", formData)
      closeNavigationDrawer()
      nextTick(() => {
        clearForm()
      })
    }
  } catch (error) {
    notify("error", "Failed to submit form")
    console.error("Error:", error.message)
  }
}

const handleDrawerModelValueUpdate = val => {
  emit("update:isEmployeeDrawerOpen", val)
}

onMounted(() => {
  companyOptions
})
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isEmployeeDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection
      :title="props.employeeData ? 'Edit Employee' : 'Add Employee'"
      @cancel="closeNavigationDrawer"
    />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- 👉 First name -->
              <VCol cols="12">
                <AppTextField
                  v-model="FirstName"
                  :rules="[requiredValidator]"
                  label="First Name"
                />
              </VCol>
              <!-- 👉 Last name -->
              <VCol cols="12">
                <AppTextField
                  v-model="LastName"
                  :rules="[requiredValidator]"
                  label="Last Name"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12">
                <AppTextField
                  v-model="Email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
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
                  label="date of Birth"
                />
              </VCol>

              <!-- 👉 Salary -->
              <VCol cols="12">
                <AppTextField
                  v-model="Salary"
                  label="Salary"
                  type="number"
                />
              </VCol>

              <!-- 👉 Joining date -->
              <VCol cols="12">
                <AppDateTimePicker
                  v-model="JoiningDate"
                  placeholder="YYYY-MM-DD"
                  :config="{ dateFormat: 'Y-m-d', maxDate: new Date() }"
                  label="Joining Date"
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
                  :disabled="props.employeeData !== null"
                />
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Submit
                </VBtn>
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
