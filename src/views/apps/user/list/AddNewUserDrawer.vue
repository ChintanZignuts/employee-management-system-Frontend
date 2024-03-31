<script setup>
import { requiredValidator } from '@validators'
import { defineEmits, defineProps, nextTick, ref } from 'vue'
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

const isFormValid = ref(false)
const refForm = ref()

const CompanyName = ref('')
const CompanyEmail = ref('')
const Website = ref('')
const LogoUrl = ref('')
const Location = ref('')
const AdminFirstName = ref('')
const AdminLastName = ref('')
const AdminEmail = ref('')

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)

  nextTick(() => {
    // refForm.value?.reset()
    // refForm.value?.resetValidation()
    
  })
}

watch(() => props.companyData, newValue => {
  if (newValue) {
    // Populate form fields if companyData is not null
    CompanyName.value = newValue.name
    CompanyEmail.value = newValue.company_email
    Website.value = newValue.website || ''
    LogoUrl.value = newValue.logo_url || ''
    Location.value = newValue.location || ''
    AdminFirstName.value = newValue.admin_first_name || ''
    AdminLastName.value = newValue.admin_last_name || ''
    AdminEmail.value = newValue.admin_email || ''
    
  } 
  else {
    // No company data, reset form
    refForm.value?.reset()
    refForm.value?.resetValidation()
    
  }
})


const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('userData', {
        name: CompanyName.value,
        company_email: CompanyEmail.value,
        website: Website.value,
        logo_url: LogoUrl.value,
        location: Location.value,
        admin_first_name: AdminFirstName.value,
        admin_last_name: AdminLastName.value,
        admin_email: AdminEmail.value,
      })
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
                  :rules="[requiredValidator]"
                  label="Company Email"
                />
              </VCol>

              <!-- 👉 Website -->
              <VCol cols="12">
                <AppTextField
                  v-model="Website"
                  label="Website"
                />
              </VCol>
              <!-- 👉 Logo URL -->
              <VCol cols="12">
                <AppTextField
                  v-model="LogoUrl"
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
              <!-- 👉 Admin First Name -->
              <VCol cols="12">
                <AppTextField
                  v-model="AdminFirstName"
                  label="Admin First Name"
                />
              </VCol>
              <!-- 👉 Admin Last Name -->
              <VCol cols="12">
                <AppTextField
                  v-model="AdminLastName"
                  label="Admin Last Name"
                />
              </VCol>
              <!-- 👉 Admin Email -->
              <VCol cols="12">
                <AppTextField
                  v-model="AdminEmail"
                  label="Admin Email"
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
