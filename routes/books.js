const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Author = require('../models/author');
const Book = require('../models/book');

const imageMimeTypes = ['image/jpeg','image/gif','image/png'];

//For all the books
router.get('/',async(req,res)=>{

  let query = Book.find();
  if(req.query.title!=null && req.query.title!=' ')
  {
      query = query.regex('title', new RegExp(req.query.title,'i'));
  }
  if(req.query.publishedBefore!=null && req.query.publishedBefore!='')
  {
      query = query.lte('publishDate', new RegExp(req.query.publishedBefore));
  }
  if(req.query.publishedAfter!=null && req.query.publishedAfter!='')
  {
      query = query.gte('publishDate', new RegExp(req.query.publishedAfter));
  }
    try{

      const books = await query.exec();
      res.render('books/index',{
      books:books,
      searchOptions:req.query
    });
    }catch{
      res.redirect('/');
    }
})

//For New book
router.get('/new',async(req,res)=>{
    renderNewPage(res, new Book());
})

//For Creating New Book
router.post('/',async(req,res)=>{

    const book = new Book(
    {
        title:req.body.title,
        pageCount: parseInt(req.body.pageCount),
        publishDate: new Date(req.body.publishDate),
        description:req.body.description,
        author:req.body.author
    });
    saveCover(book,req.body.cover);
    try{
        const newBook = await book.save();
        //res.redirect(`/books/${newBook.id}`);
        res.redirect('books');
    }catch{
        renderNewPage(res, book, true);
    }
})

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if (hasError) params.errorMessage = 'Error Creating Book';
    res.render('books/new', params)
  } catch {
    res.redirect('books')
  }
}

function saveCover(book,coverEncoded) {
  if(coverEncoded==null) return;
  const cover = JSON.parse(coverEncoded);
  if(cover!=null && imageMimeTypes.includes(cover.type)){
    book.coverImage = new Buffer.from(cover.data,'base64');
    book.coverImageType = cover.type;
  }
}
module.exports = router;