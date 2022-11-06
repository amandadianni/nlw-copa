import { Heading, Text, useClipboard, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import Logo from '../assets/logo.svg';
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";

export function New() {
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const { onCopy } = useClipboard();

    async function handlePoolCreate() {
        if (!title.trim()) {
            toast.show({
                title: 'Informe um nome para o seu bolão',
                placement: 'top',
                bgColor: 'red.500',
            });
            return;
        }
        try {
            setIsLoading(true);

            const response = await api.post('/pools', { title });
            const { code } = response.data;
            
            onCopy(code);

            toast.show({
                title: 'Bolão criado com sucesso! O código foi copiado para a área de transferência.',
                placement: 'top',
                bgColor: 'green.500',
            });

            setTitle('');
        } catch (err) {
            console.log(err);
            toast.show({
                title: 'Não foi possível criar o bolão. Por favor, tente novamente.',
                placement: 'top',
                bgColor: 'red.500',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Criar novo bolão" />
            <VStack mt={8} mx={5} alignItems="center">
                <Logo />
                <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
                    Crie seu próprio bolão da copa e compartilhe com seus amigos!
                </Heading>

                <Input mb={2} placeholder="Qual nome do seu bolão?" onChangeText={setTitle} value={title} />

                <Button title="Criar meu bolão" onPress={handlePoolCreate} isLoading={isLoading} />
                <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
                    Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas.
                </Text>
            </VStack>
        </VStack>
    );
}