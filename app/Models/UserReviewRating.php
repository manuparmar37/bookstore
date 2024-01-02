<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserReviewRating extends Model
{
    protected $fillable = ['user_id', 'book_id', 'review', 'rating'];
    use HasFactory;
}
