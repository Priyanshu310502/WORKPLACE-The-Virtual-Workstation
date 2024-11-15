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
// import validateLoginForm from '../validators/loginForm.validate'
// import { Link, useNavigate } from 'react-router-dom'

// const LoginForm = ({ setToken, setUser }) => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState(null)
//   const navigate = useNavigate()

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     const resultError = validateLoginForm({
//       email,
//       password
//     })

//     if (resultError !== null) {
//       setError(resultError)
//       return
//     }

//     let myHeaders = new Headers()
//     myHeaders.append('Content-Type', 'application/json')

//     let requestOptions = {
//       method: 'POST',
//       headers: myHeaders,
//       body: JSON.stringify({
//         email: email,
//         password: password
//       })
//     }

//     fetch('http://localhost:1337/api/user/login', requestOptions)
//       .then((res) => {
//         if (!res.ok)
//           return res.json().then((data) => {
//             throw new Error(data.err)
//           })
//         else return res.json()
//       })
//       .then((res) => {
//         localStorage.setItem('token', res.data.token)
//         localStorage.setItem('username', res.data.username)
//         setToken(res.data.token)
//         setUser({ username: res.data.username })
//         navigate('/dashboard')
//       })
//       .catch((error) => {
//         setError(error.message)
//       })
//   }

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
//       label: 'Password',
//       value: password,
//       onChange: (e) => setPassword(e.target.value),
//       type: 'password'
//     }
//   ]
//   return (
//     <FormSection>
//       <FormColumn>
//         <FormTitle>Welcome</FormTitle>
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
//       </FormColumn>
//       <FormSubText>
//         Do not have an account? <Link to="/register">Register Instead</Link>
//       </FormSubText>
//     </FormSection>
//   )
// }

// export default LoginForm









//.
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
// import validateLoginForm from '../validators/loginForm.validate'
// import { Link, useNavigate } from 'react-router-dom'

// const LoginForm = ({ setToken, setUser }) => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState(null)
//   const [isFaceVerified, setIsFaceVerified] = useState(false) // New state for face verification
//   const navigate = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const resultError = validateLoginForm({ email, password })

//     if (resultError !== null) {
//       setError(resultError)
//       return
//     }

//     let myHeaders = new Headers()
//     myHeaders.append('Content-Type', 'application/json')

//     let requestOptions = {
//       method: 'POST',
//       headers: myHeaders,
//       body: JSON.stringify({ email, password })
//     }

//     try {
//       // First, authenticate user credentials
//       const res = await fetch('http://localhost:1337/api/user/login', requestOptions)
//       if (!res.ok) {
//         const data = await res.json()
//         throw new Error(data.err)
//       }
//       const resData = await res.json()
//       localStorage.setItem('token', resData.data.token)
//       localStorage.setItem('username', resData.data.username)
//       setToken(resData.data.token)
//       setUser({ username: resData.data.username })

//       // Initiate face verification
//       // await verifyFaceData(resData.data.token)
//     } catch (error) {
//       setError(error.message)
//     }
//   }

//   const verifyFaceData = async (token) => {
//     try {
//       // Face verification request
//       const faceRes = await fetch('http://localhost:1337/api/face-verification', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         }
//       })
//       const faceData = await faceRes.json()

//       if (faceRes.ok && faceData.verified) {
//         setIsFaceVerified(true)
//         navigate('/dashboard')
//       } else {
//         throw new Error('Face verification failed. Please try again.')
//       }
//     } catch (error) {
//       setError(error.message)
//     }
//   }

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
//       label: 'Password',
//       value: password,
//       onChange: (e) => setPassword(e.target.value),
//       type: 'password'
//     }
//   ]

//   return (
//     <FormSection>
//       <FormColumn>
//         <FormTitle>Welcome</FormTitle>
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
//       </FormColumn>
//       <FormSubText>
//         Do not have an account? <Link to="/register">Register Instead</Link>
//       </FormSubText>
//     </FormSection>
//   )
// }

// export default LoginForm

//.2
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
// import validateLoginForm from '../validators/loginForm.validate'
// import { Link, useNavigate } from 'react-router-dom'

// const LoginForm = ({ setToken, setUser }) => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState(null)
//   const navigate = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const resultError = validateLoginForm({
//       email,
//       password
//     })

//     if (resultError !== null) {
//       setError(resultError)
//       return
//     }

//     let myHeaders = new Headers()
//     myHeaders.append('Content-Type', 'application/json')

//     let requestOptions = {
//       method: 'POST',
//       headers: myHeaders,
//       body: JSON.stringify({
//         email: email,
//         password: password
//       })
//     }

//     try {
//       const res = await fetch('http://localhost:1337/api/user/login', requestOptions)
      
//       if (!res.ok) {
//         const contentType = res.headers.get("content-type")
//         if (contentType && contentType.includes("text/html")) {
//           throw new Error("Received HTML response. Please check the server endpoint.")
//         }
//         const data = await res.json()
//         throw new Error(data.err)
//       }

//       const resData = await res.json()
//       localStorage.setItem('token', resData.data.token)
//       localStorage.setItem('username', resData.data.username)
//       setToken(resData.data.token)
//       setUser({ username: resData.data.username })

//       // Proceed with face verification after successful login
//       const faceVerificationSuccess = await verifyFaceData(resData.data.token)
//       if (faceVerificationSuccess) {
//         navigate('/dashboard')
//       } else {
//         setError("Face verification failed. Please try again.")
//       }
//     } catch (error) {
//       setError(error.message)
//     }
//   }

//   // Face Verification Function
//   const verifyFaceData = async (token) => {
//     try {
//       const faceRequestOptions = {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           // Assuming data required by backend for face verification
//           faceData: "sampleFaceData" 
//         })
//       }

//       const faceRes = await fetch('http://localhost:1337/api/face-', faceRequestOptions)
//       if (!faceRes.ok) {
//         const faceData = await faceRes.json()
//         throw new Error(faceData.err || "Face verification failed.")
//       }

//       const faceData = await faceRes.json()
//       return faceData.success
//     } catch (error) {
//       console.error("Face Verification Error:", error)
//       setError("Face verification error. Please contact support.")
//       return false
//     }
//   }

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
//       label: 'Password',
//       value: password,
//       onChange: (e) => setPassword(e.target.value),
//       type: 'password'
//     }
//   ]
  
//   return (
//     <FormSection>
//       <FormColumn>
//         <FormTitle>Welcome</FormTitle>
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
//       </FormColumn>
//       <FormSubText>
//         Do not have an account? <Link to="/register">Register Instead</Link>
//       </FormSubText>
//     </FormSection>
//   )
// }

// export default LoginForm






//. 3 with python
import { useState } from 'react'
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
} from '../styles/Form.styles'
import validateLoginForm from '../validators/loginForm.validate'
import { Link, useNavigate } from 'react-router-dom'

const LoginForm = ({ setToken, setUser }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const resultError = validateLoginForm({
      email,
      password
    })

    if (resultError !== null) {
      setError(resultError)
      return
    }

    let myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        email: email,
        password: password
      })
    }

    try {
      const res = await fetch('http://localhost:1337/api/user/login', requestOptions)
      
      if (!res.ok) {
        const contentType = res.headers.get("content-type")
        if (contentType && contentType.includes("text/html")) {
          throw new Error("Received HTML response. Please check the server endpoint.")
        }
        const data = await res.json()
        throw new Error(data.err)
      }

      const resData = await res.json()
      localStorage.setItem('token', resData.data.token)
      localStorage.setItem('username', resData.data.username)
      setToken(resData.data.token)
      setUser({ username: resData.data.username })

      // Navigate to the Face Verification page
      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
    }
  }

  const messageVariants = {
    hidden: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { delay: 0.2, duration: 0.4 } }
  }

  const formData = [
    {
      label: 'Email',
      value: email,
      onChange: (e) => setEmail(e.target.value),
      type: 'email'
    },
    {
      label: 'Password',
      value: password,
      onChange: (e) => setPassword(e.target.value),
      type: 'password'
    }
  ]
  
  return (
    <FormSection>
      <FormColumn>
        <FormTitle>Welcome</FormTitle>
        <FormWrapper onSubmit={handleSubmit}>
          {formData.map((el, index) => (
            <FormInputRow key={index}>
              <FormInput
                type={el.type}
                placeholder={`${el.label.toLocaleLowerCase()}`}
                value={el.value}
                onChange={el.onChange}
              />
            </FormInputRow>
          ))}
          <FormButton type="submit">Submit</FormButton>
        </FormWrapper>
        {error && (
          <FormMessage variants={messageVariants} initial="hidden" animate="animate" error>
            {error}
          </FormMessage>
        )}
      </FormColumn>
      <FormSubText>
        Do not have an account? <Link to="/register">Register Instead</Link>
      </FormSubText>
    </FormSection>
  )
}

export default LoginForm
