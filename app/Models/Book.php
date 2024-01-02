<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = ['title','author_id','isbn','genre_id','price','quantity_in_stock', 'discount_percentage'];
    const BOOK_EDITABLES = ['title','author_id','isbn','genre_id','price','quantity_in_stock', 'discount_percentage'];
    use HasFactory;
}
