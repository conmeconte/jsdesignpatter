var Book = function (title, author, genre, pageCount, publisherID, ISBN){
  this.title = title;
  this.author = author;
  this.genre = genre;
  this.pageCount = pageCount;
  this.publisherID = publisherID;
  this.ISBN = ISBN;
};

//Book Factory singleton

var BookFactory = (function(){
  var existingBooks = {};
  return{
    createBook: function(title, author, genre, pageCount, publisherID, ISBN){
      //Find out if a particular book meta-data combination has been created before
      var existingBooks = existingBooks[ISBN];
      if(existingBooks) return existingBooks;
      //if not let's create a new instance of it and store it
      var book = new Book(title, author, genre, pageCount, publisherID, ISBN);
      existingBooks[ISBN] = book;
      return book;
    }
  }
});

//BookRecordManager singleton
var BookRecordManager = (function(){
  var bookRecordDatabase = {};

  return{
    //add a new book into the library system
    addBookRecord: function(id, title, author, genre, pageCount, publisherID, ISBN, checkoutDate, checkoutMember, dueReturnDate, availability){
      var bookFactory = BookFactory();
      var book = bookFactory.createBook(title, author, genre, pageCount, publisherID, ISBN);
      bookRecordDatabase[id] = {
        checkoutMember: checkoutMember,
        checkoutDate: checkoutDate,
        dueReturnDate: dueReturnDate,
        availability: availability,
        book: book
      };
    },
    updateCheckoutStats: function(bookID, newStatus, checkoutDate, checkoutMember, newReturnDate){
      var record = bookRecordDatabase[bookID];
      record.availability = newStatus;
      record.checkoutDate = checkoutDate;
      record.checkoutMember = checkoutMember;
      record.dueReturnDate = newReturnDate;
    },
    extendCheckoutPeriod: function(bookID, newReturnDate){
      if(bookRecordDatabase[bookID]) bookRecordDatabase[bookID].dueReturnDate = newReturnDate;
    },
    isPastDue(bookID){
      const today = new Date();
      return today.getTime() > Date.parse(bookRecordDatabase[bookID].dueReturnDate); 
    }
  }
})