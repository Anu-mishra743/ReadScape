const API_URL = "https://www.googleapis.com/books/v1/volumes?q=";

const booksContainer = document.getElementById("booksContainer");
const loading = document.getElementById("loading");

// Load saved theme
window.onload = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
};

// Search books
async function searchBooks() {
  const query = document.getElementById("searchInput").value.trim();

  if (!query) {
    alert("Please enter a search term");
    return;
  }

  booksContainer.innerHTML = "";
  loading.classList.remove("hidden");

  try {
    const response = await fetch(API_URL + query);
    const data = await response.json();

    displayBooks(data.items);
  } catch (error) {
    booksContainer.innerHTML = "<p>Error fetching data</p>";
  }

  loading.classList.add("hidden");
}

// Display books
function displayBooks(books) {
  if (!books || books.length === 0) {
    booksContainer.innerHTML = "<p>No results found</p>";
    return;
  }

  booksContainer.innerHTML = books.map(book => {
    const info = book.volumeInfo;

    return `
      <div class="book-card">
        <img src="${info.imageLinks?.thumbnail || ''}" alt="book"/>
        <h3>${info.title}</h3>
        <p><strong>Author:</strong> ${info.authors?.join(", ") || "N/A"}</p>
        <p><strong>Published:</strong> ${info.publishedDate || "N/A"}</p>
      </div>
    `;
  }).join("");
}

// Toggle Dark Mode
function toggleTheme() {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}