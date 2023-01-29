function forgotpassword(e){
    e.preventDefault();
    
    let form = new FormData(e.target);
console.log(form)
    let userDetails = {
        email : form.get('email')
    };
axios.post('http://localhost:3000/password/forgotpassword' , userDetails)
.then((response)=>{
    console.log(response.status === 200)
    if(response.status === 200){
        document.body.innerHTML += `<div>Mail successfully Sent</div>`
    }else{
        throw new Error('Something went wrong');
    }
})
.catch(err=>{
    showError(err);
})
};
//showError
function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
};  