// store for fetch job data from backend

import axios from "../axiosConfig";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useJobStore = defineStore("job", () => {
  const token = ref(localStorage.getItem("token"));
  const jobList = ref([]);
  const pagination = ref(null);
  const loading = ref(false);

  const fetchJobData = async (
    page = 1,
    search = null,
    filter = null,
    perPage = 10
  ) => {
    loading.value = true;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        params: {
          page: page,
          search: search,
          filter: filter,
          per_page: perPage,
        },
      };
      if (token.value) {
        const response = await axios.get("jobs/company", config);

        jobList.value = response.data.data.data;
        pagination.value = response.data.data;
      }
    } catch (error) {
      console.error("Failed to fetch job data:", error);
      toast.error(error.response.data.message);
    }
    loading.value = false;
  };

  fetchJobData();
  return {
    token,
    jobList,
    pagination,
    loading,
    fetchJobData,
  };
});
