import axios from "../axiosConfig";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCompanyStore = defineStore("counter", () => {
  const companyOptions = ref([]);
  const token = ref(localStorage.getItem("token"));

  const fetchCompanyOptions = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      };

      const response = await axios.get("employee/companies/option", config);

      companyOptions.value = response.data;
    } catch (error) {
      console.error("Error fetching company options:", error);
    }
  };

  return { companyOptions, token, fetchCompanyOptions };
});
