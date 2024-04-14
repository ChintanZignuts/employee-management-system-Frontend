<script setup>
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import authV2ResetPasswordIllustrationDark from "@images/pages/auth-v2-reset-password-illustration-dark.png";
import authV2ResetPasswordIllustrationLight from "@images/pages/auth-v2-reset-password-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import {
  confirmedValidator,
  passwordValidator,
  requiredValidator,
} from "@validators";
import axios from "../../axiosConfig";
import { toast } from "vue3-toastify";

const form = ref({
  newPassword: "",
  confirmPassword: "",
});

const formRef = ref("");

const route = useRoute();
const router = useRouter();
const authThemeImg = useGenerateImageVariant(
  authV2ResetPasswordIllustrationLight,
  authV2ResetPasswordIllustrationDark
);
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);
const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const token = route.params.token;

const handleResetPassword = async () => {
  try {
    console.log("hii");
    const validate = await formRef.value?.validate();
    console.log(validate.valid);
    if (validate.valid) {
      const data = {
        token: token,
        password: form.value.newPassword,
        password_confirmation: form.value.confirmPassword,
      };

      console.log(form);

      const response = await axios.post("/reset-password", data);

      if (response.status === 200) {
        toast.success("password changed successfully");
        router.push("/login");
      }
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    console.log(error.response.data.status);
    if (error.response.data.status == 401) {
      toast.error("invalid token");
      router.push("/forgot-password");
    }
  }
};
</script>

<template>
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="400"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg class="auth-footer-mask" :src="authThemeMask" />
      </div>
    </VCol>

    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <VNodeRenderer :nodes="themeConfig.app.logo" class="mb-6" />

          <h5 class="text-h5 mb-1">Reset Password 🔒</h5>
          {{ form.newPassword }}
        </VCardText>

        <VCardText>
          <VForm ref="formRef" @submit.prevent="handleResetPassword">
            <VRow>
              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.newPassword"
                  label="New Password"
                  :rules="[requiredValidator, passwordValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <!-- Confirm Password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.confirmPassword"
                  label="Confirm Password"
                  :rules="[
                    requiredValidator,
                    confirmedValidator(form.newPassword, form.confirmPassword),
                  ]"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="
                    isConfirmPasswordVisible = !isConfirmPasswordVisible
                  "
                />
              </VCol>

              <!-- Set password -->
              <VCol cols="12">
                <VBtn block type="submit"> Set New Password </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink
                  class="d-flex align-center justify-center"
                  to="/login"
                >
                  <VIcon icon="tabler-chevron-left" class="flip-in-rtl" />
                  <span>Back to login</span>
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
