package com.melodychain.controller;

import com.melodychain.service.MusicGenService;
import com.melodychain.service.PromptEnhancerService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/music")
public class MusicController {

    private final PromptEnhancerService enhancer;
    private final MusicGenService generator;

    public MusicController(PromptEnhancerService enhancer, MusicGenService generator) {
        this.enhancer = enhancer;
        this.generator = generator;
    }

    @PostMapping(value = "/generate", produces = "audio/wav")
    public byte[] createSong(@RequestBody String userIdea) {
        // Step 1: LangChain + Pinecone + HF enhances the prompt
        String proPrompt = enhancer.enhance(userIdea);
        System.out.println("Generated Technical Prompt: " + proPrompt);

        // Step 2: AWS SageMaker generates the audio
        return generator.generateAudio(proPrompt);
    }
}