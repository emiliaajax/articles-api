// Implemented with the help of ChatGPT from instructions by me. 
// The code has been modified by me.

import axios from 'axios'
import { promises as fs } from 'fs'

const API_URL = 'http://localhost:5012/api/v1'

async function registerUsers() {
  try {
    const data = await fs.readFile('resources/users.json')
    const users = JSON.parse(data)

    for (const user of users) {
      try {
        await axios.post(`${API_URL}/users/register`, user)
        console.log(`Registered user with username ${user.username} and email ${user.email}`)
      } catch (error) {
        console.error(`Error registering user ${user.username}: ${error.message}`)
      }
    }
  } catch (error) {
    console.error(`Error reading file: ${error.message}`)
  }
}

registerUsers()
