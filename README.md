# **AI-Powered Resume Screening Model**

## Overview

The AI-powered Resume Screening Model is designed to streamline the recruitment process by automating resume evaluation. This model takes a candidate's resume and a job description as input and determines whether the candidate is a good fit based on text similarity analysis. The system leverages BERT-based embeddings and machine learning techniques to enhance accuracy.

## Features
1) **BERT-based Text Embeddings:** Converts resume and job description text into high-dimensional vectors.

2) **Similarity Calculation:** Measures how closely a resume matches a job description.

3) **ML-Based Classification:** Predicts the suitability of candidates for a given job role.

4) **AI-Powered Chatbot:** A chatbot interface that allows users to input resumes and job descriptions for real-time screening.

5) **Local Database**: Integrated with a local database so that user can store their chats and view them

5) **Frontend:** Built using HTML, CSS, and JavaScript with a 3D UI.

6) **Deployment-Ready:** Can be deployed on cloud platforms, GitHub, or integrated into HR systems.

7) **Files Supported:** User can input there Resumes in **pdf** and **text** format

## Technologies Used

1) **Natural Language Processing (NLP):** BERT for text embeddings and sentence transformers for tokenization and other procceses

2) **Machine Learning:** Classification model(RandomForest) for accuracy assessment

3) **Frontend:** HTML, CSS, JavaScript

4) **Backend:** Python (Flask)

5) **Deployment:** Docker, GitHub Actions, Cloud-based services

## Installation

1) **Clone the repository:**

        ```bash
        git clone https://github.com/yourusername/ai-resume-screening.git
        cd ai-resume-screening

2) **Create a virtual environment and install dependencies:**

        ```python
        python -m venv venv
        ```

        ```python
        venv\Scripts\activate
        ```

        ```python
        pip install -r requirements.txt
        ```

3) **Run the backend server:**

        ```python
        python app.py


## Usage

1) Upload a pdf file or paste the text directly.

2) Enter the job description.

3) The AI model will analyze and return a compatibility score with hiring recommendations.

4) Chatbot interaction allows users to get insights in real-time.

## Deployment using DOCKER

        ```bash
        docker build -t RESUME SCREENING .
        docker run -p 5000:5000 ai-resume-screening
        ```

## Future Enhancements

1) Advanced feature engineering for better screening accuracy

2) Integration with ATS (Applicant Tracking Systems)

3) Support for multiple languages

4) Expanded File Support: Additional file formats will be supported in future versions.

## ScreenShot

![Screenshot of Chatbot](Images/Screenshot(54).png)

## Contribution

Contributions are welcome! Fork the repo, create a feature branch, and submit a pull request.

## Contact

For inquiries or collaborations, reach out to madhavbhatia25123@gmail.com.
