"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[389],{389:(s,e,t)=>{t.r(e),t.d(e,{default:()=>l});var a=t(43),r=t(314),n=t(756),i=t(579);class o extends a.Component{constructor(s){super(s),this.state={username:"",password:"",errorMessage:"",isError:!1},this.handleLogin=this.handleLogin.bind(this)}setUsername(s){this.setState({username:s})}setPassword(s){this.setState({password:s})}async handleLogin(){try{const s=this.state.username+":"+this.state.password,e=btoa(s),t=(await n.wD(e),new r.A(this.state.username,this.state.password));this.props.updateCurrentUser(t),this.setState({errorMessage:""})}catch(s){this.setState({isError:!0}),this.setState({errorMessage:"Invalid username or password"})}}render(){return(0,i.jsx)("div",{className:"login-page",children:(0,i.jsxs)("div",{className:"login-bubble",children:[(0,i.jsx)("div",{className:"login-title",children:"Husksheets Login"}),(0,i.jsxs)("div",{className:"login-inputs",children:[(0,i.jsxs)("div",{className:"input-field",children:[(0,i.jsx)("p",{children:"Username:"}),(0,i.jsx)("input",{placeholder:"Username",onChange:s=>this.setUsername(s.target.value),value:this.state.username})]}),(0,i.jsxs)("div",{className:"input-field",children:[(0,i.jsx)("p",{children:"Password:"}),(0,i.jsx)("input",{placeholder:"Password",onChange:s=>this.setPassword(s.target.value),value:this.state.password})]}),this.state.isError&&(0,i.jsx)("div",{className:"error",children:this.state.errorMessage})]}),(0,i.jsx)("button",{className:"login-button",onClick:this.handleLogin,children:"Login"})]})})}}const l=o}}]);
//# sourceMappingURL=389.4daab991.chunk.js.map