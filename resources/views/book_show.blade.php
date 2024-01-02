@extends('layouts.app')
@section('content')
    <div class="page-head-wrap">

        <head>
            <style>
                /* Add your styles for tiles here */
                .book-tile {
                    padding: 15px;
                    margin: 10px;
                    text-align: center;
                }

                .book-image {
                    max-width: 100%;
                    height: auto;
                    margin-bottom: 10px;
                    height: 200px;
                }

                .rating-btn {
                    position: absolute;
                    z-index: 2;
                    right: 25px;
                    cursor: pointer;
                }

                .book-tile {
                    /* Your existing styles */

                    /* Add the following styles for hover effects */
                    transition: border-color 0.3s ease-in-out;
                    position: relative;
                    overflow: hidden;
                    border-radius: 20px;
                }

                .book-tile:hover {
                    border: 2px solid #1fa495;
                    /* Change the color as per your design */
                }

                .book-tile .order-now-btn {
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                }

                .book-tile:hover .order-now-btn {
                    opacity: 1;
                }


                body,
                html {
                    font-family: Manrope, sans-serif;
                }
            </style>
        </head>
        <h4 class="margin0">
            Books
        </h4>
    </div>

    <div class="ui-content-body">
        <div class="ui-container">
            @if (Session::has('message'))
                <script>
                    swal('Success', '<?php echo Session::get('message'); ?>', 'success')
                </script>
            @endif
            @if (Session::has('failure'))
                <script>
                    swal('Error', '<?php echo Session::get('failure'); ?>', 'error')
                </script>
            @endif

            <body>
                <form method="POST" action="{{ route('showBooks') }}">
                    {{ csrf_field() }}
                    <nav class="navbar navbar-light bg-light">
                        <div class="col-sm-12">
                            <form class="form-inline mtop-10" style="float:right;">
                                <div class="form-group col-md-2">
                                    <input class="form-control mb-2 mr-sm-2" type="text" name="search_title"
                                        id="search_title" placeholder="Search by title" value="{{$request->search_title}}">
                                </div>
                                <div class="form-group col-md-2">
                                    <input class="form-control mb-2 mr-sm-2" type="text" name="search_author"
                                        id="search_author" placeholder="Search by author" value="{{$request->search_author}}">
                                </div>
                                <div class="form-group col-md-2">
                                    <input class="form-control mb-2 mr-sm-2" type="text" name="search_genre"
                                        id="search_genre" placeholder="Search by genre" value="{{$request->search_genre}}">
                                </div>
                                <div class="form-group col-md-1">
                                    <button type="submit" class="btn btn-success mb-2"
                                        id="search">Search</button>
                                </div>
                                <div class="form-group col-md-1">
                                    <button type="submit" onclick="clearFilters()" class="btn btn-warning mb-2"
                                        id="search">Clear</button>
                                </div>
                            </form>
                        </div>
                    </nav>
                <div class="row col-md-12">
                    @foreach ($books as $index => $book)
                        @if ($index % 5 == 0)
                            <div class="row col-md-12">
                        @endif
                        <div class="book-tile col-md-2">
                            <div aria-hidden="true" data-toggle="modal" data-target="#ratingsAndReviews" onclick="ratingsAndReviews({{$book->id}})"
                                class="rating-btn absolute flex items-center justify-center w-[34px] h-[34px] bg-white rounded-full top-0 xl:-top-2 right-0 xl:-right-2 bookmark z-10">
                                <img src="{{ url('assets/images/bookmark_unfill.7cefa5a4.svg') }}" alt="bookmark-img">
                            </div>
                            <img src="{{ $book->img_src }}" alt="{{ $book->title }}" class="book-image">
                            <div class="bookcontent">
                                <div class="flex flex-col">
                                    <div title="{{ $book->title }}"
                                        class="!text-xs xl:!text-sm !leading-extra-loose ellipsisAfterTwoLine whitespace-normal font-bold tracking-normal text-neutral-800 font-manrope xl:!leading-6 max-w-64">
                                        {{ $book->title }}</div>
                                    <div
                                        class="book_desc_label !leading-extra-loose text-primary-default font-normal text-base tracking-normal font-manrope">
                                        <span>{{ $book->author }}</span>
                                    </div>
                                </div>
                                <div class="flex price_layout !leading-extra-loose">
                                    <div
                                        class="offer_price !leading-extra-loose text-primary-default font-normal text-base tracking-normal font-manrope">
                                        <span>₹{{ $book->price * (1 - $book->discount_percentage / 100) }}</span>
                                    </div>
                                </div>
                                @if ($book->discount_percentage != 0)
                                    <div class="flex price_layout !leading-extra-loose"
                                        style="text-decoration: line-through;">
                                        <div
                                            class="offer_price !leading-extra-loose text-primary-default font-normal text-base tracking-normal font-manrope">
                                            <span>₹{{ $book->price }}</span>
                                        </div>
                                    </div>
                                @endif
                                <form method="POST" action="{{ route('orderBook') }}">
                                    {{ csrf_field() }}
                                    <input type="hidden" name="id" value="{{ $book->id }}">
                                    <button type="submit" class="order-now-btn btn btn-success mb-2" id="order_now"
                                        style="margin-top: 5px;">Order Now</button>
                                </form>
                            </div>
                        </div>
                        @if ($index % 5 == 4)
                </div>
                @endif
                @endforeach
        </div>
        </body>
    </div>
    </div>
@endsection

<div class="modal fade" id="ratingsAndReviews" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
    aria-hidden="true" style="margin-top: 200px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="booksEditModalLabel">Book Ratings and Reviews</h4>
            </div>

            <!-- Modal Body -->
            <div class="modal-body">
                <!-- Form for Ratings and Reviews -->
                <form id="ratingsAndReviewsForm" method="POST" action="{{ route('submitRatingsAndReviews') }}">
                    {{ csrf_field() }}
                    <!-- Rating Input (You can use a rating library or custom input) -->
                    <input type="hidden" name="bookId" id="bookId">
                    <div class="form-group">
                        <label for="bookRating">Rating:</label>
                        <input type="number" class="form-control" id="bookRating" name="bookRating" min="1" max="5" step="1" onkeyup="maxMinV()">
                    </div>

                    <!-- Review Textarea -->
                    <div class="form-group">
                        <label for="bookReview">Review:</label>
                        <textarea class="form-control" id="bookReview" name="bookReview" rows="4"></textarea>
                    </div>

                    <!-- Additional Fields or Controls as needed -->

                    <!-- Buttons for submission and closing the modal -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    function maxMinV() {
        $('#bookRating').val( $('#bookRating').val() > 5 ? 5 : ($('#bookRating').val() < 1) ? 1 : $('#bookRating').val());
    }
    function ratingsAndReviews(bookId) {
        $('#bookId').val(bookId);
    }
    function clearFilters() {
        $('#search_title').val('');
        $('#search_author').val('');
        $('#search_genre').val('');
        return true;
    }
</script>


