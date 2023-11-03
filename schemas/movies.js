const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'El titulo debe ser un string',
        required_error: 'Titulo requerido'
    }),
    year: z.number().int().positive().min(1900).max(2024),
    director: z.string({
        required_error: 'Director requerido'
    }),
    duration: z.number().positive().int(),
    poster: z.string({
        required_error: 'Poster requerido'
    }).url({
        message: 'URL invalida'
    }),
    rate: z.number().positive().min(0).max(10).default(7).nullish(7),
    genre: z.array(
        z.enum(['Action', 'Crime', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
        {
            required_error: 'Genero requerido requerido',
            required_error: 'El genero debe ser : Action, Adventure, Comedy, Drama, Fantasy, Horror, Thriller, Sci-Fi',
        }
    )

})

function validateMovie(object) {
    return movieSchema.safeParse(object)
}

function validatePartialMovie(object) {
    return movieSchema.partial().safeParse(object)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}