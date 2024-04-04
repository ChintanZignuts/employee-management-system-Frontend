import axios from '../axiosConfig'


export const useCompanyStore = defineStore('companyApi', () => {
  const companies= ref([])
  const company= ref(null)
  const loading= ref(false)
  const error= ref(null)
  const token=localStorage.getItem('token')
  async function fetchCompanies() {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await axios.get('/companies', config)

      companies.value = response.data.data
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
  }

  async function fetchCompany(companyId) {
    try {
      const response = await axios.get(`/api/companies/${companyId}`)

      store.company = response.data
    } catch (error) {
      console.error('Error fetching company:', error)
    }
  }

  async function createCompany(companyData) {
    try {
      const response = await axios.post('/api/companies', companyData)
      
      return response.data.data
    } catch (error) {
      console.error('Error creating company:', error)
      throw error
    }
  }

  async function updateCompany(companyId, companyData) {
    try {
      const response = await axios.put(`/api/companies/${companyId}`, companyData)
      
      return response.data
    } catch (error) {
      console.error('Error updating company:', error)
      throw error
    }
  }

  async function deleteCompany(companyId, forceDelete = false) {
    try {
      const response = await axios.delete(`/api/companies/${companyId}`, {
        params: { forceDelete },
      })

      
      return response.data
    } catch (error) {
      console.error('Error deleting company:', error)
      throw error
    }
  }

  return {
    companies,
    fetchCompanies,
    fetchCompany,
    createCompany,
    updateCompany,
    deleteCompany,
  }
})
