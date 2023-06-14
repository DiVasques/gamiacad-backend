import app from "./app"

const PORT = process.env.SERVER_PORT

app.listen(PORT, () => {
    console.log(`[server]: Server up and running on http://localhost:${PORT}`)
})