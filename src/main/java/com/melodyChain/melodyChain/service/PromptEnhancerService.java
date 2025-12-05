package com.melodyforge.service;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromptEnhancerService {

    private final EmbeddingStore<TextSegment> pinecone;
    private final EmbeddingModel huggingFace;
    private final ChatLanguageModel bedrockLLM; // Assume this is configured via LangChain/AWS

    public PromptEnhancerService(EmbeddingStore<TextSegment> pinecone,
                                 EmbeddingModel huggingFace,
                                 ChatLanguageModel bedrockLLM) {
        this.pinecone = pinecone;
        this.huggingFace = huggingFace;
        this.bedrockLLM = bedrockLLM;
    }

    public String enhance(String userRawInput) {
        // 1. Embed user input using Hugging Face
        var queryEmbedding = huggingFace.embed(userRawInput).content();

        // 2. Search Pinecone for similar "Professional Prompts"
        List<EmbeddingMatch<TextSegment>> matches = pinecone.findRelevant(queryEmbedding, 3);
        String examples = matches.stream()
                .map(m -> m.embedded().text())
                .collect(Collectors.joining("\n"));

        // 3. Ask LLM to rewrite the prompt using those examples
        String instruction = "You are a music producer. " +
                "The user wants: '" + userRawInput + "'. " +
                "Here are technical examples of similar styles: \n" + examples +
                "\nWrite a single technical prompt for MusicGen based on this.";

        return bedrockLLM.generate(instruction);
    }
}