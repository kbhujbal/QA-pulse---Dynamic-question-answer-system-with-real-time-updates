from typing import List, Dict
import os
import requests
import json

class LLMWrapper:
    def __init__(self):
        self.api_key = "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"
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
        
        self.system_prompt = """You are a technical Q&A assistant. Your task is to generate helpful, accurate, and concise answers to technical questions.
        Guidelines:
        1. Provide clear, well-structured answers
        2. Include relevant code examples when appropriate
        3. Keep answers concise but informative
        4. Focus on practical, actionable information
        5. If the question is unclear, ask for clarification
        6. If you're not sure about something, acknowledge the uncertainty
        """

    def generate_suggestions(self, question: str, num_suggestions: int = 3) -> List[Dict[str, str]]:
        """
        Generate multiple suggested answers for a given question using Groq's API.
        """
        try:
            prompt = f"""Given the following technical question, generate {num_suggestions} different but relevant answers.
            Each answer should be unique and provide different insights or approaches.
            
            Question: {question}
            
            Generate {num_suggestions} answers in the following JSON format:
            {{
                "suggestions": [
                    {{"answer": "first answer", "approach": "brief description of this approach"}},
                    {{"answer": "second answer", "approach": "brief description of this approach"}},
                    ...
                ]
            }}
            """

            payload = {
                "model": "meta-llama/llama-4-scout-17b-16e-instruct",
                "messages": [
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,  
                "max_tokens": 1000
            }

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            }

            response = requests.post(
                self.api_url,
                headers=headers,
                json=payload
            )

            if response.status_code == 200:
                response_data = response.json()
                try:
                    suggestions_data = json.loads(response_data["choices"][0]["message"]["content"])
                    return [
                        {
                            "answer": suggestion["answer"],
                            "relevance_score": 1.0,  # Since these are LLM-generated, we consider them highly relevant
                            "approach": suggestion.get("approach", "General answer")
                        }
                        for suggestion in suggestions_data["suggestions"]
                    ]
                except (json.JSONDecodeError, KeyError):
                    return self._generate_fallback_suggestions(question, num_suggestions)
            else:
                print(f"Error from Groq API: {response.status_code} - {response.text}")
                return self._generate_fallback_suggestions(question, num_suggestions)

        except Exception as e:
            print(f"Error generating suggestions: {str(e)}")
            return self._generate_fallback_suggestions(question, num_suggestions)

    def _generate_fallback_suggestions(self, question: str, num_suggestions: int) -> List[Dict[str, str]]:
        """
        Generate fallback suggestions when the main generation fails.
        """
        fallback_answers = [
            "I understand you're asking about this topic. Could you provide more specific details about what you'd like to know?",
            "This is an interesting question. To provide a more accurate answer, could you clarify your specific requirements or concerns?",
            "I'd be happy to help with this. Could you share more context about what you're trying to achieve?"
        ]
        
        return [
            {
                "answer": answer,
                "relevance_score": 0.5,
                "approach": "General guidance"
            }
            for answer in fallback_answers[:num_suggestions]
        ] 