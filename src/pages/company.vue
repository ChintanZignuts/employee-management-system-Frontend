<script setup>
import { avatarText } from "@/@core/utils/formatters";
import AddNewCompanyDrawer from "@/views/apps/user/list/AddNewCompanyDrawer.vue";
import { onMounted, ref, watchEffect } from "vue";
import { toast } from "vue3-toastify";
import { VDataTableServer } from "vuetify/labs/VDataTable";
import axios from "../axiosConfig";
import { companyHeaders } from "../utils/dataTableHeaders";
import { useDebounceFn, watchThrottled } from "@vueuse/core";
import { useCompanyStore } from "@/store/useCompany";

const deleteDialog = ref(false);
const isAddNewCompanyDrawerVisible = ref(false);
const editCompanyData = ref(null);
const isEditMode = ref(false);
const deleteItemId = ref(null);
const permentDelete = ref(false);
const search = ref("");
const selectedStatus = ref(null);
const companyStore = useCompanyStore();

const resolveStatusVariant = (status) => {
  if (status === "A")
    return {
      color: "success",
      text: "Active",
    };
  else if (status === "I")
    return {
      color: "primary",
      text: "Inactive",
    };
  else
    return {
      color: "info",
      text: "No status",
    };
};

const status = [
  {
    title: "Active",
    value: "A",
  },
  {
    title: "Inactive",
    value: "I",
  },
];

const openAddNewCompanyDrawer = async (companyData) => {
  if (companyData) {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "multipart/form-data",
        },
      };

      const response = await axios.get(`/companies/${companyData.id}`, config);

      editCompanyData.value = response.data.data;
      if (editCompanyData.value) {
        isEditMode.value = true;
        isAddNewCompanyDrawerVisible.value = true;
      }
    } catch (error) {
      console.error("Failed to fetch company details:", error.message);
      toast("Failed to fetch company details");
    }
  } else {
    editCompanyData.value = null;
    isEditMode.value = false;
    isAddNewCompanyDrawerVisible.value = true;
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
      `/companies/delete/${deleteItemId.value}`,
      { forceDelete: permentDelete.value },
      config
    );

    companyStore.fetchCompanyData(1, search.value, selectedStatus.value);
    closeDelete();
    toast.success("Company Deleted Successfully");
  } catch (error) {
    console.error("Failed to delete company:", error);
    toast.error(error.response.data.message);
  }
};

const addNewCompany = async (userData) => {
  loading.value = true;
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    if (isEditMode.value) {
      const response = await axios.post(
        `/companies/update/${editCompanyData.value.id}`,
        userData,
        config
      );

      console.log("User updated successfully:", response.data);
      toast.success(response.data.message);
    } else {
      const response = await axios.post("companies/create", userData, config);

      console.log("User created successfully:", response.data);
      toast.success(response.data.message);
    }

    await companyStore.fetchCompanyData(1, search.value, selectedStatus.value);

    isAddNewCompanyDrawerVisible.value = false;
  } catch (error) {
    console.error("Failed to update or create user:", error.message);
    toast.error(error.message);
  }
  loading.value = false;
};

const handleSearch = useDebounceFn(() => {
  companyStore.fetchCompanyData(1, search.value);
}, 500);

const handlePagination = (page) => {
  console.log("Page:", page);
  companyStore.fetchCompanyData(page);
};

const handleFilter = async () => {
  companyStore.fetchCompanyData(1, "", selectedStatus.value);
};

watchEffect(handleFilter);
</script>

<template>
  <div>
    <!-- 👉 Add user button -->
    <div v-if="companyStore.pagination !== null">
      <div class="d-flex justify-end ma-3">
        <VBtn prepend-icon="tabler-plus" @click="openAddNewCompanyDrawer(null)">
          Add New Company
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
              v-model="selectedStatus"
              placeholder="Filter Company By Status"
              clearable
              clear-icon="tabler-x"
              single-line
              :items="status"
            />
          </VCol>
        </VRow>
      </VCardText>
      <VDataTableServer
        v-model:items-per-page="companyStore.pagination.per_page"
        :headers="companyHeaders"
        :items="companyStore.companyList"
        :items-length="companyStore.pagination.total"
        :loading="companyStore.loading"
        :search="search"
        item.value="item"
        :page="companyStore.pagination.current_page"
        @update:page="handlePagination"
      >
        <!-- Name column -->
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <!-- Avatar -->
            <VAvatar
              size="32"
              :color="item.raw.avatar ? '' : 'primary'"
              :class="item.raw.avatar ? '' : 'v-avatar-light-bg primary--text'"
              :variant="!item.raw.avatar ? 'tonal' : undefined"
            >
              <VImg
                v-if="item.raw.logo_url"
                :src="`http://127.0.0.1:8000/storage/logos/${item.raw.logo_url}`"
              />
              <span v-else>{{ avatarText(item.raw.name) }}</span>
            </VAvatar>

            <!-- Name and location -->
            <div class="d-flex flex-column ms-3">
              <span
                class="d-block font-weight-medium text--primary text-truncate"
                >{{ item.raw.name }}</span
              >
              <small>{{ item.raw.location }}</small>
            </div>
          </div>
        </template>

        <!-- Email column -->
        <template #item.company_email="{ item }">
          <span>{{ item.raw.company_email }}</span>
        </template>

        <!-- Website column -->
        <template #item.website="{ item }">
          <a :href="item.raw.website" target="_blank" rel="noopener noreferrer"
            ><span>{{ item.raw.name }}</span></a
          >
        </template>

        <!-- Status column -->
        <template #item.status="{ item }">
          <VChip
            :color="resolveStatusVariant(item.raw.status).color"
            size="small"
            label
            class="text-capitalize"
          >
            {{ resolveStatusVariant(item.raw.status).text }}
          </VChip>
        </template>

        <!-- Actions column -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="openAddNewCompanyDrawer(item.raw)">
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
    <AddNewCompanyDrawer
      v-model:isDrawerOpen="isAddNewCompanyDrawerVisible"
      :company-data="editCompanyData"
      @user-data="addNewCompany"
    />
  </div>
</template>
