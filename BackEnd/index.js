var admin = require("firebase-admin");
const express = require("express");
const app = express();
app.use(express.json());
app.post("/send-notification", (req, res) => {
    console.log("req.body", req.body);
    const messaging = {
        notification :{
            title : "I Am Sendind This Add",
            body : "New Ad Posted Click To Watch"
        },
        tokens:req.body.tokens
    
    }
    admin.messaging().sendMulticast(messaging).then(res =>{
        console.log("message sent")
    }).catch(error =>{
        console.log("error", error)
    })   
})
var serviceAccount = require("Your Cloud Messaging Key");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.listen(3000, () => {
  console.log("server started");
});