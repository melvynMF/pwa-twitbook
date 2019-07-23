import { LitElement, html } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/auth';

export class ChatAuth extends LitElement {

    static getStyles() {
        return css`

        .h2{
          color:red;
        }
        
        `;
    }

    static getProperties(){
        return {
            email: String,
            password: String
        };
    }

    firstUpdated(){
        this.auth = firebase.auth();
    }

    handlePost(e){
        e.preventDefault();
        if ((!this.email || !this.password)) {
          console.error('Email or Password missing');
        }       
        this.auth.createUserWithEmailAndPassword(this.email, this.password)
        .then(data => {
          // On créer un document avec cet utilisateur dans notre base
          firebase.firestore().collection('users').doc(data.user.uid).set({
            followings : [],
            followers : [],
            likes : 0
          })
        });
      }

    render() {
        return html`
      <style>

      body{
        background: #67BE4B;
    }
    #container{
        width:400px;
        margin:0 auto;
        margin-top:10%;
    }
    /* Bordered form */
    form {
        width:100%;
        padding: 30px;
        border: 1px solid #f1f1f1;
        background: #fff;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
        
    }
    #container h1{
        width: 38%;
        margin: 0 auto;
        padding-bottom: 10px;
    }
    
    /* Full-width inputs */
    input[type=text], input[type=password] {
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        display: inline-block;
        border: 1px solid #ccc;
        box-sizing: border-box;
    }
    
    /* Set a style for all buttons */
    input[type=submit] {
        background-color: #53af57;
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        cursor: pointer;
        width: 100%;
    }
    input[type=submit]:hover {
        background-color: white;
        color: #53af57;
        border: 1px solid #53af57;
    }
    h1{
      font-style:Arial, sans-serif;
      display:inline;
      font-size:3vw;
    }
      </style>

        <div id="container">            
            <form  @submit="${this.handlePost}"> 
            <h1>S'inscrire</h1>                
                <input type="text"placeholder="Entrer votre email" name="mail"   @input="${e => this.email = e.target.value} required">
                <input type="password" placeholder="Entrer le mot de passe" name="password"  @input="${e => this.password = e.target.value} required">
                <button type="submit">Inscription</button>    
            </form>
        </div>

            
        `;
    }
}
customElements.define('chat-auth', ChatAuth);