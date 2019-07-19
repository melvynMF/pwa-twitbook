# Guide

## Lancement polymer
<pre>
npx polymer serve
</pre>

## Commande
`console.dir(elem)` => Permet d'accéder à toutes les propriétes d'un élément


## Firestore en cloud
Dans les règles : (ne pas faire en prod, car on donne les droits à tlmd !)
<pre>
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
</pre>