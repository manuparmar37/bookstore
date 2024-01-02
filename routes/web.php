<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::group(['prefix' => '', 'middleware' => ['auth']], function () {
    Route::get('/home', [AdminController::class, 'showBooks'])->name('home');
    Route::get('/dashboard', [AdminController::class, 'showBooks'])->name('dashboard');
    Route::get('/index', [AdminController::class, 'showBooks'])->name('index');
    Route::get('/user', [AdminController::class, 'showBooks'])->name('user');
    Route::get('/logout', [AdminController::class, 'logout'])->name('logout');
    Route::get('/book_list', [AdminController::class, 'bookList'])->name('book_list');
    Route::get('/books', [AdminController::class, 'showBooks'])->name('showBooks');
    Route::post('/updateBookDetails', [AdminController::class, 'updateBookDetails'])->name('updateBookDetails');
    Route::post('/deleteBook', [AdminController::class, 'deleteBook'])->name('deleteBook');
    Route::post('/order_book', [AdminController::class, 'orderBook'])->name('orderBook');
    Route::match(['get', 'post'], 'bookListing',[AdminController::class,'bookListing'])->name('bookListing');
});