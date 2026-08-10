# Lab 02 - PDF Ingestion RAG

This lab walks through building a simple RAG pipeline in a Jupyter notebook. You will ingest a PDF document, generate embeddings, store them in a vector database, and query a language model with retrieved context. This gives you a hands-on understanding of the core components that make up a RAG system.

## Learning Outcomes

- Load and parse a PDF document into text chunks
- Generate embeddings using a model served on OpenShift AI
- Store and retrieve embeddings from a vector store
- Query an LLM with retrieved document context to produce grounded answers
- Understand the end-to-end flow of a basic RAG pipeline

## Prerequisites

- [Lab 00 - OpenShift AI Setup](../00-openshift-ai-setup/) completed
- A running Jupyter notebook workbench

## Steps

### Step 1 - Open the Notebook

1.1. In your Jupyter workbench, open the provided notebook for this lab.

### Step 2 - Install Dependencies

2.1. Run the dependency installation cell to install the required Python packages.

### Step 3 - Load and Parse the PDF

3.1. Upload a sample PDF to your workbench environment.

3.2. Run the cell that loads the PDF and splits it into text chunks.

3.3. Inspect the output to understand how the document has been chunked.

### Step 4 - Generate Embeddings

4.1. Run the cell that sends the text chunks to the embedding model.

4.2. Observe the embedding vectors being generated and stored in the vector database.

### Step 5 - Query with RAG

5.1. Run the query cell with a question related to the PDF content.

5.2. Observe how the system retrieves relevant chunks and passes them as context to the LLM.

5.3. Review the model's response and confirm it is grounded in the document.

### Step 6 - Experiment

6.1. Try different questions to test the retrieval quality.

6.2. Adjust the number of retrieved chunks and observe how it affects the response.
