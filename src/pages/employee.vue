<script setup>
import { avatarText } from "@/@core/utils/formatters"
import AddEmployeeDrawer from "@/views/apps/user/list/AddEmployeeDrawer.vue"
import { onMounted, ref } from "vue"
import { VDataTable } from "vuetify/labs/VDataTable"
import axios from "../axiosConfig"

const deleteDialog = ref(false)
const isAddEmployeeDrawerVisible = ref(false)
const deleteItemId = ref(null)
const employeeList = ref([])
const permentDelete = ref(false)
const loading = ref(false)
const editEmployeeData = ref(null)
const isEditMode = ref(false)

// Function to fetch employee data
const fetchData = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem("token")
    const type=localStorage.getItem('type')

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    
    const response = await axios.get("/allemployee", config)

    employeeList.value = response.data.data
    console.log(employeeList.value)
  } catch (error) {
    console.error("Failed to fetch employee data:", error.message)
  }
  loading.value = false
}

const headers = [
  { title: "First Name", key: "first_name" },
  { title: "Last Name", key: "last_name" },
  { title: "Email", key: "email" },
  { title: "Type", key: "type" },
  { title: "Employee No", key: "emp_no" },
  { title: "Company Name", key: "company" },
  { title: "Actions", key: "actions", sortable: false },
]

const getTypeFullType = type => {
  if (type === "CA") return "Company Admin"
  else if (type === "E") return "Employee"
  else return "Unknown"
}

// Function to delete an employee
const deleteItem = id => {
  deleteItemId.value = id
  deleteDialog.value = true
}

// Function to confirm deletion of an employee
const deleteItemConfirm = async () => {
  try {
    const token = localStorage.getItem("token")

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    await axios.post(
      `/employee/delete/${deleteItemId.value}`,
      { permanent: permentDelete.value },
      config,
    )

    // Remove the deleted employee from the list
    employeeList.value = employeeList.value.filter(
      employee => employee.id !== deleteItemId.value,
    )

    // Close the delete dialog
    closeDelete()
  } catch (error) {
    console.error("Failed to delete employee:", error.message)
  }
}

// Function to close the delete dialog
const closeDelete = () => {
  deleteDialog.value = false
  deleteItemId.value = null
  permentDelete.value = false
}

const openAddEmployeeDrawer = async employeeId => {
  if (employeeId) {
    try {
      const token = localStorage.getItem("token")

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await axios.get(`employee/${employeeId}`, config)

      editEmployeeData.value = response.data.data
      if (editEmployeeData.value) {
        isAddEmployeeDrawerVisible.value = true
        isEditMode.value = true
      }
    } catch (error) {
      console.error("Failed to fetch Employee details:", error.message)
    }
  } else {
    editEmployeeData.value = null
    isEditMode.value = false
    isAddEmployeeDrawerVisible.value = true
  }
}

const addNewEmployee = async employeeData => {
  try {
    loading.value = true

    const token = localStorage.getItem("token")

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    if (isEditMode.value) {
      const response = await axios.post(
        `employee/update/${editEmployeeData.value.id}`,
        employeeData,
        config,
      )

      console.log("Employee updated successfully:", response.data)
    } else {
      const response = await axios.post(
        "employee/create",
        employeeData,
        config,
      )

      console.log("Employee created successfully:", response.data)
    }

    fetchData()

    isAddEmployeeDrawerVisible.value = false
    loading.value = false
  } catch (error) {
    console.error("Failed to update or create Employee:", error.message)
  }

  loading.value = false
}

// Fetch employee data when component is mounted
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div>
    <div
      v-if="loading"
      class="d-flex justify-center"
    >
      <VProgressCircular
        :size="40"
        color="primary"
        indeterminate
      />
    </div>
    <div v-else>
      <!-- Employee table -->
      <div class="d-flex justify-end ma-3">
        <VBtn
          prepend-icon="tabler-plus"
          @click="openAddEmployeeDrawer(null)"
        >
          Add New Employee
        </VBtn>
      </div>
      <VDataTable
        :headers="headers"
        :items="employeeList"
        :items-per-page="10"
      >
        <!-- Employee Name column -->
        <template #item.first_name="{ item }">
          <div class="d-flex align-center">
            <!-- Avatar -->
            <VAvatar
              size="32"
              :color="item.raw.avatar ? '' : 'primary'"
              :class="item.raw.avatar ? '' : 'v-avatar-light-bg primary--text'"
              :variant="!item.raw.avatar ? 'tonal' : undefined"
            >
              <VImg
                v-if="item.raw.avatar"
                src=""
              />
              <span v-else>{{
                avatarText(item.raw.first_name + " " + item.raw.last_name)
              }}</span>
            </VAvatar>

            <!-- Name and location -->
            <div class="d-flex flex-column ms-3">
              <span class="d-block font-weight-medium text--primary text-truncate">{{ item.raw.first_name }}</span>
              <small>{{ item.raw.city }}</small>
            </div>
          </div>
        </template>
        <!-- Email column -->
        <template #item.email="{ item }">
          <span>{{ item.raw.email }}</span>
        </template>
        <!-- Type column -->
        <template #item.type="{ item }">
          <span>{{ getTypeFullType(item.raw.type) }}</span>
        </template>
        <template #item.emp_no="{ item }">
          <span>{{ item.raw.emp_no }}</span>
        </template>
        <!-- Company column -->
        <template #item.company="{ item }">
          <span>{{ item.raw.company.name }}</span>
        </template>
        <!-- Actions column -->
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
      </VDataTable>
    </div>
    <!-- Delete confirmation dialog -->
    <VDialog
      v-model="deleteDialog"
      max-width="500px"
    >
      <VCard>
        <VCardTitle> Are you sure you want to delete this item? </VCardTitle>
        <div class="demo-space-x">
          <VCheckbox
            v-model="permentDelete"
            label=" Delete Employee Permanent"
          />
        </div>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="error"
            variant="outlined"
            @click="closeDelete"
          >
            Cancel
          </VBtn>
          <VBtn
            color="success"
            variant="elevated"
            @click="deleteItemConfirm"
          >
            OK
          </VBtn>
          <VSpacer />
        </VCardActions>
      </VCard>
    </VDialog>
    <AddEmployeeDrawer
      v-model:isEmployeeDrawerOpen="isAddEmployeeDrawerVisible"
      :employee-data="editEmployeeData"
      @employee-data="addNewEmployee"
    />
  </div>
</template>
