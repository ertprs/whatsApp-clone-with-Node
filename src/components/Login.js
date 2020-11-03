import { Button } from '@material-ui/core'
import React from 'react'
import {auth, provider} from '../firebase'
import {useStateValue} from '../contextAPI/StateProvider'
import {actionTypes} from '../contextAPI/reducer'
import './Login.scss'

const Login = () => {

    const [, dispatch] = useStateValue()

    const SignIn = () => {
        auth.signInWithPopup(provider)
        .then(response => (
            dispatch({type: actionTypes.SET_USER, payload: response.user})
        ))
        .catch(err => alert(err))

    }
    return (
        <div className='login'>
            <div className="login__container">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/300px-WhatsApp.svg.png" alt=""/>
                <div className="login__text">
                    <h1>Sign in to WhatsApp</h1>
                </div>
                <Button onClick={SignIn}> Sign In With Google</Button>
            </div>
        </div>
    )
}

export default Login
