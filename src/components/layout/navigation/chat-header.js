import { LitElement, html, css } from 'lit-element';

class ChatHeader extends LitElement {

    static get styles(){
        return css `
            :host {
                display: block;
                background-color: #ffffff;
            }
            header {
                height: 80px;

                display: flex;
                justify-content: center;
                align-items: center;
            }
            img {
                height: 42px;
                width: 42px;
                display: block;
            }
        `;
    }

    render() {
        return html `
            <img src="./src/assets/images/1f680.png" alt="Logo">
        `;
    }
}

customElements.define('chat-header', ChatHeader);