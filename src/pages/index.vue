<script setup>
// dashboard page

import { computed, onMounted, ref } from "vue";
import { toast } from "vue3-toastify";
import axios from "../axiosConfig";

const userData = ref(null);
const isLoading = ref(false);
const error = ref(null);

const fetchData = async () => {
  try {
    const token = localStorage.getItem("token");

    // Check if token is available
    if (!token) {
      throw new Error("No token available");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    isLoading.value = true;

    const response = await axios.get("/stats", config);

    userData.value = response.data.data;
  } catch (err) {
    error.value = error.response.data.message;
    toast.error(error.response.data.message);
  } finally {
    isLoading.value = false;
  }
};

const userListMeta = computed(() => {
  return [
    {
      icon: "tabler-user",
      color: "primary",
      title: "Users",
      stats: userData.value ? userData.value.user_count : "N/A",
      subtitle: "Total Users on over platform",
      route: "/",
    },
    {
      icon: "tabler-users-group",
      color: "error",
      title: "Total employee",
      stats: userData.value ? userData.value.employee_count : "N/A",
      subtitle: "Company employee and Company Admin",
      route: "/employee",
    },
    {
      icon: "tabler-building-estate",
      color: "success",
      title: "Total company",
      stats: userData.value ? userData.value.company_count : "N/A",
      subtitle: "Number of Company Associated with Us",
      route: "/company",
    },
    {
      icon: "tabler-briefcase",
      color: "warning",
      title: "Total available Job",
      stats: userData.value ? userData.value.job_count : "N/A",
      subtitle: "Number of job opening currently active",
      route: "/jobs",
    },
  ];
});

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div>
    <VRow>
      <VCol
        v-for="meta in userListMeta"
        :key="meta.title"
        cols="12"
        sm="6"
        lg="3"
      >
        <RouterLink :to="meta.route">
        <VCard class="h-100">
          <VCardText class="d-flex justify-space-between">
            <div>
              <span>{{ meta.title }}</span>
              <div class="d-flex align-center gap-2 my-1">
                <h6 class="text-h4">
                  {{ meta.stats }}
                </h6>
              </div>
              <span>{{ meta.subtitle }}</span>
            </div>

            <VAvatar
              rounded
              variant="tonal"
              :color="meta.color"
              :icon="meta.icon"
            />
          </VCardText>
        </VCard>
        </RouterLink>
      </VCol>
    </VRow>
  </div>
</template>
