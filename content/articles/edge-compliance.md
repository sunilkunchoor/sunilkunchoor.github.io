---
title: "AI-Powered QSR: Edge Compliance & Benchmarking"
date: "2026-06-28"
summary: "A benchmarking study of small form factor hardware devices managing edge AI workloads for Quick Service Restaurants (QSRs)."
tags: ["Edge AI", "OpenVINO", "Benchmarking", "AWS IoT"]
author: "Sunil Kunchoor Basavaraju"
---

Deploying machine learning models in cloud environments is a well-understood paradigm, but doing so on **commercial off-the-shelf (COTS) edge devices** at physical retail locations introduces unique constraints. In Quick Service Restaurants (QSRs), low latency, privacy-preserving interactions, and zero-reliance on unstable internet connections are critical.

This case study reviews the architecture, component design, and hardware optimization pipelines for an **AI-powered customer experience system** running entirely at the edge in QSR environments.

---

## Architecture Overview

The system enables a hands-free, conversational ordering kiosk or drive-through experience. It runs four tightly coupled AI workloads concurrently on a single local hardware unit, communicating through a high-speed internal event bus to process interactions locally without cloud inference round-trips.

```mermaid
flowchart TB
    subgraph CUSTOMER["👤 Customer Interaction"]
        MIC["🎤 Microphone"]
        CAM["📷 Camera"]
        DISPLAY["🖥️ Display"]
    end

    subgraph EDGE_DEVICE["🔲 Edge Device (Intel / AMD)"]
        direction TB
        subgraph PIPELINE["AI Processing Pipeline"]
            direction LR
            FD["Face Detection\n(Proximity Sensor)"]
            SR["Speech Recognition\n(Noise vs Trigger Word)"]
            ASR_MOD["ASR Engine\n(NeMo / DeepSpeech)"]
            NLP_MOD["NLP Engine\n(Conversational AI)"]
        end

        BUS["🔗 Internal Message Bus"]
        APP["QSR Application Controller"]
    end

    subgraph AWS_CLOUD["☁️ AWS Ecosystem"]
        direction TB
        S3["S3\n(Training Data)"]
        SAGEMAKER["SageMaker\n(Model Training)"]
        ECR["ECR\n(Container Registry)"]
        CODEPIPELINE["CodePipeline\n(CI/CD)"]
        IOT["IoT Greengrass\n(Edge Deployment)"]
    end

    CAM --> FD
    MIC --> SR
    FD -->|"Person Detected"| APP
    SR -->|"Trigger Detected"| ASR_MOD
    ASR_MOD -->|"Transcribed Text"| NLP_MOD
    NLP_MOD -->|"Response"| APP
    APP --> DISPLAY

    FD <--> BUS
    SR <--> BUS
    ASR_MOD <--> BUS
    NLP_MOD <--> BUS
    BUS <--> APP

    S3 --> SAGEMAKER
    SAGEMAKER --> ECR
    ECR --> CODEPIPELINE
    CODEPIPELINE --> IOT
    IOT -.->|"OTA Model Update"| EDGE_DEVICE

    style CUSTOMER fill:#1a1a2e,stroke:#6754E9,color:#fff
    style EDGE_DEVICE fill:#0f0f23,stroke:#00d084,color:#fff
    style AWS_CLOUD fill:#0d1117,stroke:#fcb900,color:#fff
    style PIPELINE fill:#16213e,stroke:#6754E9,color:#fff
    style BUS fill:#6754E9,stroke:#fff,color:#fff
```

---

## Core AI Components

### 1. Speech Recognition (Noise vs. Trigger Word)
To avoid continuous, resource-heavy speech-to-text processing, the audio pipeline employs a lightweight, always-on binary classifier as its primary gatekeeper. 

```
┌─────────────────────────────────────────────────┐
│              Audio Input Stream                  │
│                    │                             │
│         ┌─────────▼──────────┐                   │
│         │  Pre-processing    │                   │
│         │  (VAD + Noise Gate)│                   │
│         └─────────┬──────────┘                   │
│                   │                              │
│         ┌─────────▼──────────┐                   │
│         │  Trigger Word      │                   │
│         │  │  Classifier     │                   │
│         └───┬──────────┬─────┘                   │
│             │          │                         │
│       ┌─────▼───┐ ┌────▼─────┐                   │
│       │  NOISE  │ │ TRIGGER  │──► Activate ASR   │
│       │ (Ignore)│ │ DETECTED │                   │
│       └─────────┘ └──────────┘                   │
└─────────────────────────────────────────────────┘
```

A **Voice Activity Detection (VAD)** module acts as a pre-filter, discarding frames below a decibel threshold. Remaining signals are passed to a trigger word model (tuned to wake-phrases like *"Hey Dave"*). This structure ensures minimal idle power usage.

### 2. Automatic Speech Recognition (ASR)
Once a wake trigger is verified, the system routes the microphone stream into the ASR engine to convert audio to text in real-time. We benchmarked two primary setups:

* **NVIDIA NeMo (Conformer/CTC)**: Delivers superior transcription accuracy, particularly under noisy conditions, but demands a larger hardware compute profile.
* **Mozilla DeepSpeech (RNN/LSTM)**: Offers a lightweight runtime alternative optimized for lower-power CPUs.

```mermaid
flowchart LR
    A["Raw Audio\nBuffer"] --> B["Mel-Spectrogram\nFeature Extraction"]
    B --> C["ASR Model\n(NeMo / DeepSpeech)"]
    C --> D["CTC Decoder\n+ Language Model"]
    D --> E["Transcribed\nText"]
    E --> F["→ NLP Engine"]

    style A fill:#1a1a2e,stroke:#6754E9,color:#fff
    style C fill:#16213e,stroke:#00d084,color:#fff
    style F fill:#0f0f23,stroke:#fcb900,color:#fff
```

Models are evaluated on **Word Error Rate (WER)** using domain-specific menu corpora, as well as tail latency configurations (P90, P99) to prevent delays during ordering.

### 3. Patented NLP Dialogue Engine
Before modern LLMs, we developed a highly optimized, patented natural language processor. The engine interprets intents and processes entities with near-zero latency, avoiding the high cost and latency of cloud-hosted generative systems.

```
Customer: "I'd like a large combo number 3"
  → Intent:  order_item
  → Entities: {size: "large", item: "combo #3"}
  → Response: "Got it — a large combo number 3. Would you like to add a drink?"

Customer: "Yes, a medium Coke"
  → Intent:  add_item
  → Entities: {size: "medium", item: "Coke"}
  → Response: "Added a medium Coke. Anything else?"
```

### 4. Proximity Face Detection
A custom-trained face detection model serves as the physical wake-up trigger. When a customer walks up to the kiosk display, the camera pipeline wakes the interface and readies the microphone, powering back down to standby when the customer leaves.

```mermaid
stateDiagram-v2
    [*] --> Standby
    Standby --> FaceDetected : Camera detects face
    FaceDetected --> DisplayOn : Wake display
    DisplayOn --> Listening : Activate audio pipeline
    Listening --> Processing : Trigger word detected
    Processing --> Listening : Response delivered
    Listening --> Timeout : No face for N seconds
    Timeout --> Standby : Power down display
```

This privacy-first pipeline does not perform facial recognition or identity log capture.

---

## Inter-Component Communication

Services run inside independent containers on the edge operating system and coordinate asynchronously through an internal event bus.

```mermaid
flowchart LR
    subgraph SERVICES["Component Services"]
        FD["Face Detection"]
        SR["Speech Recognition"]
        ASR_S["ASR Engine"]
        NLP_S["NLP Engine"]
    end

    BUS["Message Bus"]

    FD <-->|"face_detected\nface_lost"| BUS
    SR <-->|"trigger_detected\nnoise_classified"| BUS
    ASR_S <-->|"transcription_ready\naudio_chunk"| BUS
    NLP_S <-->|"intent_parsed\nresponse_ready"| BUS

    APP["QSR Application\nController"] <--> BUS

    style BUS fill:#6754E9,stroke:#fff,color:#fff
    style APP fill:#00d084,stroke:#fff,color:#000
```

---

## Hardware Benchmarking & Optimization

To run these concurrent networks on affordable hardware, we targeted two key compilation ecosystems:

### Intel OpenVINO Compilation
Models are compiled from PyTorch/TensorFlow to **ONNX**, converted to the OpenVINO Intermediate Representation (`.xml` / `.bin`), and quantized to **INT8** using the Post-Training Optimization Tool. Deployments run on Intel Core i7 NUC units utilizing onboard Intel Iris graphics.

### AMD Vitis AI compilation
For FPGA or adaptive SoC-based platforms, models are quantized and mapped to target Deep Processing Unit (DPU) architectures via the Vitis AI compiler.

---

## AWS MLOps Lifecycle

Retraining models on live interaction data and deploying updates Over-the-Air (OTA) is automated using a containerized CI/CD workflow:

```mermaid
flowchart TB
    subgraph DATA["1️⃣ Data Collection"]
        EDGE_LOGS["Edge Device Logs\n(Audio + Interaction Data)"]
        EDGE_LOGS --> KINESIS["Amazon Kinesis\n(Data Stream)"]
        KINESIS --> S3_RAW["S3 Bucket\n(Raw Training Data)"]
    end

    subgraph TRAINING["2️⃣ Model Training"]
        S3_RAW --> SAGEMAKER["Amazon SageMaker\n(Training Jobs)"]
        SAGEMAKER --> S3_MODELS["S3 Bucket\n(Trained Models)"]
        SAGEMAKER --> CW["CloudWatch\n(Training Metrics)"]
    end

    subgraph VALIDATION["3️⃣ Validation & Registry"]
        S3_MODELS --> LAMBDA["Lambda\n(Validation Tests)"]
        LAMBDA -->|"Pass"| ECR["Amazon ECR\n(Model Registry)"]
        LAMBDA -->|"Fail"| SNS["SNS\n(Alert Team)"]
    end

    subgraph DEPLOYMENT["4️⃣ Edge Deployment"]
        ECR --> CODEPIPELINE["CodePipeline\n(CI/CD Orchestration)"]
        CODEPIPELINE --> GREENGRASS["IoT Greengrass\n(Edge Runtime)"]
        GREENGRASS -->|"OTA Update"| DEVICE_A["QSR Device A"]
        GREENGRASS -->|"OTA Update"| DEVICE_B["QSR Device B"]
        GREENGRASS -->|"OTA Update"| DEVICE_N["QSR Device N"]
    end

    style DATA fill:#1a1a2e,stroke:#6754E9,color:#fff
    style TRAINING fill:#0f0f23,stroke:#00d084,color:#fff
    style VALIDATION fill:#16213e,stroke:#fcb900,color:#fff
    style DEPLOYMENT fill:#0d1117,stroke:#cf2e2e,color:#fff
```

Edge devices stream anonymous logs to Amazon Kinesis. Retraining runs in SageMaker, and deployment is securely handled via **AWS IoT Greengrass**, pushing container updates directly to restaurant sites.

---

## Load Testing with Locust

We designed stress-testing scenarios using the **Locust** load-testing library. Distributed worker nodes generate concurrent API requests imitating multiple digital kiosks submitting audio frames and ordering requests.

```mermaid
flowchart LR
    subgraph LOCUST["Locust Load Generator"]
        MASTER["Master Node"]
        W1["Worker 1"]
        W2["Worker 2"]
        W3["Worker N"]
    end

    subgraph QSR["QSR Application (Target)"]
        EP1["/api/speech-recognize"]
        EP2["/api/asr/transcribe"]
        EP3["/api/nlp/converse"]
        EP4["/api/face/detect"]
        EP5["/api/order/submit"]
    end

    MASTER --> W1
    MASTER --> W2
    MASTER --> W3
    W1 --> EP1
    W1 --> EP2
    W2 --> EP3
    W2 --> EP4
    W3 --> EP5

    style LOCUST fill:#1a1a2e,stroke:#6754E9,color:#fff
    style QSR fill:#0f0f23,stroke:#00d084,color:#fff
```

By profiling latency distributions under Locust loads, we successfully adjusted core threading, CPU pinning, and memory-mapped model cache sizes to prevent lag during lunchtime rushes.

---

## White Paper & Additional Resources

For detailed metrics, device specs, and performance charts, please consult the complete published study:
📄 **[Benchmarking Study for QSRs to Implement AI-Powered CX](https://www.iamdave.ai/whitepaper/benchmarking-study-for-qsrs-to-implement-ai-powered-cx/)**