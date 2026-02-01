# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
# Safe-Sakhi-Silent.-Smart.-Surakshit.

# Safe Sakhi – Silent, Smart, Surakshit

Safe Sakhi is a real-time safety application designed to provide a secure and monitored travel experience. It leverages Firebase for backend services and Genkit for AI-powered features like incident summarization and safer route suggestions.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN/UI](https://ui.shadcn.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Generative AI:** [Genkit](https://firebase.google.com/docs/genkit) (with Google Gemini)

---

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Firebase](https://firebase.google.com/) account.

---

### 1. Firebase Project Setup

This application requires a Firebase project to handle authentication and data storage.

1.  **Create a Firebase Project:**
    - Go to the [Firebase Console](https://console.firebase.google.com/).
    - Click **"Add project"** and follow the on-screen instructions.

2.  **Add a Web App:**
    - In your project's dashboard, click the Web icon (`</>`) to add a new web application.
    - Register your app. When you see the `firebaseConfig` snippet, copy the configuration values. You will need them for your environment file.

3.  **Enable Authentication:**
    - In the left menu, go to **Build > Authentication**.
    - Click **"Get started"**.
    - Under the **Sign-in method** tab, select **Email/Password** and enable it.

4.  **Create Firestore Database:**
    - In the left menu, go to **Build > Firestore Database**.
    - Click **"Create database"**.
    - **IMPORTANT:** When prompted for security rules, select **Start in test mode**. This will allow the application to read and write data during development.
    - Choose a location for your database (e.g., `nam5 (us-central)`). Click **Enable**.

---

### 2. Local Environment Setup

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Create Environment File:**
    - In the root of the project, create a new file named `.env`.
    - Copy the contents from `.env.example` into your new `.env` file.

4.  **Configure Environment Variables:**
    - Open your `.env` file and fill in the Firebase configuration values you copied earlier.
    - **(Optional for AI features)**: To enable the Genkit AI features, you need a Gemini API Key.
        - Get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).
        - Add the key to the `GEMINI_API_KEY` variable in your `.env` file.

---

### 3. Running the Application

Once your setup is complete, you can run the development server:

```bash
npm run dev
```

The application will now be running at [http://localhost:9002](http://localhost:9002).

---

### 4. Running Genkit AI Flows (Optional)

If you have configured your `GEMINI_API_KEY`, you can run the Genkit development UI to inspect and test the AI flows separately.

```bash
npm run genkit:dev
```

This will start the Genkit developer UI, typically on [http://localhost:4000](http://localhost:4000).
