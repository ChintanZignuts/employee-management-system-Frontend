<script setup>
import AddJobDrawer from "@/views/apps/user/list/AddJobDrawer.vue";
import { onMounted, ref } from "vue";
import { toast } from "vue3-toastify";
import { VDataTable } from "vuetify/labs/VDataTable";
import axios from "../axiosConfig";

const deleteDialog = ref(false);
const isAddJobDrawerVisible = ref(false);
const editJobData = ref(null);
const isEditMode = ref(false);
const deleteItemId = ref(null);
const jobList = ref([]);
const permentDelete = ref(false);
const loading = ref(false);

// functions for data table start
const headers = [
  {
    title: "Job Title",
    key: "title",
    sortable: false,
  },
  {
    title: "Description",
    key: "description",
    sortable: false,
  },
  {
    title: "Employment Type",
    key: "employment_type",
  },
  {
    title: "Status",
    key: "status",
  },
  {
    title: "Posted On",
    key: "posted",
  },
  {
    title: "Posted By",
    key: "name",
  },

  {
    title: "ACTIONS",
    key: "actions",
  },
];

const resolveJobStatus = (expiryDate) => {
  const now = new Date();
  const expirationDate = new Date(expiryDate);
  if (!expiryDate)
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

//function for fetch data of job
const fetchData = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get("jobs/company", config);

    jobList.value = response.data.data;
  } catch (error) {
    console.error("Failed to fetch job data:", error.message);
    toast.error("Failed to fetch Job data");
  }
  loading.value = false;
};

//function for fetch data for edit and open drawer
const openAddJobDrawer = async (jobData) => {
  if (jobData) {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "multipart/form-data",
        },
      };

      const response = await axios.get(`/job/${jobData.id}`, config);

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
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.post(
      `job/delete/${deleteItemId.value}`,
      { permanent: permentDelete.value },
      config
    );

    fetchData();
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
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (isEditMode.value) {
      const response = await axios.post(
        `job/update/${editJobData.value.id}`,
        jobData,
        config
      );

      console.log("User updated successfully:", response.data);
      toast.success(response.data.message);
    } else {
      const response = await axios.post("job/create", jobData, config);

      toast.success(response.data.message);
    }

    fetchData();

    isAddJobDrawerVisible.value = false;
  } catch (error) {
    console.error("Failed to update or create user:", error.message);
    toast.error(error.message);
  }
  loading.value = false;
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div>
    <!-- <Snackbar /> -->
    <div v-if="loading" class="d-flex justify-center">
      <VProgressCircular :size="40" color="primary" indeterminate />
    </div>
    <!-- 👉 Add user button -->
    <div v-else>
      <div class="d-flex justify-end ma-3">
        <VBtn prepend-icon="tabler-plus" @click="openAddJobDrawer(null)">
          Add New Job
        </VBtn>
      </div>
      <VDataTable :headers="headers" :items="jobList" :items-per-page="10">
        <!-- title column -->
        <template #item.title="{ item }">
          <div class="d-flex align-center">
            <div class="d-flex flex-column ms-3">
              <span
                class="d-block font-weight-medium text--primary text-truncate"
                >{{ item.raw.title }}</span
              >
            </div>
          </div>
          <div>
            <VChip
              class="mx-1 my-1"
              v-for="(skill, index) in item.raw.required_skills"
              :key="index"
              size="small"
              label
            >
              {{ skill }}
            </VChip>
          </div>
        </template>

        <!-- description column -->
        <template #item.description="{ item }">
          <span>{{ item.raw.description }}</span>
        </template>

        <template #item.status="{ item }">
          <VChip
            :color="resolveJobStatus(item.expiry_date).color"
            size="small"
            label
            class="text-capitalize"
          >
            {{ resolveJobStatus(item.expiry_date).text }}
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
                  ? `http://127.0.0.1:8000/storage/logos/${item.raw.company.logo_url}`
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
      </VDataTable>
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
