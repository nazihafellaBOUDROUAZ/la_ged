import React from "react";
import * as Components from './Components';

function SignIn() {
    const [signIn, toggle] = React.useState(true);
     return(
         <Components.Container>
             <Components.SignUpContainer signinIn={signIn}>
                 <Components.Form>
                     <Components.Title>Sign in en tant que Utilisateur</Components.Title>
                     <Components.Input type='email' placeholder='Email' />
                     <Components.Input type='password' placeholder='Password' />
                     <Components.Anchor href='#'>Mot de passe oublié ?</Components.Anchor>
                     <Components.Button>Sign In</Components.Button>
                 </Components.Form>
             </Components.SignUpContainer>

             <Components.SignInContainer signinIn={signIn}>
                  <Components.Form>
                      <Components.Title>Sign in en tant que Admin</Components.Title>
                      <Components.Input type='email' placeholder='Email' />
                      <Components.Input type='password' placeholder='Password' />
                      <Components.Anchor href='#'>Mot de passe oublié ?</Components.Anchor>
                      <Components.Button>Sigin In</Components.Button>
                  </Components.Form>
             </Components.SignInContainer>

             <Components.OverlayContainer signinIn={signIn}>
                 <Components.Overlay signinIn={signIn}>

                 <Components.LeftOverlayPanel signinIn={signIn}>
                     <Components.Title1>Welcome Back!</Components.Title1>
                     <Components.Paragraph>
                        Accédez à vos documents en toute sécurité et simplicité.
                     </Components.Paragraph>
                     <Components.GhostButton onClick={() => toggle(true)}>
                         Admin
                     </Components.GhostButton>
                     </Components.LeftOverlayPanel>

                     <Components.RightOverlayPanel signinIn={signIn}>
                       <Components.Title1>Welcome!</Components.Title1>
                       <Components.Paragraph>
                       Accédez à vos documents en toute sécurité et simplicité.
                       </Components.Paragraph>
                           <Components.GhostButton onClick={() => toggle(false)}>
                               Utilisateur
                           </Components.GhostButton> 
                     </Components.RightOverlayPanel>
 
                 </Components.Overlay>
             </Components.OverlayContainer>

         </Components.Container>
     )
}

export default SignIn;