import { FC, useState } from "react";
import { Container, Box } from "@chakra-ui/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TextInput from "./components/TextInput";
import KeywordsModal from "./components/KeywordsModal";

const App: FC = () => {
  const [keywords, setKeywords] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const extractKeywords = async (text: string) => {
    setIsLoading(true);
    setIsOpen(true);

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt:
          "Extract keywords from this text. Make the first letter of each word uppercase and separate with commas\n\n" +
          text +
          "",
        temperature: 0.5,
        max_tokens: 60,
        frequency_penalty: 0.8,
      }),
    };

    const response: Response = await fetch(
      import.meta.env.VITE_OPENAI_API_URL,
      options
    );

    const json = await response.json();

    const data = json.choices[0].text.trim();

    console.log(data);
    setKeywords(data);
    setIsLoading(false);
  };

  const closeModal = (): void => {
    setIsOpen(false);
  };

  return (
    <Box bg="blue.600" color="white" paddingTop={130}>
      <Container maxW="3xl" centerContent>
        <Header />
        <TextInput extractKeywords={extractKeywords} />
        <Footer />
      </Container>
      <KeywordsModal
        keywords={keywords}
        isLoading={isLoading}
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </Box>
  );
};

export default App;
