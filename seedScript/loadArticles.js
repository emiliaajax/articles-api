// Implemented with the help of ChatGPT from instructions by me. 
// The code has been modified by me.

import axios from 'axios'
import { promises as fs } from 'fs'

const API_URL = 'http://localhost:5012/api/v1'

async function createArticles() {
  try {
    const data = await fs.readFile('resources/users.json')
    const users = JSON.parse(data)

    for (const user of users) {
      try {
        const loginResponse = await axios.post(`${API_URL}/users/login`, {
          email: user.email,
          password: user.password
        })

        const accessToken = loginResponse.data.accessToken;
        const headers = { Authorization: `Bearer ${accessToken}` }

        const articlesData = await fs.readFile('resources/articles.json')
        const articles = JSON.parse(articlesData);

        for (let i = 0; i < 3; i++) {
          const article = articles[Math.floor(Math.random() * articles.length)]

          const response = await axios.post(`${API_URL}/articles`, {
            title: article.title,
            category: article.category,
            text: article.text
          }, { headers })

          console.log(`Created article ${response.data.article.id} for user ${user.username}`)
        }
      } catch (error) {
        console.error(`Error creating articles for user ${user.username}: ${error.message}`)
      }
    }
  } catch (error) {
    console.error(`Error reading file: ${error.message}`)
  }
}

createArticles()
