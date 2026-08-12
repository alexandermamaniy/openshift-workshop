# Lab 02 - PDF Ingestion RAG

This lab takes the RAG concept from Lab 01 and implements it programmatically in a Jupyter notebook. You will connect to the LlamaStack distribution created in the previous lab, install the required libraries, ingest a PDF document into a vector database, and build an AI agent that uses retrieved context to answer questions. By building this cell by cell, you will understand each component of the RAG pipeline and how they fit together.

## Learning Outcomes

- Work with Jupyter notebooks cell by cell, understanding what each piece of code does
- Connect to a LlamaStack distribution running on OpenShift from a notebook
- Use the LlamaStack client to list available models and select an LLM and embedding model
- Understand the RAG ingestion pipeline: download, upload, chunk, embed, and store in a vector database
- Build an AI agent that uses file search over the vector store to answer questions
- Compare an LLM response with and without RAG context to understand when and why RAG is valuable

## Prerequisites

- [Lab 00 - OpenShift AI Setup](../../00-openshift-ai-setup/lab/) completed
- [Lab 01 - GenAI Playground & RAG](../../01-genai-playground-rag/lab/) completed (the LlamaStack distribution must be running)

## Steps

### Step 1 - Find the LlamaStack Service URL

To connect to the LlamaStack distribution from our notebook, we need to find its internal service name on the cluster. This is how pods communicate with each other within OpenShift.

1.1. Go to the OpenShift console.

1.2. Navigate to **Networking** > **Services** in the left-hand side bar.

1.3. Make sure you are viewing your project namespace.

1.4. Find the service for your LlamaStack distribution and note its name. The URL will follow this format:

```
http://<service-name>.<your-namespace>:8321
```

Keep this URL handy — you will use it in the next steps.

### Step 2 - Create a New Notebook

2.1. Open your Jupyter workbench (created in Lab 00).

2.2. Create a new Python 3 notebook.

2.3. Give it a name (e.g. `simple-pdf-ingestion-chatbot`).

### Step 3 - Install Dependencies

The LlamaStack client library lets us interact with the LlamaStack server from Python. We install a specific version to ensure compatibility.

3.1. In the first cell, enter and run:

> **Tip:** For each new cell you add, consider adding a **Markdown cell** above it with a short title (e.g. `## Install Dependencies`, `## List Models`). This makes your notebook easier to read and navigate. To add a Markdown cell, click the **+** button and change the cell type from "Code" to "Markdown" in the dropdown.

```python
%pip install llama_stack==0.7.2
%pip install llama_stack_client==0.7.2
```

3.2. Once installed, click **Kernel** in the top menu bar, then select **Restart Kernel and Clear Outputs of All Cells**. This ensures the newly installed libraries are loaded into the notebook environment.

### Step 4 - List Available Models

Before writing any RAG logic, let's verify we can connect to the LlamaStack distribution and see which models are available.

4.1. In a new cell, enter and run:

```python
from llama_stack_client import LlamaStackClient

client = LlamaStackClient(base_url="http://<service-name>.<your-namespace>:8321")
client.models.list()
```

Replace `<service-name>` and `<your-namespace>` with the values from Step 1.

4.2. You should see a list of models returned, including your generative AI model and an embedding model. The output will look similar to this:

```
[Model(id='sentence-transformers/ibm-granite/granite-embedding-125m-english', ...),
 Model(id='endpoint-1/llama-scout-17b', ...),
 Model(id='sentence-transformers/nomic-ai/nomic-embed-text-v1.5', ...)]
```

### Step 5 - Set the LLM and Embedding Model

We need to select which model to use for generating responses (the LLM) and which to use for creating embeddings (for RAG). The embedding model converts text into numerical vectors that can be compared by similarity. The default embedding model provided by the LlamaStack distribution is `sentence-transformers/ibm-granite/granite-embedding-125m-english`.

5.1. In a new cell, enter and run:

```python
from llama_stack_client import LlamaStackClient

client = LlamaStackClient(base_url="http://<service-name>.<your-namespace>:8321")

models = client.models.list()

# Set the generative AI model (LLM) for chat responses
model_id = "<your-ai-model-id>"

# Automatically find the first embedding model and extract its config
embedding_model_id = (
    em := next(m for m in models if m.model_type == "embedding")
).identifier
embedding_dimension = em.metadata["embedding_dimension"]

print(model_id)
print(embedding_model_id)
```

Replace `<your-ai-model-id>` with your model ID — you will find it in the output from the previous step when listing models.

5.2. Verify both model IDs are printed correctly. The output should look similar to:

```
endpoint-1/llama-scout-17b # or the name of your generative AI model
sentence-transformers/ibm-granite/granite-embedding-125m-english
```

### Step 6 - Ask the LLM a Question (Without RAG)

Let's first ask the LLM a personal question it cannot possibly know the answer to. This establishes a baseline before we add RAG.

6.1. In a new cell, enter and run:

```python
from llama_stack_client import Agent, AgentEventLogger, LlamaStackClient

# Create a basic agent with no RAG tools
agent = Agent(
    client,
    model=model_id,
    instructions="""
    You are a helpful assistant.
    Answer questions briefly and to the best of your knowledge.
    """,
)

prompt = "What does Christian Zaccaria like to do in his free time?"
print("prompt>", prompt)

# Create a turn (a single conversation exchange) in a new session
response = agent.create_turn(
    messages=[{"role": "user", "content": prompt}],
    session_id=agent.create_session("rag_session_0"),  # Each session tracks conversation history
    stream=True,
)

# Print each token as it arrives from the model
for log in AgentEventLogger().log(response):
    print(log, end="", flush=True)
```

6.2. Observe that the model does not know the answer — it has no information about this in its training data. The output will look similar to:

```
prompt> What does Christian Zaccaria like to do in his free time?
🤔 I'm not aware of information about Christian Zaccaria's personal life or hobbies...
```

### Step 7 - Download, Chunk, and Ingest the PDF

This is where the RAG pipeline comes together. The code below will:

1. Download a PDF from a URL (this PDF contains information about Christian Zaccaria)
2. Upload it to the LlamaStack file storage
3. Create a vector store that automatically chunks the document, generates embeddings, and indexes them for similarity search

7.1. In a new cell, enter and run:

```python
import io
from llama_stack_client import Agent, AgentEventLogger, LlamaStackClient
import requests

vector_db_name = "my_knowledge_base"
client = LlamaStackClient(base_url="http://<service-name>.<your-namespace>:8321")

# List of PDF URLs to ingest
sources = ["https://raw.githubusercontent.com/ChristianZaccaria/redbank-kb/main/christian-about.pdf"]

# Download each PDF and upload to LlamaStack file storage
file_ids = []
for source in sources:
    print("Downloading and uploading document:", source)
    response = requests.get(source)
    file_content = io.BytesIO(response.content)
    filename = source.split("/")[-1]

    file = client.files.create(
        file=(filename, file_content, "application/pdf"),
        purpose="assistants"
    )
    file_ids.append(file.id)
    print(f"✓ Uploaded {filename} (file_id: {file.id})")

# Create a vector store: chunks the docs, generates embeddings, and indexes them
vector_store = client.vector_stores.create(
    name=vector_db_name,
    file_ids=file_ids,
    chunking_strategy={
        "type": "static",
        "static": {
            "max_chunk_size_tokens": 512,
            "chunk_overlap_tokens": 128
        }
    },
    extra_body={
        "embedding_model": embedding_model_id,
        "embedding_dimension": embedding_dimension,
        "provider_id": "milvus"
    }
)
print("Created vector store with ID:", vector_store.id)
```

7.2. Wait for the cell to complete. You should see confirmation that the document was uploaded and the vector store was created:

```
Downloading and uploading document: https://raw.githubusercontent.com/ChristianZaccaria/redbank-kb/main/christian-about.pdf
✓ Uploaded christian-about.pdf (file_id: file-6a1cf483...)
Created vector store with ID: vs_93687105-29a8-41fe-...
```

### Step 8 - Define the RAG Agent

Now we create an agent that uses the `file_search` tool to retrieve relevant chunks from the vector store before generating a response.

8.1. In a new cell, enter and run:

```python
def run_agent(text: str | None = None):
    # Create an agent with file_search tool for RAG
    agent = Agent(
        client,
        model=model_id,
        instructions="""
        You are a helpful assistant who answer questions by using the file_search tool.
        - Do not show your reasoning steps.
        - Do not add any filler, speculation, or statements such as "based on the information provided" or "unfortunately...".
        - DO NOT include say "This is a fact" or "For more FAQs", or any file references.
        - DO NOT mention source files or document references in your response.
        - End your response right after the relevant steps or answer.
        """,
        tools=[
            {
                "type": "file_search",
                "vector_store_ids": [vector_store.id]  # Search our vector store
            }
        ],
    )

    if text is not None:
        prompt = text
        print("prompt>", prompt)

    # Create a turn (conversation exchange)
    response = agent.create_turn(
        messages=[{"role": "user", "content": prompt}],
        session_id=agent.create_session("rag_session"),
        stream=False,
    )
    final_text = response.output_text
    print("response>", final_text)
```

### Step 9 - Query the RAG Agent

9.1. In a new cell, test the agent with a question about the ingested document:

```python
run_agent("When is Christian Zaccaria having a workshop?")
```

You should see a response grounded in the PDF content:

```
prompt> When is Christian Zaccaria having a workshop?
response> Christian Zaccaria is having a workshop on OpenShift AI on August 26th, 2026, at the IBM Office.
```

9.2. In another new cell, try a different question:

```python
run_agent("What does Christian Zaccaria like doing?")
```

9.3. Observe that the agent now provides accurate answers by retrieving relevant chunks from the PDF. Compare this to the response in Step 6 where the model had no context.

### Step 10 - Experiment

10.1. Try asking questions that are not covered in the PDF and observe how the agent handles them.

10.2. Create your own GitHub repository and upload one or more PDF files about any topic — for example, your hobbies, favourite music, a recipe book, a research paper, or meeting notes. Then add the raw URLs to the `sources` list in Step 7 to ingest them. You can add as many as you like:

```python
sources = [
    "https://raw.githubusercontent.com/<your-username>/<your-repo>/main/document-1.pdf",
    "https://raw.githubusercontent.com/<your-username>/<your-repo>/main/document-2.pdf",
]
```

## Next Steps

You have now built a RAG pipeline programmatically. In the next lab, you will extend this into a full end-to-end voice-enabled assistant with Speech-to-Text and Text-to-Speech models:

- [Lab 03 - Red Bank Financial RAG](../../03-redbank-financial-rag/lab/)
