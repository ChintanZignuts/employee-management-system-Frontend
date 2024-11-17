// store for get company data on load and company

import axios from "../axiosConfig";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

export const useCompanyStore = defineStore("company", () => {
  const companyOptions = ref([]);
  const token = ref(localStorage.getItem("token"));
  const companyList = ref([]);
  const pagination = ref(null);
  const loading = ref(false);

  // function for fetch company option
  const fetchCompanyOptions = async () => {
    try {
      const response = await axios.get("employee/companies/option");

      companyOptions.value = response.data.data;
    } catch (error) {
      console.error(
        "Error fetching company options:",
        error.response.data.message
      );
    }
  };

  //function for fetch company data with filter, pagination and searching
  const fetchCompanyData = async (
    page = 1,
    search = "",
    status,
    perPage = 10
  ) => {
    loading.value = true;
    try {
      const config = {
        params: {
          page: page,
          search: search,
          per_page: perPage,
          filter: status,
        },
      };

      const response = await axios.get(`/companies`, config);

      companyList.value = response.data.data.data;
      pagination.value = response.data.data;
    } catch (error) {
      console.error("Failed to fetch company data:", error.message);
      toast.error("Failed to fetch company data");
    }
    loading.value = false;
  };

  onMounted(async () => {
    if (token.value) {
      await fetchCompanyData();
      await fetchCompanyOptions();
    }
  });

  return {
    companyOptions,
    companyList,
    pagination,
    loading,
    fetchCompanyData,
    fetchCompanyOptions,
  };
});
