import { Component } from "react";
import './pagesCSS/loginPage.css'
import User from "../backend/User";
import * as client from "../backend/controller/client"
// @author Robert Roach

interface LoginProps {
    updateCurrentUser: (user: User) => void,
    user: User | null,
}

interface LoginState {
    errorMessage: string,
    password: string,
    username: string,
    isError: boolean
}

class Login extends Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props)
        this.state = {
            username: '',
            password: '',
            errorMessage: '',
            isError: false
        }
        this.handleLogin = this.handleLogin.bind(this)
    }

    setUsername(usernameInput: string): void {
        this.setState({ username: usernameInput }) 
    }

    setPassword(passwordInput: string): void {
        this.setState({ password: passwordInput }) 
    }

    async handleLogin() {        
        // Login authentication logic
        try {
            const loginString = this.state.username + ':' + this.state.password
            const encoded = btoa(loginString)
            await client.checkLogin(encoded)

            const loggedInUser = new User(this.state.username, this.state.password);
            this.props.updateCurrentUser(loggedInUser)
            this.setState({ errorMessage: '' })
        } catch (error) {
            console.log(error)
            this.setState({isError: true})
            this.setState({ errorMessage: 'Invalid username or password' })
        }
    }

    render() {
        return (
            <div className="login-page">
                <div className="login-bubble">
                    <div className="login-title">Husksheets Login</div>
                    <div className="login-inputs">
                        <div className='input-field'>
                            <p>Username:</p>
                            <input 
                                placeholder="Username"
                                onChange={(e) => this.setUsername(e.target.value)}
                                name="Username"
                                value={this.state.username}
                            />
                        </div>
                        <div className='input-field'>
                            <p>Password:</p>
                            <input 
                                placeholder="Password"
                                onChange={(e) => this.setPassword(e.target.value)}
                                name="Password"
                                value={this.state.password}
                            />
                        </div>
                        {this.state.isError && <div className='error'>
                            {this.state.errorMessage}
                        </div>}
                    </div>
                    <button className="login-button" name="Login" onClick={this.handleLogin}>
                        Login
                    </button>
                </div>
            </div>
        )
    }
}

export default Login