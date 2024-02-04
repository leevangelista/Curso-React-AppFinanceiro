import React, { useContext, useEffect, useState} from "react";
import {Button, TouchableOpacity, Modal } from 'react-native';

import { AuthContext } from "../../context/auth";

import Header from "../../components/Header";
import { Background, ListBalance, Area, Title, List } from "./styles";

import api from "../../services/api";
import { format } from "date-fns";

import { useIsFocused } from "@react-navigation/native";
import BalanceItem from "../../components/BalanceItem";
import HistoricoList from "../../components/HistoricoList";
import CalendarModal from "../../components/CalendarModal";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Home(){
    const { signOut, user } = useContext(AuthContext);
    const isFocused = useIsFocused();
    const [listbalance, setListBalance] = useState([]);
    const [movements, setMovements] = useState([]);
    const [modalVisible, setModalVisibe] = useState(false);

    const [dateMovements, setDateMovements] = useState(new Date());

    useEffect(()=>{
        let isActive = true;

        async function getMovements(){
            // let dateFormated = format(dateMovements, 'dd/MM/yyy');

            let date = new Date(dateMovements);
            let onlyDate = date.valueOf() + date.getTimezoneOffset() * 60 * 1000;
            let dateFormated = format(onlyDate, 'dd/MM/yyyy');

            const receives = await api.get('/receives', {
                params:{
                    date: dateFormated
                }
            })

            const balance = await api.get('/balance', {
                params:{
                    date: dateFormated
                }
            })
            if(isActive){
                setListBalance(balance.data);
                setMovements(receives.data);
            }
        }
        getMovements();

        return () => isActive = false;
    }, [isFocused, dateMovements])

    async function handDelete(id){
        try{
            await api.delete('/receives/delete', {
                params:{
                    item_id: id
                }
            })

            setDateMovements(new Date())
        }catch(err){
            console.log(err);
        }
    }

    function filterDateMovements(dateSelected){
        setDateMovements(dateSelected);
    }

    return(
        <Background>
            <Header title="Minha movimentações"/>
            <ListBalance 
                data={listbalance}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.tag}
                renderItem={({ item }) => ( <BalanceItem data={item} /> )}
            />
            <Area>
                <TouchableOpacity onPress={ () => setModalVisibe(true)}>
                    <Icon name="event" color="#121212" size={30} />
                </TouchableOpacity>
                <Title>Ultimas movimentações</Title>
            </Area>
            <List 
                data={movements}
                keyExtractor={ item => item.id}
                renderItem={ ( {item}) => <HistoricoList data={item} deleteItem={handDelete}/>}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <CalendarModal
                    setVisible={ () => setModalVisibe(false)}
                    handleFilter={filterDateMovements}
                />
            </Modal>
            <Button title="Sair da conta"
                onPress={ () => signOut()}/>
        </Background>
    )
}