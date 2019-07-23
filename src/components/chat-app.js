import { LitElement, html, css } from 'lit-element';
import './layout/navigation/chat-header.js';
import './data/chat-data.js';
import './data/chat-auth.js';
import './data/chat-login.js';
import './data/chat-store.js';
import firebase from 'firebase/app';

class ChatApp extends LitElement {
 constructor() {
   super();
   this.user = {};
   this.users = [];
   this.message = "";
   this.messages = [];
   this.logged = false;
   
 }
 static get properties() {
   return {
     unresolved: {
       type: Boolean,
       reflect: true
     },
     users: Array,
     user: Object,
     message: String,
     messages: Array,
     logged: Boolean
   };
 }
 static get styles() {
  return css`
    :host {
      display: block;
    }
    * {  box-sizing: border-box }
    footer {
      position: fixed;
      bottom: 0;
      width: 100%;
    }
    form {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      width: 30%;
      margin-left:20em;
    }

    ul {
      position: relative;
      display: flex;
      flex-direction: column;
      list-style: none;
      padding: 0;
      margin: 0;
      margin-bottom: 3em;
    }
    ul li {
      display: block;
      padding: 0.5rem 1rem;
      margin-bottom: 1rem;
    
      border-radius: 0 30px 30px 0;
      width: 70%;
    }
    ul li.own {
      align-self: flex-end;
      text-align: left;
      border-radius: 30px 0 0 30px;
      margin-right:10em;
    }

    ul li.other {
      align-self: flex-end;
      text-align: left;
      border-radius: 30px 0 0 30px;
      margin-right:10em;
      background-color:aliceblue;
    }

    textarea{
      width:45em;
      height:10em;
    }


    .button {
  background-color: #F16759; 
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
  `;
}
 firstUpdated() {
   this.unresolved = false;
   this.data = this.shadowRoot.querySelector("#data");
   this.logged = localStorage.getItem('logged') == 'true' ? true : false;
 }
 handleLogin(e) {
   this.user = e.detail.user;
   this.logged =
    localStorage.getItem('logged') == 'true' ? true : false;
 }

 sendMessage(e) {
   e.preventDefault();
   this.database = firebase.firestore();

    this.database.collection('messages').add({
      content: this.message,
      user: this.user.uid,
      email: this.user.email,
      likes : 0,
      date: new Date().getTime()
    });
    this.message = '';
  
 }

 
 like(message) {
  this.database = firebase.firestore(); // firebase data base
  let user = firebase.auth().currentUser; // utilisateur connecté
  console.log(message);

 firebase.firestore().collection("messages").doc(message.user).update({
  likes: 1
})


}



 sendSubscription() {
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(document.config.publicKey)
        }).then(async subscribtion => {
          subscribtion.id = this.user.uid;
          await fetch('http://localhost:8085/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscribtion)
          })
        });
      });
  }
}

 render() {
   return html`

   <style>
   .logout {
    background-color: #EA1C45;

    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    }


    .logout:hover{
      background-color:hover: #EA1C45;
      }
      textarea{
                background: ##D9E9F0;
      }


.send {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

.submit{
  display: block;
  margin-left: auto;
  margin-right: auto


}
  </style>
     <section>
       <chat-data
         id="data"
         path="messages"
         @child-changed="${this.messageAdded}">
       </chat-data>
       <chat-store
         collection="messages"
         @child-changed="${this.messageAdded}">
       </chat-store>
       <slot name="header"></slot>
       <main>
         ${ !this.logged ?
           html`
           <div class="item"><chat-auth @user-logged="${this.handleLogin}"></chat-auth></div>
           <chat-login @user-logged="${this.handleLogin}"></chat-login>
            `: html`
             <h2>Bonjour, ${this.user.email.substring(0, this.user.email.lastIndexOf("@"))}</h2>
             <button class="logout"  @click="${this.logout}">Déconnexion</button>

             <form class="submit" @submit="${this.sendMessage}">
                <textarea placeholder="Votre tweet" .value="${this.message}"  @input="${e => this.message = e.target.value}" > </textarea> <br>
                <button class="send" type="submit">Send</button>
              </form>

             <ul>
               ${this.messages.map(message => html`
                 <li
                   class="${message.user == this.user.uid ? 'own': 'other'}">
                   <strong>${message.email.substring(0, message.email.lastIndexOf("@"))}</strong><br>
                   <span>${message.content} <br>
                   ${this.getDate(message.date)}</span>

                  <button  @click="${ (e)=>{ this.like(message)}}">❤️</button>
                  
              
                 </li>
               `)}
               
                

                
             </ul>
           </main>
     
          
            <footer>
           </footer>
           `
         }
     </section>
   `;
 }

 subscribe() {
  if (('serviceWorker' in navigator) || ('PushManager' in window)) {
    Notification.requestPermission()
      .then((result) => {
        if (result === 'denied') {
          console.log('Permission wasn\'t granted. Allow a retry.');
          return;
        }
        if (result === 'default') {
          console.log('The permission request was dismissed.');
          return;
        }
        console.log('Notification granted', result);
        this.sendSubscription();
        // Do something with the granted permission.
      });
  }
}

logout(){
    // Déconnexion Firebase
    firebase.auth().signOut().then(function() {
      window.location.reload();
    }).catch(function(error) {
      alert('Erreur')
    });
  }

urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

 messageAdded(e) {
   this.messages = e.detail;
   setTimeout(function(){
       window.scrollTo(0, document.body.scrollHeight);
   }, 0);
 }
 userAdded(e) {
   this.users = e.detail;
 }
 getDate(timestamp) {
   const date = new Date(timestamp);
   // Hours part from the timestamp
   const hours = date.getHours();
   // Minutes part from the timestamp
   const minutes = "0" + date.getMinutes();
   // Seconds part from the timestamp
   const seconds = "0" + date.getSeconds();
   // Will display time in 10:30:23 format
   return `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
 }
}
customElements.define('chat-app', ChatApp);