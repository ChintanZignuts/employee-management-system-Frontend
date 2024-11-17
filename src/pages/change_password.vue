<script setup>
//imports
import {
  confirmedValidator,
  passwordValidator,
  requiredValidator,
} from "@validators";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import axios from "../axiosConfig";

// Form data for old password, new password, and confirm password
const form = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Data

const formRef = ref("");
const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const isCurrentPasswordVisible = ref(false);

// Function to handle password reset
const handleResetPassword = async () => {
  try {
    const validate = await formRef.value?.validate();
    if (validate.valid) {
      const response = await axios.post("auth/change-password", {
        old_password: form.value.oldPassword,
        password: form.value.newPassword,
        password_confirmation: form.value.confirmPassword,
      });

      toast(response.data.message);
    }
  } catch (error) {
    console.error(error.response.data.massage);
    toast(error.response.data.message);
  }
};
</script>

<template>
  <!-- Password Change Form -->
  <div class="d-flex justify-center">
    <VCol cols="6">
      <VCard title="Change Password">
        <VForm ref="formRef" @submit.prevent="handleResetPassword">
          <VCardText class="pt-0">
            <VRow>
              <VCol cols="12">
                <!-- 👉 current password -->
                <AppTextField
                  v-model="form.oldPassword"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isCurrentPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  :rules="[requiredValidator]"
                  label="Current Password"
                  @click:append-inner="
                    isCurrentPasswordVisible = !isCurrentPasswordVisible
                  "
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
                  :rules="[requiredValidator, passwordValidator]"
                  :append-inner-icon="
                    isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  label="New Password"
                  @click:append-inner="
                    isNewPasswordVisible = !isNewPasswordVisible
                  "
                />
              </VCol>

              <VCol cols="12">
                <!-- 👉 confirm password -->
                <AppTextField
                  v-model="form.confirmPassword"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  :rules="[
                    requiredValidator,
                    confirmedValidator(form.confirmPassword, form.newPassword),
                  ]"
                  label="Confirm New Password"
                  @click:append-inner="
                    isConfirmPasswordVisible = !isConfirmPasswordVisible
                  "
                />
              </VCol>
            </VRow>
          </VCardText>
          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn type="submit"> Save changes </VBtn>

            <VBtn type="reset" color="secondary" variant="tonal"> Reset </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
  </div>
</template>
