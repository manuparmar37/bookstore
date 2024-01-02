@extends('layouts.app')
@section('content')
    <!--main content start-->

    <div class="page-head-wrap">
        <h4 class="margin0">
            Books
        </h4>
    </div>

    <div class="ui-content-body">
        <div class="ui-container">
            <?php
            use App\Http\Controllers\AdminController;
            use App\Models\User;
            use App\Models\Book;
            use App\Models\Genre;
            use App\Models\Author;
            $role_id = \Auth::user()->role_id;
            $user_detail = User::find(\Auth::user()->id);
            $key = AdminController::getEncodedKey();
            $genres = Genre::get();
            $authors = Author::get();
            ?>
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

            <div class="row">
                <div class="col-sm-12">
                    <section class="panel">
                        <header class="panel-heading panel-border">
                        </header>
                        <div class="panel-body">
                            <nav class="navbar navbar-light bg-light">
                                <div class="col-sm-12">
                                    <form class="form-inline mtop-10" style="float:right;">
                                        <div class="form-group">
                                            <button data-toggle="modal" data-target="#updateBookData" type="button"
                                                class="btn btn-success mb-2" id="search"
                                                onclick="updateBookData({{ htmlspecialchars(json_encode([]), ENT_QUOTES, 'UTF-8') }})">Add
                                                new book</button>
                                        </div>
                                        <div class="form-group">
                                            <?php
                                            $datasession = Session::all();
                                            $session_token = $datasession['_token'];
                                            $key = base64_encode($user_detail->id . '<user>' . $user_detail->id . '<user>' . $session_token);
                                            ?>
                                        </div>
                                    </form>
                                </div>
                            </nav>
                            <div class="col-md-12 p-0">
                                <div class="loader clearfix hidden">
                                    <i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i>
                                </div>
                            </div>
                            <table class="display nowrap cell-border " id="example">
                                <thead>
                                    <th style='background-color: #fafafa;'>Id</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>ISBN</th>
                                    <th>Genre</th>
                                    <th>Price</th>
                                    <th>Quantity In Stock</th>
                                    <th>Action</th>
                                </thead>
                            </table>
                        </div>
                        <div class="modal fade" id="updateBookData" tabindex="-1" role="dialog"
                            aria-labelledby="myModalLabel" aria-hidden="true" style="margin-top: 200px;">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <form method="POST" action="{{ route('updateBookDetails') }}" enctype="multipart/form-data">
                                        {{ csrf_field() }}
                                        <div class="modal-header">
                                            <button type="button" class="close" data-dismiss="modal"
                                                aria-hidden="true">&times;</button>
                                            <h4 class="modal-title" id="booksEditModalLabel">Edit Book Data</h4>
                                        </div>
                                        <div class="modal-body"
                                            style="display: inline-block; padding: 0 0 0 15px; width: 80%;">

                                            <br>

                                            <div class="col-md-12">
                                                <input type="hidden" name="id" id="id">
                                                <div class="row form-group">
                                                    <label for="title" class="col-sm-3 control-label">Title:</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" class="form-control" id="title"
                                                            name="title" placeholder="Title">
                                                    </div>
                                                </div>

                                                <div class="row form-group">
                                                    <label for="genre" class="col-sm-3 control-label">Author:</label>
                                                    <div class="col-sm-9">
                                                        <select class="form-control" name="author_id" id="author_id">
                                                            <option selected value=''>Select</option>
                                                            @foreach ($authors as $genre)
                                                                <option value="{{ $genre->id }}">{{ $genre->name }}
                                                                </option>
                                                            @endforeach
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="row form-group">
                                                    <label for="isbn" class="col-sm-3 control-label">ISBN:</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" class="form-control" id="isbn"
                                                            name="isbn" placeholder="ISBN">
                                                    </div>
                                                </div>

                                                <div class="row form-group">
                                                    <label for="genre" class="col-sm-3 control-label">Genre:</label>
                                                    <div class="col-sm-9">
                                                        <select class="form-control" name="genre_id" id="genre_id">
                                                            <option selected value=''>Select</option>
                                                            @foreach ($genres as $genre)
                                                                <option value="{{ $genre->id }}">{{ $genre->name }}
                                                                </option>
                                                            @endforeach
                                                        </select>
                                                    </div>
                                                </div>

                                                <div class="row form-group">
                                                    <label for="genre" class="col-sm-3 control-label">Price:</label>
                                                    <div class="col-sm-9">
                                                        <input type="number" step="0.01" class="form-control"
                                                            id="price" name="price" placeholder="Price">
                                                    </div>
                                                </div>

                                                <div class="row form-group">
                                                    <label for="genre" class="col-sm-3 control-label">Quantity:</label>
                                                    <div class="col-sm-9">
                                                        <input type="number" class="form-control" id="quantity_in_stock"
                                                            name="quantity_in_stock" placeholder="Quantity in stock">
                                                    </div>
                                                </div>

                                                <div class="row form-group">
                                                    <label for="genre" class="col-sm-3 control-label">Discount
                                                        Percent:</label>
                                                    <div class="col-sm-9">
                                                        <input type="number" class="form-control"
                                                            id="discount_percentage" name="discount_percentage">
                                                    </div>
                                                </div>

                                                <div class="row form-group">
                                                    <label for="img_src" class="col-sm-3 control-label">Image:</label>
                                                    <div class="col-sm-9">
                                                        <input type="file" accept=".png, .jpg, .jpeg" class="form-control"
                                                            id="img_src" name="img_src">
                                                    </div>
                                                </div>


                                            </div>
                                            <br>

                                        </div>

                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-default"
                                                data-dismiss="modal">Close</button>
                                            <button type="submit" class="btn btn-primary">Update</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    </div>


    </div>

    <!-- Modal -->
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.15/css/jquery.dataTables.min.css" />
    <link rel="stylesheet" type="text/css"
        href="https://cdn.datatables.net/buttons/1.4.0/css/buttons.dataTables.min.css" />

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
    <script src="https://cdn.rawgit.com/bpampuch/pdfmake/0.1.27/build/pdfmake.min.js"></script>
    <script src="https://cdn.rawgit.com/bpampuch/pdfmake/0.1.27/build/vfs_fonts.js"></script>
    <script src="https://cdn.datatables.net/1.13.1/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/1.4.0/js/dataTables.buttons.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/1.4.0/js/buttons.flash.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/1.4.0/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/1.4.0/js/buttons.print.min.js"></script>
    <script src="https://cdn.datatables.net/fixedcolumns/4.2.1/js/dataTables.fixedColumns.min.js"></script>

    <script type="text/javascript">
        $(document).ready(function() {

            var table = $('#example').DataTable({
                searching: true,
                processing: true,
                serverSide: true,
                dom: 'lBfrtip',
                buttons: [
                    'copyHtml5',
                    'excelHtml5',
                    'csvHtml5',
                    {
                        extend: 'pdfHtml5',
                        orientation: 'landscape',
                        pageSize: 'LEGAL'
                    }
                ],
                "order": [
                    [0, "desc"]
                ],
                ajax: "{{ route('bookListing') }}",
                columns: [{
                        data: 'id'
                    },
                    {
                        data: 'title'
                    },
                    {
                        data: 'author'
                    },
                    {
                        data: 'isbn'
                    },
                    {
                        data: 'genre'
                    },
                    {
                        data: 'price'
                    },
                    {
                        data: 'quantity_in_stock'
                    },
                    {
                        data: 'action'
                    },
                ],
                fixedColumns: {
                    left: 1
                }
            });


            $(".dataTables_filter").css("display", "none");
        });




        var editCase = false;

        function updateBookData(book) {
            if (book.id > 0) {
                editCase = true;
                $("#img_src").removeAttr("required");
            } else {
                editCase = false;
                $("#img_src").attr("required", "true");
            }
            $("#booksEditModalLabel").html(editCase ? 'Edit Book Data' : 'Add New Book');
            $("#id").val(book.id);
            $("#title").val(book.title);
            $("#author_id").val(book.author_id);
            $("#isbn").val(book.isbn);
            $("#genre_id").val(book.genre_id); // Assuming genre is a string, adjust accordingly
            $("#price").val(book.price);
            $("#quantity_in_stock").val(book.quantity_in_stock);
            $("#discount_percentage").val(book.discount_percentage);
        }

        function deleteBook(bookId) {
            return true;
        }


        $(document).ready(function() {

        });
    </script>


    <script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js" type="text/javascript"></script>
    <script src="https://cdn.datatables.net/buttons/1.5.6/js/dataTables.buttons.min.js" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js" type="text/javascript"></script>
    <script src="https://cdn.datatables.net/buttons/1.5.6/js/buttons.html5.min.js" type="text/javascript"></script>
@endsection
