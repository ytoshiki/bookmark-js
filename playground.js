// Set initial object to local storage
const newObj = [{ title: "title", url: "url" }]
localStorage.setItem("bookmark", JSON.stringify(newObj))

// get existing items from local storage and parse it
let bookmarkStorage = localStorage.getItem("bookmark")
bookmarkStorage = JSON.parse(bookmarkStorage)

// Add new Object to the same local storage
const objectAdded = {
  title: "new title",
  url: "new url"
}
localStorage.setItem("bookmark", JSON.stringify(bookmarkStorage.concat(objectAdded)))

// Store current local storage
const newBookmark = JSON.parse(localStorage.getItem("bookmark"))

console.log(newBookmark)
