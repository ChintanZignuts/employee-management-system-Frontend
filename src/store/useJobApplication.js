// store for fetch job data from backend

import axios from "../axiosConfig";
import { defineStore } from "pinia";
import { onMounted } from "vue";
import { ref } from "vue";

export const useJobApplicationStore = defineStore("jobApplication", () => {
  const token = ref(localStorage.getItem("token"));
  const jobApplicationList = ref([]);
  const pagination = ref(null);
  const loading = ref(false);

  const fetchJobApplicationData = async (page = 1) => {
    loading.value = true;
    try {
      const config = {
        params: {
          page: page,
        },
      };
      if (token.value) {
        const response = await axios.get("job_application", config);

        jobApplicationList.value = response.data.data.data;
        pagination.value = response.data.data;
      }
    } catch (error) {
      console.error("Failed to fetch job data:", error);
      toast.error(error.response.data.message);
    }
    loading.value = false;
  };

  onMounted(() => {
    if (token.value) {
      fetchJobApplicationData();
    }
  });

  return {
    jobApplicationList,
    loading,
    pagination,
    fetchJobApplicationData,
  };
});
