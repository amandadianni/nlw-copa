import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/core";

export function Find() {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const { navigate } = useNavigation();

    async function handleJoinPool() {
        if (!code.trim()) {
            return toast.show({
                title: 'Informe o código.',
                placement: 'top',
                bgColor: 'red.500',
            });
        }
        try {
            setIsLoading(true);
            await api.post('/pools/join', { code });

            toast.show({
                title: 'Você entrou no bolão com sucesso!',
                placement: 'top',
                bgColor: 'green.500',
            });

            setCode('');
            navigate('pools');
        } catch (err) {
            console.log(err);
            if (err.response?.status === 404) {
                return toast.show({
                    title: 'Bolão não encontrado. Tente outro código.',
                    placement: 'top',
                    bgColor: 'red.500',
                });
            }
            if (err.response?.status === 409) {
                return toast.show({
                    title: 'Você já está nesse bolão. Tente outro código.',
                    placement: 'top',
                    bgColor: 'red.500',
                });
            }
            toast.show({
                title: 'Não foi possível encontrar o bolão. Por favor, tente novamente.',
                placement: 'top',
                bgColor: 'red.500',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Criar novo bolão" showBackButton={true} backRoute="pools" />
            <VStack mt={8} mx={5} alignItems="center">
                <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
                    Encontre um bolão através de seu código único
                </Heading>

                <Input mb={2} placeholder="Qual o código do bolão?" onChangeText={setCode} value={code} autoCapitalize="characters" />

                <Button title="Buscar bolão" isLoading={isLoading} onPress={handleJoinPool} />
            </VStack>
        </VStack>
    );
}