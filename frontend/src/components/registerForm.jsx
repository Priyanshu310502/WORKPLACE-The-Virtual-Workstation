// import { useState } from 'react'
// import {
//   FormColumn,
//   FormWrapper,
//   FormInput,
//   FormSection,
//   FormInputRow,
//   FormMessage,
//   FormButton,
//   FormTitle,
//   FormSubText
// } from '../styles/Form.styles'
// import validateRegisterForm from '../validators/registerForm.validate'
// import { Link, useNavigate } from 'react-router-dom'

// const RegisterForm = () => {
//   const [username, setUsername] = useState('')
//   const [token, setToken] = useState('')
//   const [user, setUser] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [confirmPass, setConfirmPass] = useState('')
//   const [error, setError] = useState(null)
//   const [success, setSuccess] = useState(null)
//   const navigate = useNavigate()

  


  
//     const handleSubmit = (e) => {
//       e.preventDefault();
//       const resultError = validateRegisterForm({
//         username,
//         email,
//         password,
//         confirmPass
//       });
  
//       if (resultError !== null) {
//         setError(resultError);
//         return;
//       }
  
//       let myHeaders = new Headers();
//       myHeaders.append('Content-Type', 'application/json');
  
//       let requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: JSON.stringify({
//           email: email,
//           username: username,
//           password: password
//         })
//       };
  
//       fetch('http://localhost:1337/api/user/register', requestOptions)
//         .then((res) => {
//           if (!res.ok) {
//             return res.json().then((data) => {
//               throw new Error(data.error);
//             });
//           } else return res.json();
//         })
//         .then((data) => {
//           // Store token and username in localStorage
//           localStorage.setItem('token', data.data.token);
//           localStorage.setItem('username', data.data.username);
  
//           setToken(data.data.token);
//           setUser({ username: data.data.username });
  
//           setUsername('');
//           setEmail('');
//           setPassword('');
//           setConfirmPass('');
//           setError(null);
//           setSuccess('Registration was successful!');
  
//           // Redirect to the face capture page
//           navigate('/face-capture');
//         })
//         .catch((error) => {
//           console.log(error);
//           setError(error.toString());
//         });
//     };


//   const messageVariants = {
//     hidden: { y: 30, opacity: 0 },
//     animate: { y: 0, opacity: 1, transition: { delay: 0.2, duration: 0.4 } }
//   }

//   const formData = [
//     {
//       label: 'Email',
//       value: email,
//       onChange: (e) => setEmail(e.target.value),
//       type: 'email'
//     },
//     {
//       label: 'Username',
//       value: username,
//       onChange: (e) => setUsername(e.target.value),
//       type: 'text'
//     },
//     {
//       label: 'Password',
//       value: password,
//       onChange: (e) => setPassword(e.target.value),
//       type: 'password'
//     },
//     {
//       label: 'Confirm Password',
//       value: confirmPass,
//       onChange: (e) => setConfirmPass(e.target.value),
//       type: 'password'
//     }
//   ]
//   return (
//     <FormSection>
//       <FormColumn>
//         <FormTitle>Register</FormTitle>
//         <FormWrapper onSubmit={handleSubmit}>
//           {formData.map((el, index) => (
//             <FormInputRow key={index}>
//               <FormInput
//                 type={el.type}
//                 placeholder={`${el.label.toLocaleLowerCase()}`}
//                 value={el.value}
//                 onChange={el.onChange}
//               />
//             </FormInputRow>
//           ))}

//           <FormButton type="submit">Submit</FormButton>
//         </FormWrapper>
//         {error && (
//           <FormMessage variants={messageVariants} initial="hidden" animate="animate" error>
//             {error}
//           </FormMessage>
//         )}
//         {success && (
//           <FormMessage variants={messageVariants} initial="hidden" animate="animate">
//             {success}
//           </FormMessage>
//         )}
//       </FormColumn>
//       <FormSubText>
//         Already have an account? <Link to="/login">Login Instead</Link>
//       </FormSubText>
//     </FormSection>
//   )
// }

// export default RegisterForm






//.
import { useState } from 'react';
import {
  FormColumn,
  FormWrapper,
  FormInput,
  FormSection,
  FormInputRow,
  FormMessage,
  FormButton,
  FormTitle,
  FormSubText
} from '../styles/Form.styles';
import validateRegisterForm from '../validators/registerForm.validate';
import { Link, useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultError = validateRegisterForm({
      username,
      email,
      password,
      confirmPass
    });

    if (resultError) {
      setError(resultError);
      return;
    }

    try {
      const response = await fetch('http://localhost:1337/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.err || 'Registration failed');
      }

      localStorage.setItem('token', data.data.token);
      localStorage.setItem('username', data.data.username);

      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPass('');
      setError(null);
      setSuccess('Registration was successful!');

      // Redirect to face capture page
      navigate('/face-capture');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <FormSection>
      <FormColumn>
        <FormTitle>Register</FormTitle>
        <FormWrapper onSubmit={handleSubmit}>
          {[{ label: 'Email', value: email, setValue: setEmail, type: 'email' },
            { label: 'Username', value: username, setValue: setUsername, type: 'text' },
            { label: 'Password', value: password, setValue: setPassword, type: 'password' },
            { label: 'Confirm Password', value: confirmPass, setValue: setConfirmPass, type: 'password' }
          ].map(({ label, value, setValue, type }, idx) => (
            <FormInputRow key={idx}>
              <FormInput
                type={type}
                placeholder={label.toLowerCase()}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </FormInputRow>
          ))}
          <FormButton type="submit">Submit</FormButton>
        </FormWrapper>
        {error && <FormMessage error>{error}</FormMessage>}
        {success && <FormMessage>{success}</FormMessage>}
      </FormColumn>
      <FormSubText>
        Already have an account? <Link to="/login">Login Instead</Link>
      </FormSubText>
    </FormSection>
  );
};

export default RegisterForm;
