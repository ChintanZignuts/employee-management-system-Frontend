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
const isAddJobDrawerVisible = ref(false);
const editJobApplicationData = ref(null);
const deleteItemId = ref(null);
const permentDelete = ref(false);
const jobApplicationStore = useJobApplicationStore();

//destructuring variables and function from pinia store
const { jobApplicationList, loading, pagination } =
  storeToRefs(jobApplicationStore);
const { fetchJobApplicationData } = jobApplicationStore;

//function for fetch data for edit and open drawer
const openEditJobApplicationDrawer = async (jobData) => {
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

const deleteItem = (item) => {
  deleteItemId.value = item;
  deleteDialog.value = true;
};

const closeDelete = () => {
  deleteDialog.value = false;
};

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
const EditJobApplication = async (jobData) => {
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
