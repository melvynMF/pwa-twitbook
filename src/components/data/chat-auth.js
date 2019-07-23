import { LitElement, html } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/auth';

export class ChatAuth extends LitElement {

    static getStyles() {
        return css`
            :host {
                display: block;
            }
            @import url(https://fonts.googleapis.com/css?family=Roboto:300);

            input[type=text], select {
              width: 100%;
              padding: 12px 20px;
              margin: 8px 0;
              display: inline-block;
              border: 1px solid #ccc;
              border-radius: 4px;
              box-sizing: border-box;
            }
            
            input[type=submit] {
              width: 100%;
              background-color: #4CAF50;
              color: white;
              padding: 14px 20px;
              margin: 8px 0;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            
            input[type=submit]:hover {
              background-color: #45a049;
            }
            
            div {
              border-radius: 5px;
              background-color: #f2f2f2;
              padding: 20px;
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
            <h1>Create User</h1>
            <form class="register-form" @submit="${this.handlePost}"> 
                <input type="text" @input="${e => this.email = e.target.value}">
                <input type="password" @input="${e => this.password = e.target.value}">
                <button type="submit">Sign up</button>
            </form>

            
        `;
    }
}
customElements.define('chat-auth', ChatAuth);