const express = require("express");
const app = express();
const port = 3000;

const fs = require("node:fs");
const path = require("node:path");

const dosyaYolu = path.join(__dirname, "books.json");

// Middleware to parse JSON badies
app.use(express.json());

//-----------------------------------------------------------------------------
//read write
const dosyaOku = () => {
  const jsonData = fs.readFileSync(dosyaYolu, "utf8");
  return JSON.parse(jsonData);
};

const dosyaYaz = (books) => {
  fs.writeFileSync(dosyaYolu, JSON.stringify(books, null, 2), "utf-8");
};
//------------------------------------------------------------------------------

//GET  /books -> hepsi
app.get("/books", (req, res) => {
  const books = dosyaOku();
  res.json(books);
});

//GET /books:id
app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const books = dosyaOku();
  const book = books.find((b) => b.id === id);
  if (!book) {
    return res.status(404).json({ message: "Kitap Bulunamadi" });
  }
  res.json(book);
});

//POST books -> yeni litap ekle
app.post("/books", (req, res) => {
  const books = dosyaOku();

  const yeniKitap = req.body;
  //yeni id = son id + 1
  const sonId = books.length > 0 ? books[books.length - 1].id : 0;
  yeniKitap.id = sonId + 1;

  books.push(yeniKitap);
  dosyaYaz(books);
  res.status(201).json(yeniKitap);
});

// PUT /books/:id -> guncelle
app.put("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const books = dosyaOku();

  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Kitap Bulunamadi" });
  }

  books[index] = { ...books[index], ...req.body, id };

  dosyaYaz(books);
  res.json(books[index]);
});

//DELETE /books//:id -> sil
app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const books = dosyaOku();

  const yeniListe = books.filter((b) => b.id !== id);

  if (yeniListe.length === books.length) {
    return res.status(404).json({ message: "Kitap Bulunamadi" });
  }

  dosyaYaz(yeniListe);
  res.json({ message: "Kitap Silindi" });
});

app.listen(port, () => {
  console.log(`Server ${port} portun'da Calisiyor!`);
});
