import app from '@/app'
import makeDb from '@/config/dbConnect'

const PORT = process.env.SERVER_PORT

app.listen(PORT, async () => {
    try {
      await makeDb()
  
      console.info(`⚡️[server]: Server is running at http://localhost:${PORT}`)
    } catch (error) {
      console.error(`⚡️[server]: Failed to start server! ${error}`)
      process.exit(500)
    }
})