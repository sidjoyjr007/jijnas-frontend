export const STATUS = {
  STARTED: "Started",
  NOT_STARTED: "Not Started",
  COMPLETED: "Completed"
};

export const localToUTC = (localDate) => {
  let localTime = new Date(localDate);
  let utcTime = new Date(
    localTime.getTime() + localTime.getTimezoneOffset() * 60000
  );

  return utcTime.valueOf();
};

export const utcToLocal = (utcDate) => {
  let utcTime = new Date(utcDate);
  let localTime = new Date(
    utcTime.getTime() - utcTime.getTimezoneOffset() * 60000
  );
  return localTime.valueOf();
};

export const getTimeDifference = (timestamp1, timestamp2) => {
  // Calculate the difference in milliseconds
  const differenceInMs = Math.abs(timestamp1 - timestamp2);

  // Convert milliseconds to total seconds
  const totalSeconds = Math.floor(differenceInMs / 1000);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { minutes, seconds };
};

export const getEventStatus = (startTime, timings) => {
  const timingsInMilli = timings * 60 * 1000;
  const completionTime = utcToLocal(startTime + timingsInMilli);
  const currentTime = new Date().valueOf();
  if (utcToLocal(startTime) > currentTime) return STATUS.NOT_STARTED;
  else if (completionTime < currentTime) return STATUS.COMPLETED;
  else return STATUS.STARTED;
};

export const generatePromptForQuiz = (
  level,
  info,
  quizNumber,
  questionsToAvoid = undefined
) => {
  const context = questionsToAvoid
    ? `and please do not repeat questions on these topics ${questionsToAvoid} and related to those topics`
    : "";
  return `Generate a list of exactly ${quizNumber} multiple-choice quizzes with a difficulty level of '${level}' on the topic '${info}'. The response must strictly include exactly ${quizNumber} questions. If the response contains fewer or more questions, it will not be accepted. 
${context}
Please verify that the total number of questions is ${quizNumber} and provide all questions in one response in the following JSON format:

Expected JSON Format:
{
"quizzes": 
  [
    {
      "question": "<Enter the quiz question here>",
      "options": [
        {
          "value": "<Enter the option text here>",
          "id": "<Generate a UUID for this option>",
          "rightAnswer": <true/false to indicate the correct answer>
        }
      ],
      "explanation": "<Provide an explanation if necessary>",
      "questionName": "<Assign a concise one-word name for the question, but name should not reveal answer>"
    }
  ]
}

1. Provide exactly ${quizNumber} distinct questions.
2. Ensure each question is unique, relevant, and has the correct format.
3. Include explanations where necessary.

Ensure the total number of questions matches exactly ${quizNumber} and provide all questions in one response.`;
};

export const difficultyOptions = [
  { id: "easy", label: "EASY" },
  { id: "medium", label: "MEDIUM" },
  { id: "hard", label: "HARD" }
];

export const numberOfQuizOptions = [
  { id: "10-20", label: "10-20" },
  { id: "20-30", label: "20-30" },
  { id: "30-40", label: "30-40" },
  { id: "40-50", label: "40-50" }
];
