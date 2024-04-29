<script setup>
// job listing page

import EditJobApplicationDrawer from "@/views/apps/user/list/EditJobApplicationDrawer.vue";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { VDataTableServer } from "vuetify/labs/VDataTable";
import axios from "../axiosConfig";
import { jobApplicationHeaders } from "../utils/dataTableHeaders";
import { useDebounceFn } from "@vueuse/core";
import { useJobApplicationStore } from "../store/useJobApplication";

const deleteDialog = ref(false);
const isAddJobApplicationDrawerVisible = ref(false);
const editJobApplicationData = ref(null);
const deleteItemId = ref(null);
const permentDelete = ref(false);
const jobApplicationStore = useJobApplicationStore();

//destructuring variables and function from pinia store
const { jobApplicationList, loading, pagination } =
  storeToRefs(jobApplicationStore);
const { fetchJobApplicationData } = jobApplicationStore;

const getStatusDisplay = (statusCode) => {
  let status = "";
  let color = "";

  switch (statusCode) {
    case "P":
      status = "Pending";
      color = "error";
      break;
    case "A":
      status = "Approved";
      color = "primary";
      break;
    case "R":
      status = "Rejected";
      color = "success";
      break;
    default:
      status = "Unknown";
      color = "success";
  }

  return { status, color };
};

//function for fetch data for edit and open drawer
const openEditJobApplicationDrawer = async (jobApplicationData) => {
  if (jobApplicationData) {
    try {
      const response = await axios.get(
        `job_applications/show/${jobApplicationData.id}`
      );

      editJobApplicationData.value = response.data.data;
      if (editJobApplicationData.value) {
        isAddJobApplicationDrawerVisible.value = true;
      }
    } catch (error) {
      console.error("Failed to fetch Job Application details:", error.message);
      toast.error("Failed to fetch Job Application data");
    }
  } else {
    editJobApplicationData.value = null;
    isAddJobApplicationDrawerVisible.value = true;
  }
};

//function that used by child component on form submit
const EditJobApplication = async (jobApplicationData) => {
  loading.value = true;
  try {
    const response = await axios.post(
      `job_application/update/${editJobApplicationData.value.id}`,
      jobApplicationData
    );

    console.log("Job Application updated successfully:", response.data);
    toast.success(response.data.message);

    fetchJobApplicationData(1);

    isAddJobApplicationDrawerVisible.value = false;
  } catch (error) {
    console.error("Failed to update or create Job Application:", error.message);
    toast.error(error.message);
  }
  loading.value = false;
};

//functions for delete job applications

const deleteItem = (item) => {
  deleteItemId.value = item;
  deleteDialog.value = true;
};

const closeDelete = () => {
  deleteDialog.value = false;
};

const deleteItemConfirm = async () => {
  try {
    await axios.post(`job_application/delete/${deleteItemId.value}`, {
      permanent: permentDelete.value,
    });

    fetchJobApplicationData(1);
    closeDelete();
    toast.success("Application Deleted Successfully");
  } catch (error) {
    console.error("Failed to delete Application:", error.message);
    toast.error(error.message);
  }
};

const handlePagination = (page) => {
  fetchJobApplicationData(page);
};

const fetchResumeUrl = (url) => {
  const BASEURL = "http://127.0.0.1:8000/storage/";
  const image = BASEURL + `${url}`;

  return image;
};
</script>

<template>
  <div>
    <!-- 👉 Add user button -->
    <div v-if="pagination">
      <VDataTableServer
        v-model:items-per-page="pagination.per_page"
        :headers="jobApplicationHeaders"
        :items="jobApplicationList"
        :items-length="pagination.total"
        :loading="loading"
        item.value="item"
        :page="pagination.current_page"
        @update:page="handlePagination"
      >
        <!-- title column -->
        <template #item.name="{ item }">
          <div class="my-2">
            <div class="d-flex flex-column ms-3">
              <span
                class="d-block font-weight-medium text--primary text-truncate"
                >{{ item.raw.user.first_name }}</span
              >
            </div>
          </div>
        </template>

        <!-- description column -->
        <template #item.resume="{ item }">
          <a :href="fetchResumeUrl(item.raw.resume)" target="_blank">
            View Resume
          </a>
        </template>
        <template #item.title="{ item }">
          <div class="d-flex flex-column ms-3">
            <span
              class="d-block font-weight-medium text--primary text-truncate"
              >{{ item.raw.job.title }}</span
            >
          </div>
        </template>

        <template #item.status="{ item }">
          <VChip
            size="small"
            label
            class="text-capitalize"
            :color="getStatusDisplay(item.raw.status).color"
          >
            {{ getStatusDisplay(item.raw.status).status }}
          </VChip>
        </template>

        <!-- company name column -->
        <template #item.application_date="{ item }">
          <VChip size="small" label class="text-capitalize">
            {{ item.raw.application_date }}
          </VChip>
        </template>

        <!-- Status column -->

        <!-- Actions column -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="openEditJobApplicationDrawer(item.raw)">
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
    <EditJobApplicationDrawer
      v-model:isJobApplicationDrawerOpen="isAddJobApplicationDrawerVisible"
      :job-application-data="editJobApplicationData"
      @jobApplicationData="EditJobApplication"
    />
  </div>
</template>
