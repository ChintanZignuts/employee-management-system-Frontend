import axios from '../axiosConfig'

export async function getUserType() {
  try {
    const response = await axios.get('/user')

    // Assuming 'type' is the field containing user type
    return response.data.user.type
  } catch (error) {
    console.error('Error fetching user type:', error)
    
    return null
  }
}
