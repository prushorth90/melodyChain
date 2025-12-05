package com.melodyforge.service;

import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.sagemakerruntime.SageMakerRuntimeClient;
import software.amazon.awssdk.services.sagemakerruntime.model.InvokeEndpointRequest;
import software.amazon.awssdk.services.sagemakerruntime.model.InvokeEndpointResponse;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
public class MusicGenService {

    @Value("${aws.sagemaker.endpoint}")
    private String endpointName;

    private final SageMakerRuntimeClient sagemakerClient;

    public MusicGenService() {
        this.sagemakerClient = SageMakerRuntimeClient.create();
    }

    public byte[] generateAudio(String technicalPrompt) {
        // 1. Prepare JSON Payload
        String payload = String.format("{\"inputs\": [\"%s\"]}", technicalPrompt);

        // 2. Build Request
        InvokeEndpointRequest request = InvokeEndpointRequest.builder()
                .endpointName(endpointName)
                .contentType("application/json")
                .body(SdkBytes.fromUtf8String(payload))
                .build();

        // 3. Call AWS SageMaker (MusicGen)
        InvokeEndpointResponse response = sagemakerClient.invokeEndpoint(request);

        // 4. Return Audio Bytes (WAV)
        return response.body().asByteArray();
    }
}