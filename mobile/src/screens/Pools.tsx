import { FlatList, Icon, useToast, VStack } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Octicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";
import { useCallback, useState } from "react";
import { PoolCard, PoolCardPros } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { Loading } from "../components/Loading";

export function Pools() {
    const [isLoading, setIsLoading] = useState(false);
    const [pools, setPools] = useState<PoolCardPros[]>([]);
    const { navigate } = useNavigation();
    const toast = useToast();

    async function fetchPools() {
        try {
            setIsLoading(true);
            const response = await api.get('/pools');
            setPools(response.data.pools);
        } catch (err) {
            console.log(err);
            toast.show({
                title: 'Não foi possível carregar os seus bolões. Por favor, tente novamente.',
                placement: 'top',
                bgColor: 'red.500',
            });
        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(useCallback(() => {
        fetchPools();
    }, []));

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Meus bolões" />
            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
                <Button
                    title="Buscar bolão por código"
                    leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
                    onPress={() => navigate('find')}
                />
            </VStack>
            {isLoading ? <Loading /> : <FlatList
                data={pools}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <PoolCard
                        data={item}
                        onPress={() => navigate('details', { id: item.id })}
                    />
                )}
                px={5}
                showsVerticalScrollIndicator={false}
                _contentContainerStyle={{ pb: 10 }}
                ListEmptyComponent={() => <EmptyPoolList />}
            />}
        </VStack>
    )
}