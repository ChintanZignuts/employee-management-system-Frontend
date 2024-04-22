// store for employee data and state of ata fetching

import axios from "../axiosConfig";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useEmployeeStore = defineStore("employee", () => {
  const token = ref(localStorage.getItem("token"));
  const employeeList = ref([]);
  const pagination = ref(null);
  const loading = ref(false);

  const fetchEmployeeData = async (
    page = 1,
    search = null,
    company_id = null,
    perPage = 10
  ) => {
    loading.value = true;
    try {
      const config = {
        params: {
          page: page,
          search: search,
          per_page: perPage,
          company_id: company_id,
        },
      };
      if (token.value) {
        const response = await axios.get("employee", config);
        employeeList.value = response.data.data.data;
        pagination.value = response.data.data;
      }
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
      toast.error(error.response.data.message);
    }
    loading.value = false;
  };
  if (token.value) {
    fetchEmployeeData();
  }

  return {
    employeeList,
    pagination,
    loading,
    fetchEmployeeData,
  };
});
