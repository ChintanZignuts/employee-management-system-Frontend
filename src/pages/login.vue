<script setup>

//Imports
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import authV2LoginIllustrationBorderedDark from "@images/pages/auth-v2-login-illustration-bordered-dark.png";
import authV2LoginIllustrationBorderedLight from "@images/pages/auth-v2-login-illustration-bordered-light.png";
import authV2LoginIllustrationDark from "@images/pages/auth-v2-login-illustration-dark.png";
import authV2LoginIllustrationLight from "@images/pages/auth-v2-login-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { emailValidator, requiredValidator } from "@validators";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { VForm } from "vuetify/components/VForm";
import axios from "../axiosConfig";

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);

const router = useRouter();
const isPasswordVisible = ref(false);
const refVForm = ref();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleSubmit = async () => {
  try {
    const validate = await refVForm.value.validate();

    if (!validate.valid) return;

    const payload = {
      email: email.value,
      password: password.value,
    };

    const response = await axios.post("auth/login", payload);

    if (
      response.data.data.user.type === "SA" ||
      response.data.data.user.type === "CA"
    ) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("type", response.data.data.user.type);

      router.push("/");
      toast.success(response.data.data.message);
    } else {
      errorMessage.value =
        "currently only super admin and company admin login to this page other functionality in progress...🙂  ";
    }
  } catch (error) {
    console.log("error", error.response.data.message);
    console.error("API call failed:", error);
    errorMessage.value = error.response.data.message;
    toast.error(error.response.data.message);
  }
};
</script>

<template>
  <div>
    <VRow no-gutters class="auth-wrapper bg-surface">
      <VCol lg="8" class="d-none d-lg-flex">
        <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
          <div class="d-flex align-center justify-center w-100 h-100">
            <VImg
              max-width="505"
              :src="authThemeImg"
              class="auth-illustration mt-16 mb-2"
            />
          </div>

          <VImg :src="authThemeMask" class="auth-footer-mask" />
        </div>
      </VCol>

      <VCol
        cols="12"
        lg="4"
        class="auth-card-v2 d-flex align-center justify-center"
      >
        <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
          <VCardText>
            <VNodeRenderer :nodes="themeConfig.app.logo" class="mb-6" />

            <h5 class="text-h5 mb-1">
              Welcome to
              <span class="text-capitalize"> {{ themeConfig.app.title }} </span
              >! 👋🏻
            </h5>

            <p class="mb-0">
              Please sign-in to your account and start the adventure
            </p>

            <VAlert
              v-show="errorMessage"
              color="primary"
              variant="tonal"
              dismissible
            >
              <p class="text-caption mb-2">
                {{ errorMessage }}
              </p>
            </VAlert>
          </VCardText>

          <VCardText>
            <VForm ref="refVForm" @submit.prevent="handleSubmit">
              <VRow>
                <!-- email -->
                <VCol cols="12">
                  <AppTextField
                    v-model="email"
                    label="Email"
                    type="email"
                    :rules="[requiredValidator, emailValidator]"
                    autofocus
                    required
                  />
                </VCol>

                <!-- password -->
                <VCol cols="12">
                  <AppTextField
                    v-model="password"
                    label="Password"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="
                      isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                    "
                    :rules="[requiredValidator]"
                    required
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />

                  <div
                    class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4"
                  >
                    <RouterLink
                      class="text-primary ms-2 mb-1"
                      :to="{ name: 'forgot-password' }"
                    >
                      Forgot Password?
                    </RouterLink>
                  </div>

                  <VBtn block type="submit"> Login </VBtn>
                </VCol>

                <!-- create account -->

                <!--
                  <VCol
                  cols="12"
                  class="d-flex align-center"
                  >
                  <VDivider />
  
                  <span class="mx-4">or</span>
  
                  <VDivider />
                  </VCol>
                -->
                <!-- auth providers -->
                <!--
                  <VCol
                  cols="12"
                  class="text-center"
                  >
                  <AuthProvider />
                  </VCol>
                -->
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
