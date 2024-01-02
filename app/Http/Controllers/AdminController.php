<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Module;
use App\Models\UserPurchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Session;

class AdminController extends Controller
{
    public static function index(Request $request) {
        $module = $request->module;
        switch($module) {
            case 'admin_books_list':
                return self::bookList($request);
                break;
        }
    }
    public static function getEncodedKey()
    {
        $datasession    =   Session::all();
        $session_token  =   $datasession['_token'];
        $key            =   base64_encode('<key>admin<key>' . $session_token);
        return $key;
    }

    public function logout(Request $request) {
        \Auth::logout();
        return redirect()->route('login')->with([
            'message'   =>  'Logged out successfully !'
        ]);
    }
    public static function bookList(Request $request) {
        return view('book_list');
    }
    
    public function bookListing(Request $request) {
        $draw = $request->get('draw');
        $start = $request->get("start") !== null ? $request->get("start") : 0;
        $rowperpage = $request->get("length") !== null ? $request->get("length") : 20;
        $totalBooksCount = Book::count();
        $books = Book::select('books.id', 'title', 'isbn', 'genres.name as genre', 'authors.name as author', 'price', 'quantity_in_stock', 'genres.id as genre_id', 'authors.id as author_id', 'books.discount_percentage')
                    ->join('genres', 'genres.id', 'books.genre_id')
                    ->join('authors', 'authors.id', 'books.author_id')
                    ->skip($start)
                    ->take($rowperpage)
                    ->get();
        foreach($books as $book) {
            $link = '<a href="#" data-toggle="modal" data-target="#updateBookData" class="btn btn-sm btn-success" title="Edit" onclick="updateBookData('.htmlspecialchars(json_encode($book), ENT_QUOTES, 'UTF-8').')" >Edit</a> ';
            $link .= '<form method="POST" action="'.route('deleteBook').'" style="display:inline" onsubmit="return deleteBook('.$book->id.')">'.csrf_field().' <input type="hidden" name="id" value="'.$book->id.'"> <button type="submit" class="btn btn-sm btn-success" title="Delete">Delete</button> </form>';
            $book->action = $link;
        }
        $response = array(
	        "draw" => $draw,
	        "iTotalRecords" => $totalBooksCount,
	        "iTotalDisplayRecords" => $totalBooksCount,
	        "aaData" => $books,
	    );
        return json_encode($response);
    }

    public static function get_module_detail($id, $column)
    {
        $module =   Module::where('id', '=', $id)->first();
        // dd($module->count());
        if ($module->count() > 0) {
            return $module->$column;
        }
    }

    public static function updateBookDetails(Request $request) {
        $edit = !empty($request->id);
        $validator  =   Validator::make($request->all(), 
            ['genre_id' => 'required|numeric', 'author_id' => 'required|numeric']
        );
        if ($validator->fails()) {
            return redirect()->back()->with(['message' => $validator->getMessageBag()]);
        }
        if($edit) {
            Book::where('id', $request->id)->update(array_intersect_key($request->all(), array_flip(Book::BOOK_EDITABLES)));
        } else {
            Book::create(array_intersect_key($request->all(), array_flip(Book::BOOK_EDITABLES)));
        }
        return redirect()->back()->with([
            'message'   =>  $edit ? 'Book Details Updated Successfully' : 'New Book Added Successfully'
        ]);
    }

    public static function deleteBook(Request $request) {
        return redirect()->back()->with([
            'message'   => Book::where('id', $request->id)->delete() ? 'Book Deleted Successfully' : 'Could not delete'
        ]);
    }

    public static function showBooks(Request $request) {
        $books = Book::select('books.id', 'title', 'isbn', 'genres.name as genre', 'authors.name as author', 'price', 'quantity_in_stock', 'genres.id as genre_id', 'authors.id as author_id', 'books.img_src', 'books.discount_percentage')
        ->join('genres', 'genres.id', 'books.genre_id')
        ->join('authors', 'authors.id', 'books.author_id')
        ->where('books.quantity_in_stock', '>', 0)
        ->get();

        return view('book_show', compact('books'));
    }

    public static function orderBook(Request $request) {
        $book = Book::where('id', $request->id)->first();
        if(!empty($book->quantity_in_stock) && $book->quantity_in_stock > 0) {
            $book->quantity_in_stock -= 1;
        } else {
            return redirect()->route('showBooks')->with([
                'message'   => 'Book not available in stock'
            ]);
        }
        UserPurchase::create([
            'user_id' => Auth::user()->id,
            'book_id' => $request->id,
        ]);
        $book->save();
        return redirect()->route('showBooks')->with([
            'message'   => 'Book Ordered Successfully'
        ]);
    }

}
