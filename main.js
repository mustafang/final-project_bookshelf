const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
const completeBookshelfList = document.getElementById('completeBookshelfList');

    let books = [];
    const STORAGE_KEY = "BOOKS_APPS";
    const SAVED_EVENT = "saved-books";

    console.log("Bookshelf Apps");

    if (typeof Storage !== 'undefined') {
    if (localStorage.getItem(STORAGE_KEY) === null) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
}

    const bookSubmit = document.querySelector('#bookSubmit');
    const bookForm = document.getElementById('inputBook');

    bookSubmit.addEventListener('click', function (event) {
        event.preventDefault();
        if (validateInput()) {
        const id = +new Date();
        const title = document.getElementById('inputBookTitle').value;
        const author = document.getElementById('inputBookAuthor').value;
        const year = Number(document.getElementById('inputBookYear').value);
        const isComplete = document.getElementById('inputBookIsComplete').checked;

        const newBook = {
            id,
            title,
            author,
            year,
            isComplete,
        };

        if (confirm(`Apakah Anda yakin ingin menambahkan buku "${title}"?`)) {
            addBook(newBook);
            clearInputFields();
        }
        }
    });

    function addBook(book) {
      books.push(book);
      saveBooks();
      renderBooks();
    }

    function validateInput() {
        const title = document.getElementById('inputBookTitle').value;
        if (!title.trim()) {
            alert('Judul harus diisi');
            return false;
        }
        return true;
    }

    function deleteBook(book) {
      const index = books.findIndex(b => b.id === book.id);
      if (index !== -1) {
        books.splice(index, 1);
        saveBooks();
        renderBooks();
      }
    }

    function isStorageExist() {
        if (typeof (Storage) === undefined) {
            alert('Browser tidak mendukung local storage');
            return false;
        }
        return true;
    }

    function saveBooks() {
        if (isStorageExist()) {
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    function renderBooks() {
      renderBookList(books.filter(book => !book.isComplete), incompleteBookshelfList);
      renderBookList(books.filter(book => book.isComplete), completeBookshelfList);
    }

    function renderBookList(bookList, targetElement) {
      targetElement.innerHTML = '';
      for (const book of bookList) {
        const bookItem = createBookItem(book);
        targetElement.appendChild(bookItem);
      }
    }

    function createBookItem(book) {
      const bookItem = document.createElement('article');
      bookItem.classList.add('book_item');
      bookItem.setAttribute('data-id', book.id);

      const bookTitle = document.createElement('h3');
      bookTitle.textContent = book.title;
      bookItem.appendChild(bookTitle);

      const bookAuthor = document.createElement('p');
      bookAuthor.textContent = `Penulis: ${book.author}`;
      bookItem.appendChild(bookAuthor);

      const bookYear = document.createElement('p');
      bookYear.textContent = `Tahun: ${book.year}`;
      bookItem.appendChild(bookYear);

      const action = document.createElement('div');
      action.classList.add('action');
      bookItem.appendChild(action);
      
      const greenButton = document.createElement('button');
      greenButton.classList.add('green');
      greenButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
      greenButton.addEventListener('click', function () {
        toggleBookStatus(book);
      });
      
      action.appendChild(greenButton);
      
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('red');
      deleteButton.textContent = 'Hapus buku';
      deleteButton.addEventListener('click', function () {
        if (confirm(`Apakah Anda yakin ingin menghapus buku "${book.title}"?`)) {
          deleteBook(book);
        }
      });
      
      action.appendChild(deleteButton);
      
      return bookItem;
    }

    function toggleBookStatus(book) {
      book.isComplete = !book.isComplete;
      saveBooks();
      renderBooks();
    }

    function clearInputFields() {
        bookForm.reset();
      document.getElementById('inputBookTitle').value = '';
      document.getElementById('inputBookAuthor').value = '';
      document.getElementById('inputBookYear').value = '';
      document.getElementById('inputBookIsComplete').checked = false;
    }
    
    function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData !== null) {
        const data = JSON.parse(serializedData);
        for (const book of data) {
            const bookItem = createBookItem(book);
            if (book.isComplete) {
                completeBookshelfList.appendChild(bookItem);
            } else {
                incompleteBookshelfList.appendChild(bookItem);
            }
        }
      }
     saveBooks();
    }

    function loadBooks() {
      const storedBooks = localStorage.getItem(STORAGE_KEY);
      if (storedBooks) {
        try {
          books = JSON.parse(storedBooks);
        } catch (error) {
          console.error('Error:', error);
        }
      }
     renderBooks();
    }

    document.addEventListener('DOMContentLoaded', function () {
      loadBooks();
  });