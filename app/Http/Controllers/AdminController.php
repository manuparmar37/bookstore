<?php

namespace App\Http\Controllers;

use App\Mail\OrderEmail;
use App\Models\Book;
use App\Models\Module;
use App\Models\UserPurchase;
use App\Models\UserReviewRating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
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
        $toAddOrUpdate = array_intersect_key($request->all(), array_flip(Book::BOOK_EDITABLES));
        if ($request->hasFile('img_src')) 
        {
            $fileName = 'img_src-' . '-'.date('m-d-Y-His').'.' . $request->file('img_src')->getClientOriginalExtension();
            $request->file('img_src')->move(public_path()."/", $fileName);
            $toAddOrUpdate['img_src'] = $fileName;
        }
        if($edit) {
            Book::where('id', $request->id)->update($toAddOrUpdate);
        } else {
            Book::create($toAddOrUpdate);
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
        ->leftjoin('user_review_ratings', 'user_review_ratings.book_id', 'books.id')
        ->leftjoin('user_purchases', 'user_purchases.book_id', 'books.id')
        ->where(function($q) {
            $q->where('user_purchases.user_id', Auth()->user()->id);
            $q->orWhereNull('user_purchases.user_id');
        })
        ->where('books.quantity_in_stock', '>', 0)
        ->groupBy('books.id')
        ->orderBy(\DB::raw('count(user_purchases.id) + (CASE WHEN count(user_review_ratings.id) = 0 THEN 3 ELSE sum(user_review_ratings.rating) / count(user_review_ratings.id) END)'), 'desc')
        ->where(function($q) use ($request) {
            if(!empty($request->search_title)) {
                $q->where('title', 'like', "%$request->search_title%");
            }
            if(!empty($request->search_author)) {
                $q->where('authors.name', 'like', "%$request->search_author%");
            }
            if(!empty($request->search_genre)) {
                $q->where('genres.name', 'like', "%$request->search_genre%");
            }
        })
        ->get();

        return view('book_show', compact('books', 'request'));
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
        $recipientEmail = 'manuparmar353@gmail.com';
        Mail::to($recipientEmail)->send(new OrderEmail());

        $book->save();
        return redirect()->route('showBooks')->with([
            'message'   => 'Book Ordered Successfully'
        ]);
    }

    public static function submitRatingsAndReviews(Request $request) {
        $validator  =   Validator::make($request->all(), 
            ['bookId' => 'required|numeric', 'bookRating' => 'required|numeric', 'bookReview' => 'required']
        );
        if ($validator->fails()) {
            return redirect()->back()->with(['message' => $validator->getMessageBag()]);
        }
        ['user_id', 'book_id', 'review', 'rating'];
        UserReviewRating::create([
            'user_id' => Auth::user()->id,
            'book_id' => $request->bookId,
            'review' => $request->bookReview,
            'rating' => $request->bookRating,
        ]);
        return redirect()->route('showBooks')->with([
            'message'   => 'Your Rating and Reviews have been saved.'
        ]);
    }
}
