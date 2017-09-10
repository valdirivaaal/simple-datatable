$(document).ready(function() {
    // Host
    var host = 'http://localhost:8080/users';

    $("input,select,textarea").not("[type=submit]").jqBootstrapValidation();

    $("#mytable #checkall").click(function () {
        if ($("#mytable #checkall").is(':checked')) {
            $("#mytable input[type=checkbox]").each(function () {
                $(this).prop("checked", true);
            });

        } else {
            $("#mytable input[type=checkbox]").each(function () {
                $(this).prop("checked", false);
            });
        }
    });

    $("[data-toggle=tooltip]").tooltip();

    /**
     * Fungsi untuk mengedit data user
     *
     */
     function editData()
     {
         $(".btnEdit").unbind().on('click', function() {
             var row = $(this).closest('tr'),
                id = row.find('input[type=hidden]').val(),
                modal = $("#edit");


             $.get(host+'/'+id, function(res) {

                 if(res.success)
                 {
                     modal.find('input[name="firstName"]').val(res.messages.firstName);
                     modal.find('input[name="lastName"]').val(res.messages.lastName);
                     modal.find('textarea[name="address"]').val(res.messages.address);
                     modal.find('input[name="email"]').val(res.messages.email);
                     modal.find('input[name="contact"]').val(res.messages.contact);

                     $("#updateData").on("submit", function(e) {
                         e.preventDefault();

                         var form = $(this),
                             data = {
                                 firstName: form.find("input[name='firstName']").val(),
                                 lastName: form.find("input[name='lastName']").val(),
                                 address: form.find("textarea[name='address']").val(),
                                 email: form.find("input[name='email']").val(),
                                 contact: form.find("input[name='contact']").val(),
                             };

                         $.ajax({
                             url: host+'/'+id,
                             type: 'put',
                             data: data,
                             success: function(res) {
                                 if(res.success)
                                 {
                                     // Load data
                                     doRequest();

                                     // Close modal
                                     $("#edit").modal('toggle');

                                     // Show message
                                     $.notify({
                                     	// options
                                     	message: 'Data has been updated'
                                     },{
                                     	// settings
                                     	type: 'success',
                                         placement: {
                                     		from: "top",
                                     		align: "center"
                                     	}
                                     });
                                 }
                                 else {
                                     // Show message
                                     $.notify({
                                     	// options
                                     	message: 'Failed to update data'
                                     },{
                                     	// settings
                                     	type: 'danger',
                                         placement: {
                                     		from: "top",
                                     		align: "center"
                                     	}
                                     });
                                 }
                             }
                         })
                     });
                 }
             });
         });
     }
     editData();

     /**
      * Fungsi untuk menghapus data user
      *
      */
      function deleteData()
      {
          $(".btnDelete").unbind().on("click", function() {
              var row = $(this).closest('tr'),
                 id = row.find('input[type=hidden]').val();


              $(".btnDeleteOk").unbind().on("click", function() {
                  $.ajax({
                      url: host+'/'+id,
                      type: 'delete',
                      success: function(res) {
                          if(res.success)
                          {
                              // Load user data
                              doRequest();

                              // Show message
                              $.notify({
                              	// options
                              	message: 'Data has been deleted'
                              },{
                              	// settings
                              	type: 'success',
                                  placement: {
                              		from: "top",
                              		align: "center"
                              	}
                              });
                          }
                          else
                          {
                              // Show message
                              $.notify({
                              	// options
                              	message: 'Failed to delete data'
                              },{
                              	// settings
                              	type: 'danger',
                                  placement: {
                              		from: "top",
                              		align: "center"
                              	}
                              });
                          }
                      }
                  });
              });
          });
      }
      deleteData();

    /**
     * Fungsi untuk load data user
     *
     */
    function doRequest(page) {
        // Set default page
        page = page || 1;

        $.get(host+'?page='+page, function(res) {
            if(res.success)
            {
                var row = '';
                $.each(res.messages.data, function(i, d) {
                    row += '\
                        <tr>\
                            <td><input type="checkbox" class="checkthis" name="" value=""></td>\
                            <td>\
                                <input type="hidden" value="'+ d._id +'">\
                                '+ d.firstName +'\
                            </td>\
                            <td>'+ d.lastName +'</td>\
                            <td>'+ d.address +'</td>\
                            <td>'+ d.email +'</td>\
                            <td>'+ d.contact +'</td>\
                            <td><p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn btn-primary btn-xs btnEdit" data-title="Edit" data-toggle="modal" data-target="#edit" ><span class="glyphicon glyphicon-pencil"></span></button></p></td>\
                            <td><p data-placement="top" data-toggle="tooltip" title="Delete"><button class="btn btn-danger btn-xs btnDelete" data-title="Delete" data-toggle="modal" data-target="#delete" ><span class="glyphicon glyphicon-trash"></span></button></p></td>\
                        </tr>\
                    ';
                })

                $("#mytable tbody").html(row);

                // init bootpag
                $('.paginations').bootpag({
                    total: Math.ceil(res.messages.total/5),
                    maxVisible: 5
                }).on("page", function(event, /* page number here */ num){
                    doRequest(num);
                });

                editData();
                deleteData();
            }
        });
    }
    doRequest();

    /**
     * Fungsi simpan data
     *
     */
    $("#addData").on("submit", function(e) {
        e.preventDefault();
        var form = $(this),
            data = {
                firstName: form.find("input[name='firstName']").val(),
                lastName: form.find("input[name='lastName']").val(),
                address: form.find("textarea[name='address']").val(),
                email: form.find("input[name='email']").val(),
                contact: form.find("input[name='contact']").val(),
            }

        $.post(host, data)
            .done(function(res) {

                if(res.success)
                {
                    // Load user data
                    doRequest();

                    // Close modal
                    $("#add").modal('toggle');

                    // Show message
                    $.notify({
                    	// options
                    	message: 'Data has been saved'
                    },{
                    	// settings
                    	type: 'success',
                        placement: {
                    		from: "top",
                    		align: "center"
                    	}
                    });
                }
                else {
                    // Show message
                    $.notify({
                      // options
                      message: 'Failed to save data'
                    },{
                      // settings
                      type: 'danger',
                        placement: {
                          from: "top",
                          align: "center"
                      }
                    });
                }
            });
    });

    /**
     * Fungsi untuk clear field pada form tambah data saat modal hilang
     *
     */
    $("#add").on('hidden.bs.modal', function(e) {
        $(this)
            .find("input,textarea,select")
               .val('')
               .end();
    });


});
