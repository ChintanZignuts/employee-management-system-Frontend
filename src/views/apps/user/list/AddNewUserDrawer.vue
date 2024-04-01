<script setup>
import { emailValidator, requiredValidator, urlValidator } from '@validators'
import { defineProps, nextTick, ref } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  companyData: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:isDrawerOpen', 'userData'])
const statusOptions = ['Active', 'Inactive']
const isFormValid = ref(false)
const refForm = ref()

const CompanyName = ref('')
const CompanyEmail = ref('')
const Website = ref('https://')
const LogoUrl = ref('https://')
const Location = ref('')
const Status = ref('Active')
const AdminFirstName = ref('')
const AdminLastName = ref('')
const AdminEmail = ref('')
const Address = ref('')
const City = ref('')
const DOB = ref('')
const AdminJoiningDate = ref('')
const EmployeeNumber = ref('')



const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)

  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
    
  })
}

watch(() => props.companyData, newValue => {
  if (newValue) {
    // Populate form fields if companyData is not null
    CompanyName.value = newValue.name
    CompanyEmail.value = newValue.company_email
    Website.value = newValue.website || 'https://'
    LogoUrl.value = newValue.logo_url || 'https://'
    Location.value = newValue.location || ''
    Status.value=newValue.status==="A"?'Active':"Inactive"
    AdminFirstName.value = newValue.admin.first_name || ''
    AdminLastName.value = newValue.admin.last_name || ''
    AdminEmail.value = newValue.admin_email || ''
    Address.value = newValue.admin.address || ''
    City.value =newValue.admin.city || ''
    DOB.value =newValue.admin.dob || null
    AdminJoiningDate.value = newValue.company_user[0].joining_date || null
    EmployeeNumber.value = newValue.company_user[0].emp_no || ''

  } 
  else {
    // No company data, reset form
    refForm.value?.reset()

    refForm.value?.resetValidation()
    AdminJoiningDate.value = ''
    DOB.value = ''
  }
})


const onSubmit = () => {
  console.log("hii")
  console.log(refForm.value?.validate().valid)

  refForm.value?.validate().then(({ valid }) => {
    
    if (valid) {
      const formData = {
        name: CompanyName.value,
        company_email: CompanyEmail.value,
        website: Website.value,
        logo_url: LogoUrl.value,
        location: Location.value,
        status: Status.value==='Active'?'A':'I',
        "admin": {
          first_name: AdminFirstName.value,
          last_name: AdminLastName.value,
          email: AdminEmail.value,
          address: Address.value,
          city: City.value,
          dob: DOB.value,
        },
        "company_user": {
          joining_date: AdminJoiningDate.value,
          emp_no: EmployeeNumber.value,
        },
      }

      emit('userData', formData)
      

      emit('update:isDrawerOpen', false)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
      })
    }
  })
}



const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
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
            
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- 👉 Full name -->
              <VCol cols="12">
                <AppTextField
                  v-model="CompanyName"
                  :rules="[requiredValidator]"
                  label="Company Name"
                />
              </VCol>
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
                <AppTextField
                  v-model="LogoUrl"
                  :rules="[urlValidator]"
                  label="Logo URL"
                />
              </VCol>
              <!-- 👉 Location -->
              <VCol cols="12">
                <AppTextField
                  v-model="Location"
                  label="Location"
                />
              </VCol>
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
              <VCol
                v-if="!props.companyData"
                cols="12"
              >
                <AppTextField
                  v-model="AdminEmail"
                  :rules="[requiredValidator, emailValidator]"
                  label="Admin Email"
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
                  
                  :config="{ dateFormat: 'Y-m-d',maxDate: new Date()}"
                  label="
                  date
                  of
                  Birth"
                />
              </VCol>
              <VDivider />
              <VCol cols="12">
                <AppDateTimePicker
                  v-model="AdminJoiningDate"
                  placeholder="YYYY-MM-DD"
                  :config="{ dateFormat: 'Y-m-d',maxDate: new Date()}"
                  label="Admin Joining Date"
                />
              </VCol>
              <!-- 👉 Employee Number -->
              <VCol cols="12">
                <AppTextField
                  v-model="EmployeeNumber"
                  :rules="[requiredValidator]"
                  label="Employee Number"
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
