import './App.css';
import { useState } from 'react';
const CryptoJS = require('crypto-js');

function App() {

  const [userpsw, setUserpsw] = useState('');
  const [usersecret, setUsersecret] = useState('maPhraseSecrete');
  const [userpswhash, setUserpswhash] = useState('');

  const [clientpsw, setClientpsw] = useState('');
  const [clientsecret, setClientsecret] = useState('maPhraseSecrete');
  const [clientpswunhash, setClientpswunhash] = useState('');

  // Fonction pour dériver une clé SHA-256 à partir d'une phrase secrète
  function deriveKey(secret) {
    return CryptoJS.SHA256(secret).toString(CryptoJS.enc.Hex);
  }

  // Fonction pour chiffrer un mot de passe
  function encryptPassword(password, key) {
    const iv = CryptoJS.lib.WordArray.random(16); // Génère un vecteur d'initialisation (IV)
    const encrypted = CryptoJS.AES.encrypt(password, CryptoJS.enc.Hex.parse(key), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return iv.toString() + ':' + encrypted.toString();
  }



  // Fonction pour déchiffrer un mot de passe
  function decryptPassword() {
    const key = deriveKey(clientsecret); // Dérive une clé de 256 bits à partir de la phrase secrète
    const parts = clientpsw.split(':');
    const iv = CryptoJS.enc.Hex.parse(parts[0]);
    const encrypted = parts[1];
    const decrypted = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Hex.parse(key), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    setClientpswunhash(decrypted.toString(CryptoJS.enc.Utf8))
    console.log('Mot de passe déchiffré :', decrypted.toString(CryptoJS.enc.Utf8));

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  function handleChange(e) {
    setUserpsw(e.target.value);
  }

  function handleChangeSecret(e) {
    setUsersecret(e.target.value);
  }

  function handleChangeClient(e) {
    setClientpsw(e.target.value);
  }

  function handleChangeClientSecret(e) {
    setClientsecret(e.target.value);
  }

  function cryptPassword() {
    const key = deriveKey(usersecret); // Dérive une clé de 256 bits à partir de la phrase secrète
    const encryptedPassword = encryptPassword(userpsw, key);

    console.log('Mot de passe chiffré :', encryptedPassword);

    setUserpswhash(encryptedPassword)
  }

  return (
    <div>
      <h1>Chiffrage</h1>
      <p>Votre mot de passe</p>
      <input value={userpsw} onChange={handleChange}></input>
      <p>Votre phrase secrète</p>
      <input value={usersecret} onChange={handleChangeSecret}></input>
      <br />
      <br />
      <button onClick={cryptPassword}>Hash le mot de passe </button>
      <p>Le mot de passe hashé : {userpswhash}</p>
      <h1>Déchiffrage</h1>
      <p>Le mot de passe hashé</p>
      <input value={clientpsw} onChange={handleChangeClient}></input>
      <p>Le secret du client</p>
      <input value={clientsecret} onChange={handleChangeClientSecret}></input>
      <br />
      <br />
      <button onClick={decryptPassword}>Déchiffrer le mot de passe </button>
      <p>Le mot de passe déchiffré : {clientpswunhash}</p>
    </div>
  );
}

export default App;
