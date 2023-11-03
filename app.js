const express = require('express') // require -> commonJS
const crypto = require('node:crypto')


const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')


const app = express()
app.disable('x-powered-by')

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'Hola, comenzando con la clase 3' })
})

app.get('/movies', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const { genre, year, rate } = req.query

    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    if (year) {
        const filteredYear = movies.filter(
            movie => movie.year == year)
        return res.json(filteredYear)
    }
    if (rate) {
        const filteredRate = movies.filter(
            movie => movie.rate == rate)
        return res.json(filteredRate)
    }
    res.json(movies)
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'NO ESTA' })
})

app.post('/movies', (req, res) => {

    const result = validateMovie(req.body)

    if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = {
        id: crypto.randomUUID(), //uuid v4
        ...result.data
    }

    movies.push(newMovie)

    res.status(201).json(newMovie)
})


app.patch('/movies/:id', (req, res) => {

    const result = validatePartialMovie(req.body)

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex == -1) {
        return res.status(404).json({ message: 'Pelicula no ecnontrada' })
    }


    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie
    return res.json(updateMovie)
})


const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`SERVIDOR PRENDIDO, ESCUCHANDO EN PUERTO http://localhost:${PORT}`)
})

