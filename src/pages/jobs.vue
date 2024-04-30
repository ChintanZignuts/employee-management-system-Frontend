<script setup>
// job listing page

//Imports
import AddJobDrawer from "@/views/apps/user/list/AddJobDrawer.vue";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { VDataTableServer } from "vuetify/labs/VDataTable";
import axios from "../axiosConfig";
import { jobHeaders } from "../utils/dataTableHeaders";
import { useDebounceFn } from "@vueuse/core";
import { useJobStore } from "../store/useJob";

//Data
const deleteDialog = ref(false);
const isAddJobDrawerVisible = ref(false);
const editJobData = ref(null);
const isEditMode = ref(false);
const deleteItemId = ref(null);
const permentDelete = ref(false);
const search = ref(null);
const selectedEmpType = ref(null);
const jobStore = useJobStore();

//destructuring variables and function from pinia store
const { jobList, pagination, loading } = storeToRefs(jobStore);
const { fetchJobData } = jobStore;

// functions for data table start
const resolveJobStatus = (expiryDate) => {
  const now = new Date();
  const expirationDate = new Date(expiryDate);

  if (!expiryDate || now <= expirationDate)
    return {
      color: "success",
      text: "Active",
    };
  else if (now > expirationDate)
    return {
      color: "primary",
      text: "Expired",
    };
};

const EmploymentOptions = [
  { title: "Full-time" },
  { title: "Part-time" },
  { title: "Contract" },
  { title: "Freelance" },
  { title: "Internship" },
  { title: "Remote" },
];

//function for fetch data for edit and open drawer
const openAddJobDrawer = async (jobData) => {
  if (jobData) {
    try {
      const response = await axios.get(`/job/${jobData.id}`);

      editJobData.value = response.data.data;
      if (editJobData.value) {
        isEditMode.value = true;
        isAddJobDrawerVisible.value = true;
      }
    } catch (error) {
      console.error("Failed to fetch company details:", error.message);
      toast.error("Failed to fetch company data");
    }
  } else {
    editJobData.value = null;
    isEditMode.value = false;
    isAddJobDrawerVisible.value = true;
  }
};

//function for open dialog
const deleteItem = (item) => {
  deleteItemId.value = item;
  deleteDialog.value = true;
};

//function for close dialog
const closeDelete = () => {
  deleteDialog.value = false;
};

//function for handle delete api call
const deleteItemConfirm = async () => {
  try {
    await axios.post(`job/delete/${deleteItemId.value}`, {
      permanent: permentDelete.value,
    });

    fetchJobData(1, search.value, selectedEmpType.value);
    closeDelete();
    toast.success("Company Deleted Successfully");
  } catch (error) {
    console.error("Failed to delete company:", error.message);
    toast.error(error.message);
  }
};

//function that used by child component on form submit
const addNewJob = async (jobData) => {
  loading.value = true;
  try {
    if (isEditMode.value) {
      const response = await axios.post(
        `job/update/${editJobData.value.id}`,
        jobData
      );

      console.log("User updated successfully:", response.data);
      toast.success(response.data.message);
    } else {
      const response = await axios.post("job/create", jobData);

      toast.success(response.data.message);
    }

    fetchJobData(1, search.value, selectedEmpType.value);

    isAddJobDrawerVisible.value = false;
  } catch (error) {
    console.error("Failed to update or create user:", error.message);
    toast.error(error.message);
  }
  loading.value = false;
};

//function for search,pagination,filter
const handleSearch = useDebounceFn(() => {
  fetchJobData(1, search.value, selectedEmpType.value);
}, 500);

const handlePagination = (page) => {
  fetchJobData(page, search.value, selectedEmpType.value);
};

const handleFilter = () => {
  fetchJobData(1, "", selectedEmpType.value);
};

//return backend image url
const fetchImage = (url) => {
  const BASEURL = "http://127.0.0.1:8000/storage/logos/";
  const image = BASEURL + `${url}`;

  return image;
};

//run handleFilter function when change in selectedEmpType
watch(selectedEmpType, handleFilter);
</script>

<template>
  <div>
    <!-- 👉 Add user button -->
    <div v-if="pagination">
      <div class="d-flex justify-end ma-3">
        <VBtn prepend-icon="tabler-plus" @click="openAddJobDrawer(null)">
          Add New Job
        </VBtn>
      </div>
      <VCardText>
        <VRow class="d-flex justify-end">
          <VCol cols="12" md="4">
            <AppTextField
              v-model="search"
              density="compact"
              placeholder="Search"
              append-inner-icon="tabler-search"
              @input="handleSearch"
              single-line
              hide-details
              dense
              outlined
            />
          </VCol>

          <VCol cols="12" md="4">
            <AppSelect
              v-model="selectedEmpType"
              placeholder="Filter Company By Employment Type"
              clearable
              clear-icon="tabler-x"
              single-line
              :items="EmploymentOptions"
              item-value="title"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VDataTableServer
        v-model:items-per-page="pagination.per_page"
        :headers="jobHeaders"
        :items="jobList"
        :items-length="pagination.total"
        :loading="loading"
        :search="search"
        item.value="item"
        :page="pagination.current_page"
        @update:page="handlePagination"
      >
        <!-- title column -->
        <template #item.title="{ item }">
          <div class="my-2">
            <div class="d-flex flex-column ms-3">
              <span
                class="d-block font-weight-medium text--primary text-truncate"
                >{{ item.raw.title }}</span
              >
            </div>

            <div>
              <VChip
                v-for="(skill, index) in item.raw.required_skills"
                :key="index"
                class="mx-1 my-1"
                size="small"
                label
              >
                {{ skill }}
              </VChip>
            </div>
          </div>
        </template>

        <!-- description column -->
        <template #item.description="{ item }">
          <span>{{ item.raw.description }}</span>
        </template>

        <template #item.status="{ item }">
          <VChip
            :color="resolveJobStatus(item.raw.expiry_date).color"
            size="small"
            label
            class="text-capitalize"
          >
            {{ resolveJobStatus(item.raw.expiry_date).text }}
          </VChip>
        </template>

        <template #item.posted="{ item }">
          <span>{{ item.raw.posted_date }}</span>
        </template>

        <!-- company name column -->
        <template #item.employment_type="{ item }">
          <VChip size="small" label class="text-capitalize">
            {{ item.raw.employment_type }}
          </VChip>
        </template>

        <template #item.name="{ item }">
          <VChip pill>
            <VAvatar
              start
              :image="
                item.raw.company.logo_url
                  ? fetchImage(item.raw.company.logo_url)
                  : null
              "
            />
            <span>{{ item.raw.company.name }}</span>
          </VChip>
        </template>

        <!-- Status column -->

        <!-- Actions column -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="openAddJobDrawer(item.raw)">
              <VIcon icon="mdi-pencil-outline" />
            </IconBtn>
            <IconBtn @click="deleteItem(item.raw.id)">
              <VIcon icon="mdi-delete-outline" />
            </IconBtn>
          </div>
        </template>
      </VDataTableServer>
    </div>

    <VDialog v-model="deleteDialog" max-width="500px">
      <VCard class="align-center d-flex justify-center ma-5">
        <VCardTitle> Are you sure you want to delete this item? </VCardTitle>
        <div class="demo-space-x">
          <VCheckbox
            v-model="permentDelete"
            label=" Delete Company Permanent"
          />
        </div>

        <VCardActions class="mt-5">
          <VSpacer />
          <VBtn color="error" variant="outlined" @click="closeDelete">
            Cancel
          </VBtn>
          <VBtn color="success" variant="elevated" @click="deleteItemConfirm">
            OK
          </VBtn>
          <VSpacer />
        </VCardActions>
      </VCard>
    </VDialog>

    <AddJobDrawer
      v-model:isJobDrawerOpen="isAddJobDrawerVisible"
      :job-data="editJobData"
      @job-data="addNewJob"
    />
  </div>
</template>
