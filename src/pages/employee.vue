<script setup>
//page for employee list,search,filter

//imports
import { avatarText } from "@/@core/utils/formatters";
import AddEmployeeDrawer from "@/views/apps/user/list/AddEmployeeDrawer.vue";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { VDataTableServer } from "vuetify/labs/VDataTable";
import axios from "../axiosConfig";
import { employeeHeaders } from "../utils/dataTableHeaders";
import { useDebounceFn } from "@vueuse/core";
import { useCompanyStore } from "../store/useCompany";
import { useEmployeeStore } from "../store/useEmployee";

//constants
const deleteDialog = ref(false);
const isAddEmployeeDrawerVisible = ref(false);
const deleteItemId = ref(null);
const permentDelete = ref(false);
const editEmployeeData = ref(null);
const isEditMode = ref(false);
const search = ref(null);
const selectedCompany = ref(null);
const companyStore = useCompanyStore();
const employeeStore = useEmployeeStore();

//destructuring variables and function from pinia store
const { companyOptions } = storeToRefs(companyStore);
const { loading, employeeList, pagination } = storeToRefs(employeeStore);
const { fetchEmployeeData } = employeeStore;

const getTypeFullType = (type) => {
  if (type === "CA") return "Company Admin";
  else if (type === "E") return "Employee";
  else return "Unknown";
};

// Function to delete an employee
const deleteItem = (id) => {
  deleteItemId.value = id;
  deleteDialog.value = true;
};

// Function to confirm deletion of an employee
const deleteItemConfirm = async () => {
  try {
    await axios.post(`/employee/delete/${deleteItemId.value}`, {
      permanent: permentDelete.value,
    });

    // Remove the deleted employee from the list

    closeDelete();
    fetchEmployeeData(1, search.value, selectedCompany.value);
    toast.success("Employee Deleted");

    // Close the delete dialog
  } catch (error) {
    console.error("Failed to delete employee:", error);
    toast.error(error.response.data.error);
  }
};

// Function to close the delete dialog
const closeDelete = () => {
  deleteDialog.value = false;
  deleteItemId.value = null;
  permentDelete.value = false;
};

// function for fetch data of employee and open edit or create form drawer
const openAddEmployeeDrawer = async (employeeId) => {
  if (employeeId) {
    try {
      const response = await axios.get(`employee/${employeeId}`, config);

      editEmployeeData.value = response.data.data;
      if (editEmployeeData.value) {
        isAddEmployeeDrawerVisible.value = true;
        isEditMode.value = true;
      }
    } catch (error) {
      console.error("Failed to fetch Employee details:", error.message);
      toast.error("Failed to fetch Employee details");
    }
  } else {
    editEmployeeData.value = null;
    isEditMode.value = false;
    isAddEmployeeDrawerVisible.value = true;
  }
};

//function for create and edit employee used by addEmployeeDrawer component
const addNewEmployee = async (employeeData) => {
  try {
    loading = true;

    if (isEditMode.value) {
      const response = await axios.post(
        `employee/update/${editEmployeeData.value.id}`,
        employeeData
      );

      console.log("Employee updated successfully:", response.data);
      toast.success("Employee updated successfully");
    } else {
      const response = await axios.post("employee/create", employeeData);

      console.log("Employee created successfully:", response.data);
      toast.success("Employee created successfully");
    }

    fetchEmployeeData();

    isAddEmployeeDrawerVisible.value = false;
  } catch (error) {
    console.error("Failed to update or create Employee:", error.message);
    toast.error(error.message);
  }

  loading = false;
};

//for change page and make api call
const handlePagination = (page) => {
  fetchEmployeeData(page, search.value, selectedCompany.value);
};

//for searching
const handleSearch = useDebounceFn(() => {
  fetchEmployeeData(1, search.value, selectedCompany.value);
}, 500);

//for filtering
const handleFilter = () => {
  fetchEmployeeData(1, "", selectedCompany.value);
};

//watcher for detect change in selectedCompany and run function
watch(selectedCompany, handleFilter);
</script>

<template>
  <div>
    <!-- 👉 add new employee btn  -->
    <div v-if="pagination">
      <div class="d-flex justify-end ma-3">
        <VBtn prepend-icon="tabler-plus" @click="openAddEmployeeDrawer(null)">
          Add New Employee
        </VBtn>
      </div>
      <VCardText>
        <!-- 👉 search field  -->
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

          <!-- 👉 select filter field  -->
          <VCol cols="12" md="4" v-if="companyOptions.length > 1">
            <AppSelect
              v-model="selectedCompany"
              placeholder="Filter Employee by Company"
              clearable
              clear-icon="tabler-x"
              single-line
              :items="companyOptions"
              item-title="name"
              item-value="id"
            />
          </VCol>
        </VRow>
      </VCardText>

      <!-- 👉 Employee table -->
      <VDataTableServer
        v-model:items-per-page="pagination.per_page"
        :headers="employeeHeaders"
        :items="employeeList"
        :items-length="pagination.total"
        :loading="loading"
        item.value="employee"
        :page="pagination.current_page"
        @update:page="handlePagination"
      >
        <!-- 👉  Employee Name column -->
        <template #item.first_name="{ item }">
          <div class="d-flex align-center">
            <!-- 👉  Avatar -->
            <VAvatar
              size="32"
              :color="item.raw.avatar ? '' : 'primary'"
              :class="item.raw.avatar ? '' : 'v-avatar-light-bg primary--text'"
              :variant="!item.raw.avatar ? 'tonal' : undefined"
            >
              <VImg v-if="item.raw.avatar" src="" />
              <span v-else>{{
                avatarText(item.raw.first_name + " " + item.raw.last_name)
              }}</span>
            </VAvatar>

            <!--👉  Name and location -->
            <div class="d-flex flex-column ms-3">
              <span
                class="d-block font-weight-medium text--primary text-truncate"
                >{{ item.raw.first_name }}</span
              >
              <small>{{ item.raw.city }}</small>
            </div>
          </div>
        </template>

        <!-- 👉  Email column -->
        <template #item.email="{ item }">
          <span>{{ item.raw.email }}</span>
        </template>

        <!--👉  Type column -->
        <template #item.type="{ item }">
          <span>{{ getTypeFullType(item.raw.type) }}</span>
        </template>

        <!-- 👉 employee number -->
        <template #item.emp_no="{ item }">
          <span>{{ item.raw.emp_no }}</span>
        </template>

        <!-- 👉 Company column -->
        <template #item.company="{ item }">
          <span>{{ item.raw.company.name }}</span>
        </template>

        <!--👉 Actions column -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="openAddEmployeeDrawer(item.raw.id)">
              <VIcon icon="mdi-pencil-outline" />
            </IconBtn>
            <IconBtn @click="deleteItem(item.raw.id)">
              <VIcon icon="mdi-delete-outline" />
            </IconBtn>
          </div>
        </template>
      </VDataTableServer>
    </div>

    <!-- 👉 Delete confirmation dialog -->
    <VDialog v-model="deleteDialog" max-width="500px">
      <VCard class="align-center d-flex justify-center ma-5">
        <VCardTitle> Are you sure you want to delete this item? </VCardTitle>
        <div class="demo-space-x">
          <VCheckbox
            v-model="permentDelete"
            label=" Delete Employee Permanent"
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

    <!-- 👉 create and edit employee form drawer -->
    <AddEmployeeDrawer
      v-model:isEmployeeDrawerOpen="isAddEmployeeDrawerVisible"
      :employee-data="editEmployeeData"
      @employee-data="addNewEmployee"
    />
  </div>
</template>
