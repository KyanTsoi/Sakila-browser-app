
function getMovies(callback) {
    const movies = [
        { title: "Pulp Fiction" },
        { title: "The Dark Knight" },
        { title: "Inception" },
        { title: "Interstellar" },
    ];

    setTimeout(
    callback(movies), 1000
  )
}

module.exports = { getMovies };