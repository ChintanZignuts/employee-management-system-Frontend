<script setup>
import { ref } from 'vue'
import axios from '../axiosConfig'

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const isCurrentPasswordVisible = ref(false)

const handleResetPassword = async () => {
  try {
    const token=localStorage.getItem('token')

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.post('/change-password', {
      old_password: form.value.oldPassword,
      password: form.value.newPassword,
      password_confirmation: form.value.confirmPassword,
    }, config)

    console.log(response.data) // Log the response or handle success

  } catch (error) {
    console.error(error.response.data) // Log the error or handle failure
    // Handle error response, show error message to user, etc.
  }
}
</script>

<template>
  <div class="d-flex justify-center">
    <VCol cols="6">
      <VCard title="Change Password">
        <VForm @submit.prevent="handleResetPassword">
          <VCardText class="pt-0">
            <VRow>
              <VCol cols="12">
                <!-- 👉 current password -->
                <AppTextField
                  v-model="form.oldPassword"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCurrentPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  label="Current Password"
                  @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible"
                />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol cols="12">
                <!-- 👉 new password -->
                <AppTextField
                  v-model="form.newPassword"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  label="New Password"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                />
              </VCol>

              <VCol cols="12">
                <!-- 👉 confirm password -->
                <AppTextField
                  v-model="form.confirmPassword"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  label="Confirm New Password"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>
            </VRow>
          </VCardText>
          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn type="submit">
              Save changes
            </VBtn>

            <VBtn
              type="reset"
              color="secondary"
              variant="tonal"
            >
              Reset
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
  </div>
</template>

