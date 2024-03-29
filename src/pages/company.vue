<script setup>
import { avatarText } from '@/@core/utils/formatters'
import AddNewUserDrawer from '@/views/apps/user/list/AddNewUserDrawer.vue'
import { onMounted, ref } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import axios from '../axiosConfig'

const deleteDialog = ref(false)
const isAddNewUserDrawerVisible = ref(false)

const defaultItem = ref({
  responsive_id: '',
  id: -1,
  avatar: '',
  full_name: '',
  post: '',
  email: '',
  city: '',
  start_date: '',
  salary: -1,
  age: '',
  experience: '',
  status: -1,
})

const data = [
  {
    responsive_id: '',
    id: 95,
    avatar: '',
    full_name: 'Edwina Ebsworth',
    post: 'Human Resources Assistant',
    email: 'eebsworth2m@sbwire.com',
    city: 'Puzi',
    start_date: '09/27/2018',
    salary: 19586.23,
    age: '27',
    experience: '2 Years',
    status: 1,
  },
  {
    responsive_id: '',
    id: 1,
    avatar: '',
    full_name: 'Korrie O\'Crevy',
    post: 'Nuclear Power Engineer',
    email: 'kocrevy0@thetimes.co.uk',
    city: 'Krasnosilka',
    start_date: '09/23/2016',
    salary: 23896.35,
    age: '61',
    experience: '1 Year',
    status: 2,
  },
  {
    responsive_id: '',
    id: 7,
    avatar: '',
    full_name: 'Eileen Diehn',
    post: 'Environmental Specialist',
    email: 'ediehn6@163.com',
    city: 'Lampuyang',
    start_date: '10/15/2017',
    salary: 18991.67,
    age: '59',
    experience: '9 Years',
    status: 3,
  },
  {
    responsive_id: '',
    id: 11,
    avatar: '',
    full_name: 'De Falloon',
    post: 'Sales Representative',
    email: 'dfalloona@ifeng.com',
    city: 'Colima',
    start_date: '06/12/2018',
    salary: 19252.12,
    age: '30',
    experience: '0 Year',
    status: 4,
  },
  {
    responsive_id: '',
    id: 3,
    avatar: '',
    full_name: 'Stella Ganderton',
    post: 'Operator',
    email: 'sganderton2@tuttocitta.it',
    city: 'Golcowa',
    start_date: '03/24/2018',
    salary: 13076.28,
    age: '66',
    experience: '6 Years',
    status: 5,
  },
  {
    responsive_id: '',
    id: 5,
    avatar: '',
    full_name: 'Harmonia Nisius',
    post: 'Senior Cost Accountant',
    email: 'hnisius4@gnu.org',
    city: 'Lucan',
    start_date: '08/25/2017',
    salary: 10909.52,
    age: '33',
    experience: '3 Years',
    status: 2,
  },
  {
    responsive_id: '',
    id: 6,
    avatar: '',
    full_name: 'Genevra Honeywood',
    post: 'Geologist',
    email: 'ghoneywood5@narod.ru',
    city: 'Maofan',
    start_date: '06/01/2017',
    salary: 17803.8,
    age: '61',
    experience: '1 Year',
    status: 1,
  },
  {
    responsive_id: '',
    id: 4,
    avatar: '',
    full_name: 'Dorolice Crossman',
    post: 'Cost Accountant',
    email: 'dcrossman3@google.co.jp',
    city: 'Paquera',
    start_date: '12/03/2017',
    salary: 12336.17,
    age: '22',
    experience: '2 Years',
    status: 2,
  },
  {
    responsive_id: '',
    id: 8,
    avatar: '',
    full_name: 'Richardo Aldren',
    post: 'Senior Sales Associate',
    email: 'raldren7@mtv.com',
    city: 'Skoghall',
    start_date: '11/05/2016',
    salary: 19230.13,
    age: '55',
    experience: '5 Years',
    status: 3,
  },
  {
    responsive_id: '',
    id: 9,
    avatar: '',
    full_name: 'Allyson Moakler',
    post: 'Safety Technician',
    email: 'amoakler8@shareasale.com',
    city: 'Mogilany',
    start_date: '12/29/2018',
    salary: 11677.32,
    age: '39',
    experience: '9 Years',
    status: 5,
  },
]

const userList = ref([])

// status options
const selectedOptions = [
  {
    text: 'Current',
    value: 1,
  },
  {
    text: 'Professional',
    value: 2,
  },
  {
    text: 'Rejected',
    value: 3,
  },
  {
    text: 'Resigned',
    value: 4,
  },
  {
    text: 'Applied',
    value: 5,
  },
]

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
    title: 'ACTIONS',
    key: 'actions',
  },
]

const resolveStatusVariant = status => {
  if (status === 1)
    return {
      color: 'primary',
      text: 'Current',
    }
  else if (status === 2)
    return {
      color: 'success',
      text: 'Professional',
    }
  else if (status === 3)
    return {
      color: 'error',
      text: 'Rejected',
    }
  else if (status === 4)
    return {
      color: 'warning',
      text: 'Resigned',
    }
  else
    return {
      color: 'info',
      text: 'Applied',
    }
}



const deleteItem = item => {
  editedIndex.value = userList.value.indexOf(item)
  editedItem.value = { ...item }
  deleteDialog.value = true
}

const closeDelete = () => {
  deleteDialog.value = false
  editedIndex.value = -1
  editedItem.value = { ...defaultItem.value }
}

const deleteItemConfirm = () => {
  userList.value.splice(editedIndex.value, 1)
  closeDelete()
}

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token')

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.get('/companies', config)

    userList.value = response.data
  } catch (error) {
    console.error('Failed to fetch company data:', error.message)
  }
}

const addNewUser = userData => {
  userListStore.addUser(userData)

  // refetch User
  fetchUsers()
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
        @click="isAddNewUserDrawerVisible = true"
      >
        Add New Company
      </VBtn>
    </div>
    <VDataTable
      :headers="headers"
      :items="userList"
      :items-per-page="5"
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
        ><span>www.{{ item.raw.name }}.com</span></a>
      </template>

      <!-- Actions column (not included in original code) -->
      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <IconBtn @click="editItem(item.raw)">
            <VIcon icon="mdi-pencil-outline" />
          </IconBtn>
          <IconBtn @click="deleteItem(item.raw)">
            <VIcon icon="mdi-delete-outline" />
          </IconBtn>
        </div>
      </template>
    </VDataTable>

    <!-- Delete dialog -->
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
      @user-data="addNewUser"
    />
  </div>
</template>
