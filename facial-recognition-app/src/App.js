import { useState } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenticate');
  const [imgName, setImgName] = useState('placeholder.jpeg');
  const [isAuth, setAuth] = useState(false);

  function sendImage(e) {
    e.preventDefault();
    const visitorImageName = uuidv4();
    fetch(`https://yp80fj6jgi.execute-api.us-east-1.amazonaws.com/dev/access-guardian-visitor-images/${visitorImageName}.jpeg`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg'
      },
      body: image
    }).then(async () => {
      const response = await authenticate(visitorImageName);
      if (response.Message === 'Success') {
        setImgName('accepted.png');
        setAuth(true);
        setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, welcome to work.`);
      } else {
        setImgName('rejected.png');
        setAuth(false);
        setUploadResultMessage(`Authentication failed: this person is not a employee.`);
      }
    }).catch(error => {
      setImgName('rejected.png');
      setAuth(false);
      setUploadResultMessage(`There is an error during authentication process. Please try again.`);
      console.error(error);
    })
  }

  async function authenticate(visitorImageName) {
    const requestUrl = 'https://yp80fj6jgi.execute-api.us-east-1.amazonaws.com/dev/employee?' + new URLSearchParams({
      objectKey: `${visitorImageName}.jpeg`
    });
    return await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then((data) => {
      return data;
    }).catch(error => console.error(error));
  }

  return (
    <div className="App">
      <h2>
        AccessGuardian Facial Recognition System
      </h2>
      <form onSubmit={sendImage}>
        <input type='file' name='image' onChange={e => setImage(e.target.files[0])}/>
        <button type='submit'>Authenticate</button>
      </form>
      <div className={isAuth ? 'success' : 'failure'}>
        {uploadResultMessage}
      </div>
      <img src={ require(`./assets/${imgName}`) } alt='asset' height={250} width={250} />
    </div>
  );
}

export default App;
