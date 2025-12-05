package com.melodyChain.melodyChain.config;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.huggingface.HuggingFaceEmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.pinecone.PineconeEmbeddingStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    @Value("${hf.api.key}")
    private String hfApiKey;

    @Value("${pinecone.api.key}")
    private String pineconeKey;

    @Value("${pinecone.index}")
    private String pineconeIndex;

    // 1. Configure Hugging Face to turn Text -> Vectors
    @Bean
    public EmbeddingModel embeddingModel() {
        return HuggingFaceEmbeddingModel.builder()
                .accessToken(hfApiKey)
                .modelId("sentence-transformers/all-MiniLM-L6-v2") // Standard small model
                .waitForModel(true)
                .build();
    }

    // 2. Configure Pinecone to Store/Retrieve Vectors
    @Bean
    public EmbeddingStore<TextSegment> embeddingStore() {
        return PineconeEmbeddingStore.builder()
                .apiKey(pineconeKey)
                .environment("us-east-1-aws")
                .projectId("YOUR_PROJECT_ID")
                .index(pineconeIndex)
                .build();
    }
}
