$(document).ready(function(){
        $('#signupForm').validate({
            rules:{
                name:{
                    required:true,
                    minlength:2
                },
                email:{
                  required:true,
                  email:true
                },
                phone:{
                   required:true,
                   number:true
                },
                password:{
                    required:true,
                    minlength:5
                },
                confirmPassword:{
                    required:true,
                    minlength:5,
                    equalTo:"#password"
                }
            },
            messages:{
                name:{
                    required: "Please enter a name",
                    minlength: "Your name must consist of at least 2 characters"
                },
                password:{
                    required:"Please provide a password",
                    minlength: "Your password must be atleast  5 characters long"
                },
                confirmPassword:{
                    required: "Please provide a password",
                    minlength: "Your password must be atleast  5 characters long",
                    equalTo:"please enter the same password as above"
                }
            }
        })
    })
    