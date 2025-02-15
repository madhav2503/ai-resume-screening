from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from sentence_transformers import SentenceTransformer
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

# Load BERT model for text embeddings
bert_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# Load pre-trained ML model
ml_model = joblib.load("models/random_forest_model_2.pkl")

# Function to calculate similarity between resume and job description
def calculate_similarity(resume_text, job_description):
    if not isinstance(resume_text, str) or not isinstance(job_description, str):
        raise ValueError("resume_text and job_description must be valid strings")

    # Generate embeddings using Sentence-BERT
    resume_embedding = bert_model.encode(resume_text)
    job_embedding = bert_model.encode(job_description)

    # Convert to PyTorch tensors
    resume_embedding = torch.tensor(resume_embedding).view(1, -1)
    job_embedding = torch.tensor(job_embedding).view(1, -1)

    # Compute cosine similarity
    similarity = torch.nn.functional.cosine_similarity(resume_embedding, job_embedding).item()
    return similarity

# API route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        data = request.get_json()

        # Debugging: Print received data
        print("Received Data:", data)

        if data is None:
            return jsonify({"error": "Invalid JSON payload or Content-Type is not application/json"}), 400

        # Extract required fields
        resume_text = data.get('resume_text', None)
        job_description = data.get('job_description', None)

        # Debugging: Print extracted values
        print("Resume Text:", resume_text)
        print("Job Description:", job_description)

        # Validate input
        if not isinstance(resume_text, str) or not isinstance(job_description, str):
            return jsonify({"error": "Both 'resume_text' and 'job_description' must be non-empty strings"}), 400

        # Calculate similarity score
        similarity_score = calculate_similarity(resume_text, job_description)

        # Apply selection criteria (threshold: 0.7)
        selected = 1 if similarity_score >= 0.7 else 0

        # Predict qualification using ML model
        qualified_prediction = ml_model.predict(np.array([[selected]]))[0]

        # Prepare and return response
        return jsonify({
            "similarity_score": similarity_score,
            "selected": "Yes" if selected == 1 else "No",
            "qualified": "Yes" if qualified_prediction == 1 else "No"
        })

    except Exception as e:
        print("Error:", str(e))  # Print error in console for debugging
        return jsonify({"error": str(e)}), 500

# Run Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

