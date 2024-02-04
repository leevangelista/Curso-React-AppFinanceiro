import React, { useContext} from 'react';
import { Container, Message, Name, NewLink, NewText, LogoutButtom, LogoutText } from './styles';
import Header from '../../components/Header';
import { AuthContext } from '../../context/auth';
import { useNavigation } from '@react-navigation/native';

export default function Profile(){
    const { user, signOut} = useContext(AuthContext);
    const navigation = useNavigation();
    return(
        <Container>
            <Header title="Meu perfil" />
            <Message>Pagina Perfil</Message>
            <Name numberOfilines={1}>
                {user && user.name}
            </Name>
            <NewLink onPress={ () => navigation.navigate('Registrar')}>
                <NewText>
                    Fazer registro
                </NewText>
            </NewLink>
            <LogoutButtom onPress={() => signOut()}>
                <LogoutText>
                    Sair
                </LogoutText>
            </LogoutButtom>
        </Container>
    )
}