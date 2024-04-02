<script setup>
import { avatarText } from '@/@core/utils/formatters'
import AddNewUserDrawer from '@/views/apps/user/list/AddNewUserDrawer.vue'
import { onMounted, ref } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import axios from '../axiosConfig'

const deleteDialog = ref(false)
const isAddNewUserDrawerVisible = ref(false)
const editCompanyData = ref(null)
const isEditMode = ref(false)
const deleteItemId = ref(null)
const userList = ref([])

// headers
const headers = [
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Email',
    key: 'company_email',
  },
  {
    title: 'Website',
    key: 'website',
  },
  {
    title: 'Status',
    key: 'status',
  },
  {
    title: 'ACTIONS',
    key: 'actions',
  },
]

const resolveStatusVariant = status => {
  if (status === "A")
    return {
      color: 'primary',
      text: 'Active',
    }
  else if (status === "I")
    return {

      color: 'success',
      text: 'Inactive',
    }
  else
    return {
      color: 'info',
      text: 'No status',
    }
}

const openAddNewUserDrawer =async companyData => {
  if (companyData) {
    try {
      const token = localStorage.getItem('token')

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, 
          'content-type': 'multipart/form-data',
        },
      }

      const response = await axios.get(`/companies/${companyData.id}`, config)

      
      editCompanyData.value = response.data
      isEditMode.value = true
      
    } catch (error) {
      console.error('Failed to fetch company details:', error.message)

      // Handle error appropriately, e.g., show error message
    }
  } else {
    
    editCompanyData.value = null
    isEditMode.value = false
    
  }
  isAddNewUserDrawerVisible.value = true
}

const deleteItem = item => {
  console.log(item)
  deleteItemId.value=item
  deleteDialog.value = true
}

const closeDelete = () => {
  deleteDialog.value = false
 
}

const deleteItemConfirm = async () => {
  try {
   
    const token = localStorage.getItem('token')

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    await axios.delete(`/companies/${deleteItemId.value}`, config)

    // Remove the company from the list
    userList.value = userList.value.filter(company => company.id !== deleteItemId.value)
    fetchData()

    // Close the delete dialog
    closeDelete()
  } catch (error) {
    console.error('Failed to delete company:', error.message)
  }
}

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token')

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'multipart/form-data',
      },
    }

    const response = await axios.get('/companies', config)

    userList.value = response.data
  } catch (error) {
    console.error('Failed to fetch company data:', error.message)
  }
}

const addNewUser = async userData => {
  try {
    const token = localStorage.getItem('token')

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    if (isEditMode.value) {
      // Edit mode: send a PUT request to update existing user data
      const response = await axios.put(`/companies/${editCompanyData.value.id}`, userData, config)

     
      console.log('User updated successfully:', response.data)
    } else {
      // Not in edit mode: send a POST request to create a new user
      const response = await axios.post('companies/create', userData, config)

    
      console.log('User created successfully:', response.data)
    }

    // Refetch users after successful update or creation
    fetchData()
    
    // Close the drawer after updating or creating user
    isAddNewUserDrawerVisible.value = false
  } catch (error) {
    console.error('Failed to update or create user:', error.message)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div>
    <!-- 👉 Add user button -->
    <div class="d-flex justify-end ma-3">
      <VBtn
        prepend-icon="tabler-plus"
        @click="openAddNewUserDrawer(null)"
      >
        Add New Company
      </VBtn>
    </div>
    <VDataTable
      :headers="headers"
      :items="userList"
      :items-per-page="10"
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
              v-if="item.raw.avatar"
              :src="item.raw.avatar"
            />
            <span v-else>{{ avatarText(item.raw.name) }}</span>
          </VAvatar>

          <!-- Name and location -->
          <div class="d-flex flex-column ms-3">
            <span class="d-block font-weight-medium text--primary text-truncate">{{ item.raw.name }}</span>
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
        <a
          :href="item.raw.website"
          target="_blank"
          rel="noopener noreferrer"
        ><span>www.{{ item.raw.name }}.com</span></a>
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
          <IconBtn @click="openAddNewUserDrawer(item.raw)">
            <VIcon icon="mdi-pencil-outline" />
          </IconBtn>
          <IconBtn @click="deleteItem(item.raw.id)">
            <VIcon icon="mdi-delete-outline" />
          </IconBtn>
        </div>
      </template>
    </VDataTable>

    <VDialog
      v-model="deleteDialog"
      max-width="500px"
    >
      <VCard>
        <VCardTitle>
          Are you sure you want to delete this item?
        </VCardTitle>

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
    <AddNewUserDrawer
      v-model:isDrawerOpen="isAddNewUserDrawerVisible"
      :company-data="editCompanyData"
      
      @user-data="addNewUser"
    />
  </div>
</template>
