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
                    border: 2px solid #1fa495; /* Change the color as per your design */
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
            @if(Session::has('message'))
            <script>swal('Success', '<?php echo Session::get("message"); ?>', 'success')</script>
            @endif
            @if(Session::has('failure'))
                <script>swal('Error', '<?php echo Session::get("failure"); ?>', 'error')</script>
            @endif
            <body>
                <div class="row col-md-12">
                    @foreach ($books as $index => $book)
                        @if ($index % 5 == 0)
                            <div class="row col-md-12">
                        @endif
                        <div class="book-tile col-md-2">
                            <div aria-hidden="true" class="rating-btn absolute flex items-center justify-center w-[34px] h-[34px] bg-white rounded-full top-0 xl:-top-2 right-0 xl:-right-2 bookmark z-10"><img src="{{ url('assets/images/bookmark_unfill.7cefa5a4.svg') }}" alt="bookmark-img"></div>
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
                                        <span>₹{{ $book->price * (1-$book->discount_percentage/100) }}</span>
                                    </div>
                                </div>
                                @if($book->discount_percentage != 0)
                                    <div class="flex price_layout !leading-extra-loose" style="text-decoration: line-through;">
                                        <div
                                            class="offer_price !leading-extra-loose text-primary-default font-normal text-base tracking-normal font-manrope">
                                            <span>₹{{ $book->price }}</span>
                                        </div>
                                    </div>
                                @endif
                                <form method="POST" action="{{route('orderBook')}}">
                                    {{ csrf_field() }}
                                    <input type="hidden" name="id" value="{{$book->id}}">
                                    <button type="submit" class="order-now-btn btn btn-success mb-2" id="order_now" style="margin-top: 5px;">Order Now</button>
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
