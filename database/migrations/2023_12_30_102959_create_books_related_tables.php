<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBooksRelatedTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('genres')) {
            Schema::create('genres', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->timestamps();
            });
        }
        if (!Schema::hasTable('authors')) {
            Schema::create('authors', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->timestamps();
            });
        }
        if (!Schema::hasTable('books')) {
            Schema::create('books', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->integer('author_id');
                $table->string('isbn')->unique();
                $table->integer('genre_id');
                $table->decimal('price', 8, 2);
                $table->integer('quantity_in_stock')->default(0);
                $table->string('img_src')->default("");
                $table->decimal('discount_percentage', 3, 2)->default(0);
                $table->integer('views')->default(0);
                $table->tinyInteger('is_deleted')->default(0);
                $table->timestamps();
            });
        }
        if (!Schema::hasTable('user_review_rating')) {
            Schema::create('user_review_rating', function (Blueprint $table) {
                $table->id();
                $table->integer('user_id');
                $table->integer('book_id');
                $table->string('review');
                $table->decimal('rating', 1, 1);
                $table->timestamps();
            });
        }
        if (!Schema::hasTable('user_purchases')) {
            Schema::create('user_purchases', function (Blueprint $table) {
                $table->id();
                $table->integer('user_id');
                $table->decimal('book_id');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('genres');
        Schema::dropIfExists('authors');
        Schema::dropIfExists('books');
        Schema::dropIfExists('user_review_rating');
        Schema::dropIfExists('discounts');
        Schema::dropIfExists('user_purchases');
    }
}
