// 🌐 API URL
const API_URL = "https://www.googleapis.com/books/v1/volumes?q=";

// 📦 DOM Elements
const booksContainer = document.getElementById("booksContainer");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("searchInput");
const welcomeSection = document.getElementById("welcome");

// 📚 Global Data
let allBooks = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


// ============================
// 🚀 INITIAL LOAD
// ============================

window.onload = () => {
  loadTheme();
  loadDefaultBooks(); // 🔥 NEW
};


// ============================
// 📚 LOAD DEFAULT BOOKS
// ============================

async function loadDefaultBooks() {
  showLoading(true);

  try {
    // Fetch multiple categories
    const queries = ["fiction", "technology", "romance", "history"];

    const responses = await Promise.all(
      queries.map(query => fetch(API_URL + query))
    );

    const data = await Promise.all(
      responses.map(res => res.json())
    );

    // Combine all books
    allBooks = data.flatMap(d => d.items || []);

    displayBooks(allBooks);

  } catch (error) {
    showError("Failed to load books");
  } finally {
    showLoading(false);
  }
}
console.log("Hiding loader");
showLoading(false);


// ============================
// 🌙 THEME
// ============================

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}


// ============================
// 🔍 SEARCH
// ============================

async function searchBooks() {
  const query = searchInput.value.trim();

  if (query === "") {
    alert("Please enter a search term");
    return;
  }

  welcomeSection.style.display = "none"; // hide welcome

  showLoading(true);

  try {
    const response = await fetch(API_URL + query);
    const data = await response.json();

    allBooks = data.items ? data.items : [];

    displayBooks(allBooks);

  } catch (error) {
    showError("Error fetching data");
  } finally {
    showLoading(false);
  }
}


// ============================
// 📚 DISPLAY
// ============================

function displayBooks(books) {
  if (!books || books.length === 0) {
    booksContainer.innerHTML = "<p>No results found</p>";
    return;
  }

  const bookCards = books.map(book => createBookCard(book));
  booksContainer.innerHTML = bookCards.join("");
}


// ============================
// 🧱 CARD
// ============================

function createBookCard(book) {
  const info = book.volumeInfo || {};

  const title = info.title || "No Title";
  const authors = info.authors ? info.authors.join(", ") : "N/A";
  const published = info.publishedDate || "N/A";

  const thumbnail =
    info.imageLinks?.thumbnail ||
    "https://via.placeholder.com/150";

  const isFavorite = favorites.includes(title);

  return `
    <div class="book-card">
      <img src="${thumbnail}" alt="book"/>
      <h3>${title}</h3>
      <p><strong>Author:</strong> ${authors}</p>
      <p><strong>Published:</strong> ${published}</p>

      <button onclick="toggleFavorite('${title}')">
        ${isFavorite ? "💔 Remove" : "❤️ Favorite"}
      </button>
    </div>
  `;
}


// ============================
// ⭐ FAVORITES
// ============================

function toggleFavorite(title) {
  if (favorites.includes(title)) {
    favorites = favorites.filter(item => item !== title);
  } else {
    favorites.push(title);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayBooks(allBooks);
}

function showFavorites() {
  const favBooks = allBooks.filter(book =>
    favorites.includes(book.volumeInfo.title)
  );

  displayBooks(favBooks);
}


// ============================
// 🔽 SORT
// ============================

function sortBooks() {
  const sorted = [...allBooks].sort((a, b) =>
    (a.volumeInfo.title || "").localeCompare(b.volumeInfo.title || "")
  );

  displayBooks(sorted);
}


// ============================
// 🎯 FILTER
// ============================

function filterBooks() {
  const filtered = allBooks.filter(book =>
    book.volumeInfo.authors && book.volumeInfo.authors.length > 0
  );

  displayBooks(filtered);
}


// ============================
// ⚙️ HELPERS
// ============================

function showLoading(isLoading) {
  if (isLoading) {
    loading.style.display = "block";
  } else {
    loading.style.display = "none";
  }
}

function showError(msg) {
  booksContainer.innerHTML = `<p>${msg}</p>`;
}