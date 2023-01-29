const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/users');
const Forgotpassword = require('../models/ForgotPassword');

const forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })

            sgMail.setApiKey(process.env.SEND_GRID_API_KEY)

            const msg = {
                to: email, // Change to your recipient
                from: 'vandlamudipradeepchoudhary@gmail.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
            }

            sgMail
            .send(msg)
            .then((response) => {

             
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', success: true})

            })
            .catch((error) => {
                throw new Error(error);
            })

            //send mail
        }else {
            throw new Error('User does not exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, success: false });
    }

}

const resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

module.exports = {
    forgotpassword ,
    resetpassword,
}