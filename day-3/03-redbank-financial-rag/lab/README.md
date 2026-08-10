# Lab 03 - Red Bank Financial RAG (End-to-End)

This lab brings together a full end-to-end voice-enabled RAG assistant for Red Bank Financial. You will record a question using your browser's microphone, transcribe it with a Whisper STT model, pass it to a RAG-powered agent backed by Red Bank Financial's knowledge base, and convert the agent's response into spoken audio using a TTS model. This demonstrates a real-world use case combining multiple AI models in a single pipeline.

## Learning Outcomes

- Record audio input using browser-based microphone capture in a Jupyter notebook
- Transcribe speech to text using a remotely hosted Whisper model
- Build a RAG agent with document ingestion and vector search
- Convert text responses to speech using a TTS API
- Run a complete voice-in, voice-out AI pipeline end-to-end

## Prerequisites

- [Lab 00 - OpenShift AI Setup](../00-openshift-ai-setup/) completed
- A running Jupyter notebook workbench
- Access to the Whisper STT model endpoint
- Familiarity with the concepts from Lab 02

## Steps

### Step 1 - Open the Notebook

1.1. In your Jupyter workbench, open the provided notebook for this lab.

### Step 2 - Install Dependencies

2.1. Run the dependency installation cell (`lab-mic`, `llama-stack-client`, `scipy`, etc.).

### Step 3 - Configure Endpoints

3.1. Set the Whisper STT endpoint URL and API key.

3.2. Set the TTS API URL.

3.3. Set the LlamaStack endpoint URL.

### Step 4 - Ingest the Knowledge Base

4.1. Upload the Red Bank Financial documents to the workbench.

4.2. Run the ingestion cell to parse, embed, and store the documents in the vector store.

### Step 5 - Record a Question

5.1. Run the cell that displays the microphone recording widget.

5.2. Click **Record**, speak your question, then click **Stop**.

### Step 6 - Run the Pipeline

6.1. Run the pipeline cell which performs the following:

- Saves the recording as a WAV file
- Transcribes the audio using the Whisper STT model
- Sends the transcribed text to the RAG agent
- Converts the agent's response to speech using the TTS model
- Plays the audio response in the notebook

### Step 7 - Experiment

7.1. Ask different questions about Red Bank Financial.

7.2. Try changing the TTS voice or speed settings.

7.3. Observe how the RAG agent retrieves relevant information from the knowledge base.

## Architecture

```
🎙️ Microphone → Whisper STT → LLM + RAG → TTS → 🔊 Speaker
```
