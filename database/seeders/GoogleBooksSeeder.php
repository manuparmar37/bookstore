<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;

class GoogleBooksSeeder extends Seeder
{
    public function run()
    {
        $client = new Client();
        $apiKey = env('GOOGLE_BOOKS_API_KEY');
        $totalBooksToFetch = 200;
        $booksPerPage = 40;
        $totalPages = ceil($totalBooksToFetch / $booksPerPage);

        for ($page = 0; $page < $totalPages; $page++) {
            $startIndex = $page * $booksPerPage;

            // Fetch book data for the current page
            $response = $client->get("https://www.googleapis.com/books/v1/volumes?q=subject:fiction&startIndex=$startIndex&maxResults=$booksPerPage&key=$apiKey");
            $books = json_decode($response->getBody()->getContents(), true);

            // Seed genres
            foreach ($books['items'] as $book) {
                $genres = $book['volumeInfo']['categories'] ?? ['Uncategorized'];
                foreach ($genres as $genre) {
                    DB::table('genres')->updateOrInsert(['name' => $genre]);
                }
            }

            // Seed authors and books
            foreach ($books['items'] as $book) {
                $authors = $book['volumeInfo']['authors'] ?? ['Unknown Author'];
                $title = $book['volumeInfo']['title'];
                $isbn = $book['volumeInfo']['industryIdentifiers'][0]['identifier'] ?? mt_rand(1000000000, 9999999999);
                $imageUrl = $book['volumeInfo']['imageLinks']['thumbnail'] ?? "";
                $price = rand(10, 100);

                foreach ($authors as $author) {
                    try {
                        DB::table('authors')->updateOrInsert(['name' => $author]);
                        $authorId = DB::table('authors')->where('name', $author)->first()->id;
                        DB::table('books')->updateOrInsert([
                            'title' => $title,
                            'author_id' => $authorId,
                            'isbn' => $isbn,
                            'genre_id' => DB::table('genres')->where('name', $book['volumeInfo']['categories'][0] ?? 'Uncategorized')->first()->id,
                            'price' => $price,
                            'quantity_in_stock' => rand(0, 100),
                            'img_src' => $imageUrl,
                            'is_deleted' => 0,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    } catch(Exception $e) {
                        \Log::info($e->getMessage());
                    }
                }
            }
        }
    }
}
