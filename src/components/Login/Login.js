import React from "react";
import styled from "styled-components";

const Wrapper = styled.div `
    height: 86vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 14vh;
`;

const FormContainer = styled.div`
    max-width: 349px;
    width: 100%;
`;

const LoginContainer = styled.div`
    margin: 30px 0 0 0;
    width: 100%;
    height: 450px;
    background: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 3px;
    box-shadow: 0 0 30px black;
    `;

const RegisterContainer = styled.div`
    margin: 30px 0 0 0;
    width: 100%;
    height: 580px;
    background: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 3px;
    box-shadow: 0 0 30px black;
    `;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    margin: 6px 10%;
`;

const InputText = styled.input`
    height: 33px;
    margin: 0 0 7px 0;
    padding: 0 0 0 9px;
    border: 1px solid #edecec;
    background: #f9f9f9;
    border-radius: 3px;
    -webkit-appearance: none;
    font-size: 14px;
`;

const LoginButton = styled.input`
    height: 32px;
    background: #d66565;
    color: #fff;
    opacity: .65;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
`;

const LinkButton = styled.button`
    color: blue;
    border-radius: 5px;
    border: none;
    background-color: white;
    padding: 10px;
    margin-top: 20px;
`;

const Title = styled.h1`
    text-align:center;
    letter-spacing: 0.5px;
    font-weight: normal;
    color: #5A0C0C;
    font-size: 1.8rem;
`;

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "login",
        }
    }
    showRegister = () => {
        this.setState({display : "register"})
    }
    showLogin = () => {
        this.setState({display: "login"})
    }
    render() {
        return (
            <Wrapper>
                <FormContainer>
                    { this.state.display === "login" ?                     
                    <LoginContainer>
                        <Title>Soup Kitchen</Title>
                        <LoginForm onSubmit={(e) => {this.props.handleLogin(e)}}>
                            <InputText type="text" placeholder="Username"/>
                            <InputText type="password" placeholder="Password"/>
                            <LoginButton type="submit" value="Log In"></LoginButton>
                            <LinkButton type="button" className="link-button" onClick={this.showRegister}>New User? Register here.</LinkButton>
                        </LoginForm>
                        
                    </LoginContainer> 
                    : 
                    <RegisterContainer>
                        <Title>Soup Kitchen</Title>
                        <LoginForm onSubmit={(e) => {this.props.handleRegister(e)}}>
                            <InputText type="text" placeholder="Name"/>
                            <InputText type="password" placeholder="Password"/>
                            <InputText type="text" placeholder="Email"/>
                            <InputText type="text" placeholder="Role"/>
                            <LoginButton type="submit" value="Register"></LoginButton>
                            <LinkButton type="button" className="link-button" onClick={this.showLogin}>Already have an account? Log in here.</LinkButton>
                        </LoginForm>
                    </RegisterContainer>
                    }
                </FormContainer>
            </Wrapper>
        )
    }
}

export default Login;